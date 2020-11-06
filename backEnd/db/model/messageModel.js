const mongoose = require('mongoose')

const messageScheme = new mongoose.Schema({
  senderId: { type: Number },                       // 发送方ID
  receiverId: { type: Number },                     // 接收方ID
  type: { type: Number },                           // 类型，1:文本 2:图片  3:视频  4:语音  5:位置
  content: { type: String },                        // 内容
  addition: { type: mongoose.Schema.Types.Mixed },  // 附加内容
  sendTime: { type: Date, default: Date.now() }     // 发送时间
})

module.exports = mongoose.model('message', messageScheme)
