const mongoose = require('mongoose')
const sequence = require('./sequenceModel')

const userScheme = new mongoose.Schema({
  id: { type: Number, unique: true },                     // 数字id
  email: { type: String },                                // 邮箱
  password: { type: String },                             // 密码
  nickname: { type: String },                             // 昵称
  avatar: { type: String, default: '' },                  // 头像(链接)
  gender: { type: Number, default: 0 },                   // 性别，0:未知 1:男  2:女
  intro: { type: String, default: '' },                   // 简介
  registerTime: { type: Date, default: Date.now() },      // 注册时间
  usable: { type: Boolean, default: true }                // 是否可用
})

userScheme.pre('save', function (next) {
  const that = this
  sequence.increment('User').then(data => {
    if (data.number <= 10000) {
      sequence.set('User', 10001).then(data => {
        that.id = that.nickname = data.number
        next()
      })
    } else {
      that.id = that.nickname = data.number
      next()
    }
  }).catch(err => {
    throw err
  })
})

module.exports = mongoose.model('user', userScheme)
