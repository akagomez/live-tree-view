import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// Create a new WebSocket.
// var socket = new WebSocket('wss://echo.websocket.org');
var socket = new WebSocket(`wss://${window.location.host}/ws`);
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
