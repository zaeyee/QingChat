const DAO = require('../db/DAO')
const friendModel = require('../db/model/friendModel')
const friendDAO = new DAO(friendModel)
const { statusCode } = require('../config')

module.exports = {
  // 判断两个用户是否好友
  isFriend(userId1, userId2) {
    return new Promise((resolve, reject) => {
      userId1 = parseInt(userId1)
      userId2 = parseInt(userId2)
      if (!userId1 || !userId2) {
        return resolve(false)
      }
      if (userId1 === userId2) {
        return resolve(true)
      }
      friendDAO.findOne({ $or: [{ applicantId: userId1, receiverId: userId2 }, { applicantId: userId2, receiverId: userId1 }] })
        .then(data => {
          resolve(Boolean(data))
        })
    })
  },
  // 获取好友列表
  getFriends(userId) {
    return new Promise((resolve, reject) => {
      userId = parseInt(userId)
      if (!userId) {
        return reject({ code: statusCode.Param, msg: '缺少参数' })
      }
      friendDAO.find({ $or: [{ applicantId: userId }, { recipientId: userId }], state: 0 })
        .then(data => {
          resolve({ code: statusCode.Success, msg: 'success', data })
        }).catch((err) => {
          reject({ code: statusCode.Fail, msg: 'fail: ' + err })
        })
    })
  }
}