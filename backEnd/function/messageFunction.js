const DAO = require('../db/DAO')
const messageModel = require('../db/model/messageModel')
const messageDAO = new DAO(messageModel)
const { statusCode } = require('../config')
const { isFriend } = require('../function/friendFunction')
const { isVaildDate } = require('../util/util')

module.exports = {
  // 获取消息列表
  getMessages(userId, lastTime) {
    return new Promise((resolve, reject) => {
      if (!userId) {
        return reject({ code: statusCode.Param, msg: '缺少参数' })
      }
      if (!isVaildDate(lastTime)) {
        // 默认查询三天内的消息
        lastTime = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3)
      }
      messageDAO.find({ $or: [{ senderId: userId }, { receiverId: userId }], sendTime: { $gt: lastTime } }, null, { sendTime: -1 })
        .then(data => {
          resolve({ code: statusCode.Success, msg: 'success', data })
        }).catch(err => {
          reject({ code: statusCode.Fail, msg: 'fail: ' + err })
        })
    })
  },
  // 发送消息
  sendMessage(userId, receiverId, type, content, addition) {
    return new Promise((resolve, reject) => {
      if (!userId || !receiverId || !type || !content) {
        return reject({ code: statusCode.Param, msg: '缺少参数' })
      }
      isFriend(userId, receiverId).then(is => {
        if (is) {
          messageDAO.insert({ senderId: userId, receiverId, type, content, addition })
            .then(() => {
              resolve({ code: statusCode.Success, msg: 'success' })
            }).catch(err => {
              reject({ code: statusCode.Fail, msg: 'fail: ' + err })
            })
        } else {
          reject({ code: statusCode.Fail, msg: '该用户不是您的好友' })
        }
      })
    })
  }
}