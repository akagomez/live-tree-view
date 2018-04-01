const mongoose = require('mongoose');

module.exports = {
  FactoryNode: mongoose.model('FactoryNode',
    mongoose.Schema({
      name: String,
      numberOfChildren: Number,
      lowerBound: Number,
      upperBound: Number
    })
  )
}