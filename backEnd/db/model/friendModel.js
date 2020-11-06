const mongoose = require('mongoose')

// 好友关系
const friendScheme = new mongoose.Schema({
  applicantId: { type: Number },                                                // 申请方ID
  recipientId: { type: Number },                                                // 接受方ID
  generateTime: { type: Date, default: Date.now() },                            // 生成时间
  state: { type: Number, default: 0 }                                           // 状态，0:正常 1:申请方删除  -1:接受方删除
})

module.exports = mongoose.model('friend', friendScheme)
