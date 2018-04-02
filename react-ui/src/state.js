import { store } from 'react-easy-state'

import {
  FactoryNode
} from './models'


import subscribe from './subscribe'

const state = store({
  async init () {
    const factoryNodes = await FactoryNode.findAll();
    let lastUpdated;

    if (factoryNodes) {
      this.factoryNodes = factoryNodes.map((node) => {
        return new FactoryNode(node)
      })

      lastUpdated = this.factoryNodes
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

  },
  factoryNodes: [],
  ui: {
    createFactoryForm: {
      isVisible: false,
      show () {
        this.isVisible = true
      },
      hide () {
        this.isVisible = false;
      },
      async submit (inputs) {

        let response;
        let factoryNode =
          new FactoryNode(inputs)

        response = await factoryNode.save()

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