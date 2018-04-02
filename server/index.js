const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression')
const morgan = require('morgan')
const path = require('path');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const WebSocket = require('ws');

const bootstrapResources = require('./resources');
const createDispatcher = require('./dispatcher');

const PORT = process.env.PORT || 5000;

const app = express();

// Enable gzip compression
app.use(compression())

// Resolve static files
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// Parse JSON payloads
app.use(bodyParser.json());

// Log HTTP requests
app.use(morgan('tiny'))

// Start the HTTP server
const server = app.listen(PORT, function () {
  console.error(`Listening on port ${PORT}`);
});

// Monitor the database connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`Connected to ${process.env.MONGODB_URI}`)
});

// Initialize the database connection
mongoose.connect(process.env.MONGODB_URI)

// Add support for WebSockets to the existing server
const wss = new WebSocket.Server({ server });

// Coordinate client WebSocket subscriptions
dispatcher = createDispatcher(wss)

// Create the necessary HTTP endpoints
bootstrapResources(app, dispatcher)

// Handle all validation errors
app.use(errors());

// Send unresolved requests to the single-page application
// to handle routing client-side
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});
