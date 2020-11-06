const mongoose = require('mongoose')

const groupScheme = new mongoose.Schema({
  name: { type: String },                       // 名称
  avatar: { type: String, default: '' },        // 头像(链接)
  intro: { type: String, default: '' },         // 简介
  founderId: { type: Number },                  // 拥有者ID
  managers: [Number],                           // 管理员(ID数组)
  members: [Number]                             // 成员(ID数组)
})

module.exports = mongoose.model('group', groupScheme)
