require('dotenv').config()
const knex = require('knex')
const LogService = require('./log-service')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})

console.log(LogService.getAllLog())