const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const path = require('path');

const { errors } = require('celebrate');

const mongoose = require('mongoose');

const url = require('url');
const WebSocket = require('ws');

const PORT = process.env.PORT || 5000;

const bootstrapResources = require('./resources');
const createDispatcher = require('./dispatcher');

const app = express();

app.use(morgan('tiny'))

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to db!')
});

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// Parse JSON payloads
app.use(bodyParser.json());

const server = app.listen(PORT, function () {
  console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
});

const wss = new WebSocket.Server({ server });

dispatcher = createDispatcher(wss)
bootstrapResources(app, dispatcher)

app.use(errors());

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});
