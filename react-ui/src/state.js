import { store } from 'react-easy-state'

import {
  Tree,
  FactoryNode
} from './models'

const state = store({
  async init () {
    const tree = await Tree.findAll();

    this.tree.factoryNodes = tree.factoryNodes.map((node) => {
      return new FactoryNode(node)
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