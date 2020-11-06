const mongoose = require('mongoose')

const groupingScheme = new mongoose.Schema({
  userId: { type: Number },                       // 用户ID
  serial: { type: Number, default: 0 },           // 序号(用于排序)
  name: { type: String },                         // 名称
  isDefault: { type: Boolean, default: false },   // 是否默认分组
})

module.exports = mongoose.model('grouping', groupingScheme)
