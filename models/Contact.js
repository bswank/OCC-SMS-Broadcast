const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongodbErrorHandler = require('mongoose-mongodb-errors')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.Promise = global.Promise

const contactSchema = new Schema({
  phone: {
    type: String,
    unique: true,
    trim: true,
    required: 'Phone number is required.'
  },
  first: {
    type: String,
    required: 'Please enter your name.',
    trim: true
  },
  last: {
    type: String,
    required: 'Please enter your name.',
    trim: true
  }
})

contactSchema.plugin(uniqueValidator, { message: 'Oops! We already have your phone number.' })
contactSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('Contact', contactSchema)
