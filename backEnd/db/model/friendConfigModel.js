const mongoose = require('mongoose')

// 好友设置
const friendConfigScheme = new mongoose.Schema({
  userId: { type: Number },                                // 用户ID
  friendId: { type: Number },                               // 好友ID
  groupingId: { type: mongoose.Schema.Types.ObjectId },     // 分组ID
  noteName: { type: String, default: '' },                  // 备注
  disturb: { type: Boolean, default: true },                // 是否打扰(为false时消息免打扰)
  topping: { type: Boolean, default: false },               // 是否置顶
})

module.exports = mongoose.model('friendConfig', friendConfigScheme)
