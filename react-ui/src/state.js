import { store } from 'react-easy-state'

import {
  Tree,
  FactoryNode
} from './models'


import subscribe from './subscribe'

const state = store({
  async init () {
    const tree = await Tree.findOne(1);
    let lastUpdated;

    if (tree.results) {
      const factoryNodes = tree.results.map((node) => {
        return new FactoryNode(node)
      })

      this.tree.factoryNodes = factoryNodes

      lastUpdated = factoryNodes
        .map(n => n._updated)
        .sort()
        .reverse()
        .shift();
    }

    subscribe(lastUpdated, 1000, (message) => {

      const id = message.meta._id

      // TODO: Create a lookup map
      let matchingLocalNode;

      state.tree.factoryNodes.forEach((factoryNode, index) => {
        if (factoryNode._id === id) {
          matchingLocalNode = state.tree.factoryNodes[index]
        }
      })

      switch (message.type) {
        case 'NODE_CREATED':
          state.tree.factoryNodes = state.tree.factoryNodes.concat([
            new FactoryNode(message.meta)
          ])

          break;

        case 'NODE_UPDATED':
          matchingLocalNode.set(message.meta)
          break;

        case 'NODE_DESTROYED':
          state.tree.factoryNodes = state.tree.factoryNodes
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

  },
  tree: {
    factoryNodes: [],
  },
  ui: {
    createFactoryForm: {
      isVisible: false,
      errors: [],
      fields: {},
      show () {
        this.isVisible = true
      },
      hide () {
        this.isVisible = false;
      },
      async submit () {
        var response;
        var factoryNode =
          new FactoryNode(state.ui.createFactoryForm.fields)

        try {

          response = await factoryNode.save()
        } catch (err) {
          // NOTE: Updating an existing array does not
          // trigger a re-render
          this.errors = [err.response.data.message];
        }

        // Reset the form
        if (response) {
          this.fields = {}
          this.isVisible = false;
        }
      }
    }
  }
})

export default state;