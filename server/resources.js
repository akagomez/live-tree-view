const { celebrate, Joi, errors } = require('celebrate');

const {
  FactoryNode
} = require('./models')

module.exports = (app, dispatcher) => {

  // Represent a single "Tree" resource (this app only has one)
  app.get('/rest/tree/1', async (req, res) => {

    const results = await FactoryNode.find().sort('-_updated')

    res.json({
      data: {
        results
      }
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

      res.status(201)
      res.json({
        data: instance.toJSON()
      })

      dispatcher.send({
        type: 'NODE_CREATED',
        meta: instance.toObject()
      })

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

      dispatcher.send({
        type: 'NODE_DESTROYED',
        meta: {
          _id: req.params.id
        }
      })
    } else {
      res.sendStatus(404)
    }
  });

}