require('dotenv').config()
const express = require('express')
const models = require('./models')
const expressGraphQL = require('express-graphql')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const schema = require('./schema/schema')

const app = express()

const host = process.env.MONGODB_HOST
const port = process.env.MONGODB_PORT
const database = process.env.MONGODB_DATABASE
const username = process.env.MONGODB_USER
const password = encodeURIComponent(process.env.MONGODB_PASS)
// Replace with your mongoLab URI
const MONGO_URI = `mongodb://${username}:${password}@${host}:${port}/${database}`

if (!MONGO_URI) {
  throw new Error('You must provide a MongoLab URI')
}

mongoose.Promise = global.Promise
mongoose.connect(MONGO_URI)
mongoose.connection
  .once('open', () => console.log('Connected to MongoLab instance.'))
  .on('error', error => console.log('Error connecting to MongoLab:', error))

app.use(bodyParser.json())
app.use(
  '/graphql',
  expressGraphQL({
    schema,
    graphiql: true
  })
)

const webpackMiddleware = require('webpack-dev-middleware')
const webpack = require('webpack')
const webpackConfig = require('../webpack.config.js')
app.use(webpackMiddleware(webpack(webpackConfig)))

module.exports = app
