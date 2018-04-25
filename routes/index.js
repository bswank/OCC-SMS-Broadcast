const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Contact = mongoose.model('Contact')
require('dotenv').config({ path: '.env' })

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/test', (req, res) => {
  res.render('test')
})

router.get('/send', (req, res) => {
  res.render('send')
})

router.get('/contacts', async (req, res) => {
  const contacts = await Contact.find()
  res.render('contacts', { contacts })
})

router.post('/send', async (req, res) => {
  await client.messages
    .create({
      body: req.body.message,
      to: `${req.body.to}`,
      from: '+17172104996'
    })
    .then(async (message) => {
      await req.flash('success', 'SMS Sent')
      res.redirect('/')
    })
    .catch(async (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error(error.message)
      }
      await req.flash('success', error.message)
      res.redirect('/')
    })
})

router.post('/add', async (req, res) => {
  await new Contact({
    first: req.body.first,
    last: req.body.last,
    phone: req.body.phone
  }).save()
  res.redirect('/')
})

router.post('/sendToAll', async (req, res) => {
  const contacts = await Contact.find()
  let errors = []
  for (let i = 0; i < contacts.length; i++) {
    try {
      await client.messages.create({
        body: req.body.message,
        to: contacts[i].phone,
        from: '+17172104996'
      })
    } catch (error) {
      errors.push(error)
    }
  }
  if (errors) {
    await req.flash('success', `SMS Sent to ${contacts.length} contacts with ${errors.length} errors.`)
    for (let j = 0; j < errors.length; j++) {
      await req.flash('error', errors[j].message)
    }
  } else {
    await req.flash('success', `SMS Sent to ${contacts.length} contacts.`)
  }
  res.redirect('/')
})

// const MessagingResponse = require('twilio').twiml.MessagingResponse;

// const response = new MessagingResponse();
// const message = response.message();
// message.body('Hello World!');
// response.redirect('https://demo.twilio.com/welcome/sms/');

// console.log(response.toString());

module.exports = router
