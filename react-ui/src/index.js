import React from 'react';
import ReactDOM from 'react-dom';

import { view, store } from 'react-easy-state'

import Header from './components/header';
import Tree from './components/tree';

import 'milligram/dist/milligram.css'
import './theme.css'

import {
  FactoryNode
} from './models'

import subscribe from './subscribe'

const state = store({
  factoryNodes: []
})

const App = view(() => (
  <div className="container">
    <div className="row">
      <div className="column">
        <Header />
        <Tree
          children={state.factoryNodes}
          onSubmitCreateForm={async (props) => {
            const factoryNode = new FactoryNode(props)
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
  async () => {
    const factoryNodes = await FactoryNode.findAll();
    let lastUpdated;

    if (factoryNodes) {
      state.factoryNodes = factoryNodes.map((node) => {
        return new FactoryNode(node)
      })

      lastUpdated = state.factoryNodes
        .map(n => n._updated)
        .sort()
        .reverse()
        .shift();
    }

    subscribe(lastUpdated, 1000, (message) => {

      const id = message.meta._id

      // TODO: Create a lookup map
      let matchingLocalNode;

      state.factoryNodes.forEach((factoryNode, index) => {
        if (factoryNode._id === id) {
          matchingLocalNode = state.factoryNodes[index]
        }
      })

      switch (message.type) {
        case 'NODE_CREATED':
          state.factoryNodes = [].concat(
            [new FactoryNode(message.meta)],
            state.factoryNodes)
          break;

        case 'NODE_UPDATED':
          Object.assign(matchingLocalNode, message.meta)
          break;

        case 'NODE_DESTROYED':
          state.factoryNodes = state.factoryNodes
            .filter((node) => node !== matchingLocalNode)
          break;

        default:
          console.error('Unhandled WS message:', message)
          break;
      }

    }, () => {
      console.error('Unable to subscribe, retrying...')
      state.init()
    })
  }
);
