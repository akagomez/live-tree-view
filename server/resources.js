const { celebrate, Joi, errors } = require('celebrate');

const {
  Factory
} = require('./models')

/**
 * Request Validation
 **/

const paramsValidation = Joi.object().keys({
  id: Joi.string().required().regex(/^[\w]+$/)
})

const bodyValidation = Joi.object().keys({
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

/**
 * Utilities
 **/

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

/**
 * HTTP Endpoints
 **/

module.exports = (app, dispatcher) => {

  /**
   * List all Factories
   **/
  app.get('/rest/factories', async (req, res) => {
    const results = await Factory.find().sort('-_created')

    res.json({
      data: results
    })
  });

  /**
   * Create a Factory
   **/
  app.post('/rest/factories', celebrate({
    body: bodyValidation
  }), async (req, res) => {

    const createdFactory = new Factory(Object.assign({
      numbers: generateNumbers(req.body)
    }, req.body))

    createdFactory.save((err, instance) => {
      if (err) {
        res.sendStatus(400)
      };

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

  /**
   * Delete a Factory
   **/
  app.delete('/rest/factories/:id', celebrate({
    params: paramsValidation
  }), async (req, res) => {

    const response = await Factory.deleteOne({
      _id: req.params.id
    })

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

  /**
   * Update a Factory
   **/
  app.put('/rest/factories/:id', celebrate({
    params: paramsValidation,
    body: bodyValidation
  }), async (req, res) => {

    const response = await Factory.update({
      _id: req.params.id
    }, Object.assign({}, req.body, {
      numbers: generateNumbers(req.body),
      _updated: new Date()
    }))

    if (response && response.ok && response.n > 0) {
      const instance = await Factory.findById(req.params.id)

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