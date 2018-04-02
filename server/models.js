const mongoose = require('mongoose');

module.exports = {
  Factory: mongoose.model('Factories',
    mongoose.Schema({
      name: String,
      numberOfChildren: Number,
      lowerBound: Number,
      upperBound: Number,
      numbers: [Number],
      _created: { type: Date, default: Date.now },
      _updated: { type: Date, default: Date.now }
    })
  )
}