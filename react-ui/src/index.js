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

const state = store({
  ui: {
    createFactoryForm: {
      isVisible: true,
      show () {
        this.isVisible = true
      },
      hide () {
        this.isVisible = false;
      }
    }
  },
  tree: {
    async fetch () {
      const response = await axios.get('/rest/tree/1');

      console.log(response.data)
    }
  }
})

// TODO: Remove after done debugging
window.state = state;

state.tree.fetch()

const App = view(() => (
  <div className="container">
    <div className="row">
      <div className="column">
        <Header />
        <Tree
          createFactoryFormIsVisible={state.ui.createFactoryForm.isVisible}
          onPromptCreateFactoryForm={() => state.ui.createFactoryForm.show()}
          onCancelFactoryCreate={() => state.ui.createFactoryForm.hide()}
        />
      </div>
    </div>
  </div>
))

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
