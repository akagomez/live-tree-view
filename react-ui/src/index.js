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
  factories: [],

  get factoriesById () {
    const map = {}
    this.factories.forEach((f) => map[f._id] = f)
    return map;
  }
})

const bootstrap = async () => {
  const factories = await Factory.findAll();
  let lastUpdated;

  if (factories) {
    state.factories = factories

    lastUpdated = state.factories
      .map(n => n._updated)
      .sort()
      .reverse()
      .shift();
  }

  // subscribe(lastUpdated, 1000, (message) => {

  //   const id = message.meta._id
  //   const factory = state.factoriesById[id]

  //   switch (message.type) {
  //     case 'NODE_CREATED':
  //       state.factories = [].concat(
  //         [new Factory(message.meta)],
  //         state.factories)
  //       break;
  //     case 'NODE_UPDATED':
  //       Object.assign(factory, message.meta)
  //       break;
  //     case 'NODE_DESTROYED':
  //       state.factories = state.factories
  //         .filter((node) => node !== factory)
  //       break;
  //     default:
  //       console.error('Unhandled WS message:', message)
  //       break;
  //   }

  // }, () => {
  //   console.error('Unable to subscribe, retrying...')
  //   bootstrap()
  // })
}

const App = view(() => (
  <div className="container">
    <div className="row">
      <div className="column">
        <Header />
        <Tree
          children={state.factories}
          onSubmitCreateForm={async (props) => {
            const factoryNode = new Factory(props)
            await factoryNode.save()
          }}
          onSubmitEditForm={async (child, props) => {
            await child.save(props)
            child.isEditing = false;
          }}
          onPressRemoveButton={child => child.destroy()}
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
