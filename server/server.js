import path from 'path'
import express from 'express'
import mongoose from 'mongoose'
import { MongoClient } from 'mongodb'
import template from './../template'
import config from "./../config/config"
import app from './express'
//comment out before building for production
import devBundle from './devBundle'

// Connection URL
mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } )
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`)
})
const app = express()
//comment out before building for production
devBundle.compile(app)

const CURRENT_WORKING_DIR = process.cwd()
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

app.get('/', (req, res) => {
  res.status(200).send(template())
})

// let port = process.env.PORT || 3000
app.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', config.port)
})

// Database Connection URL
// const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-skeleton'
// // Use connect method to connect to the server
// MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },(err, db)=>{
//   console.log("Connected successfully to mongodb server")
//   db.close()
// })
interestingConnection
