const DAO = require('../db/DAO')
const friendConfigModel = require('../db/model/friendConfigModel')
const friendConfigDAO = new DAO(friendConfigModel)
const { statusCode } = require('../config')

module.exports = {
  // 获取单个好友设置
  getFriendConfig(userId, friendId) {
    return new Promise((resolve, reject) => {
      userId = parseInt(userId)
      friendId = parseInt(friendId)
      if (!userId || !friendId) {
        return reject({ code: statusCode.Param, msg: '缺少参数' })
      }
      friendConfigDAO.findOne({ userId, friendId })
        .then(data => {
          resolve({ code: statusCode.Success, msg: 'success', data })
        }).catch((err) => {
          reject({ code: statusCode.Fail, msg: 'fail: ' + err })
        })
    })
  }
}
