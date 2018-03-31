import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/header';
import Tree from './components/tree';

import 'milligram/dist/milligram.css'

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

ReactDOM.render(
  <div className="container">
    <div className="row">
      <div className="column">
        <Header />
        <Tree />
      </div>
    </div>
  </div>,
  document.getElementById('root')
);
