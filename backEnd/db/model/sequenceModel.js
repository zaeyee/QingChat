// 用于生成自增长的序列段，此处用于生成自增id
const mongoose = require('mongoose')
const DAO = require('../DAO')

const sequenceSchema = new mongoose.Schema({
  _id: { type: String },
  number: { type: Number, default: 0 }
})

const sequenceModel = mongoose.model('sequence', sequenceSchema)
const sequenceDAO = new DAO(sequenceModel)

module.exports = {
  get(schemaName) {
    return sequenceDAO.findOne({ _id: schemaName }, 'number')
  },
  set(schemaName, number) {
    return sequenceDAO.findOneAndUpdate({ _id: schemaName }, { number }, { upsert: true })
  },
  reset(schemaName) {
    return sequenceDAO.findOneAndUpdate({ _id: schemaName }, { number: 0 }, { upsert: true })
  },
  increment(schemaName) {
    return sequenceDAO.findOneAndUpdate({ _id: schemaName }, { $inc: { number: 1 } }, { upsert: true })
  },
  decrement(schemaName) {
    return sequenceDAO.findOneAndUpdate({ _id: schemaName }, { $inc: { number: -1 } }, { upsert: true })
  }
}