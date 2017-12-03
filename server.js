const  express = require('express')
const  logger  = require('morgan')
const  errorhandler = require('errorhandler')
const  bodyParser = require('body-parser')
const app = express()
const mongodb= require('mongodb')
const async =  require('async')

const url = 'mongodb://localhost:27017/mongo-migration-script'
app.use(bodyParser.json())
app.use(logger('dev'))
app.use(errorhandler())