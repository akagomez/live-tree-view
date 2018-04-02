import React from 'react';
import ReactDOM from 'react-dom';

import { view, store } from 'react-easy-state'

import Header from './components/header';
import Tree from './components/tree';

import 'milligram/dist/milligram.css'
import './theme.css'

import {
  Factory
} from './models'

import subscribe from './subscribe'

const state = store({
  factoriesById: {},

  get factories () {
    let factories = []
    const ids = Object.keys(this.factoriesById)
    ids.forEach((id) => {
      factories.push(this.factoriesById[id])
    })

    factories = factories.sort((a, b) => {
      const result = new Date(a._created) < new Date(b._created)
      return result
    })

    return factories;
  }
})

const bootstrap = async () => {
  let factories
  let lastUpdated;

  // Disregard this failure since it probably just means
  // the server isn't responding to HTTP requests yet
  try {
    factories = await Factory.findAll();
  } catch (e) {}

  if (factories) {

    // Update our application state
    factories.forEach((model) => {
      state.factoriesById[model._id] = model
    })

    // Find our freshest update
    lastUpdated = state.factories
      .map(n => n._updated)
      .sort()
      .reverse()
      .shift();
  }

  console.log(`Attemting to subscribe from: ${lastUpdated}`)

  subscribe(lastUpdated, 1000, (message) => {

    const id = message.meta._id
    const factory = state.factoriesById[id]

    switch (message.type) {
      case 'NODE_CREATED':
        if (!factory) {
          state.factoriesById[id] = new Factory(message.meta)
        }
        break;
      case 'NODE_UPDATED':
        Object.assign(factory, message.meta)
        break;
      case 'NODE_DESTROYED':
        if (factory) {
          delete state.factoriesById[factory._id]
        }
        break;
      default:
        console.error('Unhandled WS message:', message)
        break;
    }

  }, () => {
    const retryInterval = 1000

    setTimeout(() => {
      bootstrap()
    }, retryInterval)

    console.error(`Resubscribing in ${retryInterval}ms...`)
  })
}

const App = view(() => (
  <div className="container">
    <div className="row">
      <div className="column">
        <Header />
        <Tree
          children={state.factories}
          onSubmitCreateForm={async (props) => {
            const factory = new Factory(props)
            await factory.save()
            state.factoriesById[factory._id] = factory
          }}
          onSubmitEditForm={async (factory, props) => {
            await factory.save(props)
          }}
          onPressRemoveButton={async (factory) => {
            await factory.destroy()
            delete state.factoriesById[factory._id]
          }}
        />
      </div>
    </div>
  </div>
))

ReactDOM.render(
  <App />,
  document.getElementById('root'),
  () => bootstrap()
);
