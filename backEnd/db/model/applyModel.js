const mongoose = require('mongoose')

// 好友申请
const applyScheme = new mongoose.Schema({
  applicantId: { type: Number },                            // 申请用户ID
  targetId: { type: Number },                               // 目标用户ID
  groupingId: { type: mongoose.Schema.Types.ObjectId },     // 分组id
  message: { type: String, default: '' },                   // 申请留言
  noteName: { type: String, default: '' },                  // 备注
  applyTime: { type: Date, default: Date.now() },           // 申请时间
  isRead: { type: Boolean, default: false },                // (目标用户)是否已读
  isAccept: { type: Number, default: 0 },                   // (目标用户)是否同意，0:未同意 1:已同意 2:拒绝
  // isDelete: { type: Number, default: 0 }                    // 是否删除，0:都未删除 1:申请用户删除  2:目标用户删除  3:都已删除
})

module.exports = mongoose.model('apply', applyScheme)
