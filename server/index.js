const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const mongoose = require('mongoose');

const url = require('url');
const WebSocket = require('ws');

const PORT = process.env.PORT || 5000;

/**
 * Configures the individual process responding to HTTP/TCP connections
 **/
if (!cluster.isMaster) {
  const app = express();

  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI);

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('Connected to db!')
  });

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  // Represent a single "Tree" resource (this app only has one)
  app.get('/rest/tree/1', function (req, res) {
    res.json({
      data: {
        factories: [
          {
            name: 'Mock Factory',
            numberOfChildren: 10,
            lowerBound: 100,
            upperBound: 999
          }
        ]
      }
    })
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  const server = app.listen(PORT, function () {
    console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
  });

  const wss = new WebSocket.Server({ server });

  wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);

    // You might use location.query.access_token to authenticate or share sessions
    // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });

    ws.send('something');
  });

/**
 * Forks multiple process to utilize all CPU cores
 **/
} else {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });
}
