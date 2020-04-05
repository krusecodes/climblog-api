require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const logRouter = require('./log/log-router')

const app = express()
const jsonParser = express.json()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())
const LogService = require('./log/log-service')

app.use('/log', logRouter)
app.get('/log', (req, res, next) => {
  const knexInstance = req.app.get('db')
  LogService.getAllLog(knexInstance)
    .then(log => {
      res.json(log)
    })
    .catch(next)

})


app.post('/log', jsonParser, (req, res, next) => {
  console.log('req');
  // console.log(req.body);
  // console.log(res);
  
  const { climb_type, difficulty, attempts, rating, what_i_learned } = req.body
  const newLog = { climb_type, difficulty, attempts,rating, what_i_learned }
  LogService.insertLog(
    req.app.get('db'),
    newLog
  )
    .then(log => {
      console.log(log);
      
      res
        .status(201)
        // .location(`/log/${log.id}`)
        .json(log)
    })
    // .catch((err) => console.log(err))
    .catch(next)
  })

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

  app.use(function errorHandler(error, req, res, next) {
      let response
      if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
      } else {
        console.error(error)
        response = { message: error.message, error }
      }
      res.status(500).json(response)
    })

module.exports = app


// {
//   "climb_type": 'Bouldering (Indoor)',
//   "difficulty": 'V5',
//   "attempts": 9,
//   "rating": 5
// }