import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// TODO: Use a env variable that represents secure/insecure
// socket connections
var protocol = process.env.NODE_ENV === 'production' ? 'wss' : 'ws';
var socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

// TODO: Remove this once the interface is wired up
window.socket = socket;

// Handle any errors that occur.
socket.onerror = function(error) {
  console.log('WebSocket Error: ' + error);
};


// Show a connected message when the WebSocket is opened.
socket.onopen = function(event) {
  console.log('onopen: ' + event.currentTarget.url);
};


// Handle messages sent by the server.
socket.onmessage = function(event) {
  var message = event.data;
  console.log('onmessage:' + message);
};


// Show a disconnected message when the WebSocket is closed.
socket.onclose = function(event) {
  console.log('onclose');
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
