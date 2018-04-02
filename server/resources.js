const { celebrate, Joi, errors } = require('celebrate');

const {
  FactoryNode
} = require('./models')

const factoryValidation = Joi.object().keys({
  name: Joi.string().required().regex(/^[\w\-\s]+$/),
  numberOfChildren: Joi.number()
    .required()
    .integer()
    .min(1)
    .max(15),
  lowerBound: Joi.number()
    .min(1)
    .required()
    .integer(),
  upperBound: Joi.number()
    .min(1)
    .greater(Joi.ref('lowerBound'))
    .required()
    .integer(),
})

// TODO: Figure out how to move this into the model
const generateNumbers = (model) => {
  const numbers = []
  const lower = model.lowerBound;
  const upper = model.upperBound;

  for (let i = 0; i < model.numberOfChildren; i++) {
    numbers[i] =
      Math.round(lower + (Math.random() * (upper - lower)))
  }

  return numbers;
}

module.exports = (app, dispatcher) => {

  // Represent a single "Tree" resource (this app only has one)
  app.get('/rest/tree/1', async (req, res) => {

    const results = await FactoryNode.find().sort('-_created')

    res.json({
      data: {
        results
      }
    })
  });

  // Create Factory Nodes
  app.post('/rest/factory', celebrate({
    body: factoryValidation
  }), async (req, res) => {

    const createdFactoryNode = new FactoryNode(Object.assign({
      numbers: generateNumbers(req.body)
    }, req.body))

    createdFactoryNode.save((err, instance) => {
      if (err) return console.error(err);

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

  // Update Factory Nodes
  app.put('/rest/factory/:id', celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().regex(/^[\w]+$/)
    }),
    body: factoryValidation
  }), async (req, res) => {

    const response = await FactoryNode.update({
      _id: req.params.id
    }, Object.assign({}, req.body, {
      numbers: generateNumbers(req.body),
      _updated: new Date()
    }))

    if (response && response.ok && response.n > 0) {

      const instance = await FactoryNode.findById(req.params.id)

      res.status(201)
      res.json({
        data: instance.toJSON()
      })

      dispatcher.send({
        type: 'NODE_UPDATED',
        meta: instance.toObject()
      })

    } else {
      res.sendStatus(404)
    }
  });

}