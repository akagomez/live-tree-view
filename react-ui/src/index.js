import React from 'react';
import ReactDOM from 'react-dom';

import { view, store } from 'react-easy-state'

import Header from './components/header';
import Tree from './components/tree';

import axios from 'axios';

import 'milligram/dist/milligram.css'
import './theme.css'

const protocol = parseInt(process.env.REACT_APP_USE_SECURE_WEBSOCKETS, 10) ?
  'wss' : 'ws';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

// TODO: Remove this once the interface is wired up
window.socket = socket;

socket.onerror = function(error) {
  console.log('WebSocket Error: ' + error);
};

socket.onopen = function(event) {
  console.log('onopen: ' + event.currentTarget.url);
};

socket.onmessage = function(event) {
  var message = event.data;
  console.log('onmessage:' + message);
};

socket.onclose = function(event) {
  console.log('onclose');
};

class FactoryNode {
  constructor({
    _id,
    name,
    numberOfChildren,
    lowerBound,
    upperBound
  }) {
    this._id = _id
    this.name = name
    this.numberOfChildren = numberOfChildren
    this.lowerBound = lowerBound
    this.upperBound = upperBound
  }
  async destroy () {
    var response;

    try {
      response = await axios.delete(
        `/rest/factory/${this._id}`,
      );
    } catch (err) {
      console.error(err)
    }

    console.log(response)
  }
}

const state = store({
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

        try {
          response = await axios.post(
            '/rest/factory',
            state.ui.createFactoryForm.fields
          );
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
  },
  tree: {
    factoryNodes: [],
    async fetch () {
      const response = await axios.get('/rest/tree/1');

      console.log(response.data)

      this.factoryNodes = response.data.data.factoryNodes.map((node) => {
        return new FactoryNode(node)
      })
    }
  }
})

// TODO: Remove after done debugging
window.state = state;

const App = view(() => (
  <div className="container">
    <div className="row">
      <div className="column">
        <Header />
        <Tree
          children={state.tree.factoryNodes}
          createFactoryFormErrors={state.ui.createFactoryForm.errors}
          createFactoryFormIsVisible={state.ui.createFactoryForm.isVisible}
          onPromptCreateFactoryForm={() => state.ui.createFactoryForm.show()}
          onUpdateCreateFactoryField={(key, value) => {
            state.ui.createFactoryForm.fields[key] = value;
          }}
          onCancelCreateFactoryForm={() => state.ui.createFactoryForm.hide()}
          onSubmitCreateFactoryForm={() => state.ui.createFactoryForm.submit()}
          onDestroyChild={child => child.destroy()}
        />
      </div>
    </div>
  </div>
))

ReactDOM.render(
  <App />,
  document.getElementById('root'),
  () => {
    state.tree.fetch()
  }
);
