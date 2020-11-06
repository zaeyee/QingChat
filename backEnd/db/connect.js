const mongoose = require('mongoose')
const { db: dbConfig } = require('../config')

const uri = `mongodb://${dbConfig.user && dbConfig.pass ? dbConfig.user + ':' + dbConfig.pass + '@' : ''}${
  dbConfig.host
  }:${dbConfig.port}/${dbConfig.name}`

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => console.log(`Success! DB connected on ${uri}`))

module.exports = db