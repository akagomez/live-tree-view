const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const { celebrate, Joi, errors } = require('celebrate');

const mongoose = require('mongoose');

const url = require('url');
const WebSocket = require('ws');

const PORT = process.env.PORT || 5000;

var factoryNodeSchema = mongoose.Schema({
  name: String,
  numberOfChildren: Number,
  lowerBound: Number,
  upperBound: Number
});

var FactoryNode = mongoose.model('FactoryNode', factoryNodeSchema);

/**
 * Configures the individual process responding to HTTP/TCP connections
 **/
if (!cluster.isMaster) {
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

  // Represent a single "Tree" resource (this app only has one)
  app.get('/rest/tree/1', function (req, res) {

    FactoryNode.find(function (err, factoryNodes) {
      if (err) return console.error(err);

      res.json({
        data: {
          factoryNodes
        }
      })
    })
  });

  // Create Factory Nodes
  app.post('/rest/factory', celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().regex(/^[\w\-\s]+$/),
      numberOfChildren: Joi.number()
        .integer()
        .min(1)
        .max(15),
      lowerBound: Joi.number().integer(),
      upperBound: Joi.number().integer(),
    })
  }), async (req, res) => {

    console.log(req.body)

    const createdFactoryNode = new FactoryNode({
      name: req.body.name,
      numberOfChildren: req.body.numberOfChildren,
      lowerBound: req.body.lowerBound,
      upperBound: req.body.upperBound,
    })

    createdFactoryNode.save((err, instance) => {
      if (err) return console.error(err);

      console.log(instance)
    })

    res.json({
      data: {
        // TODO: Return created resource
      }
    })
  });

  // Delete Factory Nodes
  app.delete('/rest/factory/:id', celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().regex(/^[\w]+$/)
    })
  }), async (req, res) => {

    console.log(req.params)

    var response

    try {
      response = await FactoryNode.deleteOne({
        _id: req.params.id
      })
    } catch (err) {
      throw err
    }

    if (response && response.ok && response.n > 0) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  });

  app.use(errors());

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
