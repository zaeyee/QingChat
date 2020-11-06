const DAO = require('../db/DAO')
const applyModel = require('../db/model/applyModel')
const applyDAO = new DAO(applyModel)
const { statusCode } = require('../config')

module.exports = {
  // 获取好友申请列表
  getApplies(userId) {
    return new Promise((resolve, reject) => {
      userId = parseInt(userId)
      if (!userId) {
        return reject({ code: statusCode.Param, msg: '缺少参数' })
      }
      applyDAO.find({ $or: [{ applicantId: userId }, { targetId: userId }] }, 'applicantId targetId message applyTime isRead isAccept', { sort: { applyTime: -1 } })
        .then(data => {
          resolve({ code: statusCode.Success, msg: 'success', data })
        }).catch(err => {
          reject({ code: statusCode.Fail, msg: 'fail: ' + err })
        })
    })
  },
  // 发送好友申请
  sendApply(applicantId, targetId, groupingId, message = '', noteName = '') {
    return new Promise((resolve, reject) => {
      applicantId = parseInt(applicantId)
      targetId = parseInt(targetId)
      if (!applicantId || !targetId) {
        return reject({ code: statusCode.Param, msg: '缺少参数' })
      }
      if (applicantId === targetId) {
        return reject({ code: statusCode.Param, msg: '不可添加自己为好友' })
      }
      const userModel = require('../db/model/userModel')
      const userDAO = new DAO(userModel)
      userDAO.findOne({ id: targetId })
        .then(userData => {
          if (userData) {
            // 不使用insert而使用 update及upsert选项 的原因：用户可能多次申请，但对方未处理或者未同意时更新申请信息
            applyDAO.findOneAndUpdate({ applicantId, targetId }, { groupingId, message, noteName, applyTime: Date.now(), isRead: 0, isAccept: 0 }, { upsert: true })
              .then(data => {
                const { _id, applicantId, targetId, message, applyTime, isRead, isAccept } = data
                resolve({ code: statusCode.Success, msg: 'success', data: { _id, applicantId, targetId, message, applyTime, isRead, isAccept } })
              }).catch(err => {
                reject({ code: statusCode.Fail, msg: 'fail: ' + err })
              })
          } else {
            reject({ code: statusCode.NotExist, msg: '目标用户不存在' })
          }
        }).catch(err => {
          reject({ code: statusCode.System, msg: 'fail: ' + err })
        })
    })
  },
  // 已读好友申请
  readApply(userId, latestTime) {
    return new Promise((resolve, reject) => {
      userId = parseInt(userId)
      if (!userId || !latestTime) {
        return reject({ code: statusCode.Param, msg: '缺少参数' })
      }
      applyDAO.update({ targetId: userId, applyTime: { $lte: latestTime } }, { isRead: true }).then(data => {
        if (data.n > 0) {
          resolve({ code: statusCode.Success, msg: 'success', data: { _id: data._id } })
        } else {
          reject({ code: statusCode.NotExist, msg: '好友申请不存在' })
        }
      }).catch(err => {
        console.log(err)
        reject({ code: statusCode.Fail, msg: 'fail: ' + err })
      })
    })
  },
  // 同意好友申请
  acceptApply(_id, userId, groupingId) {
    return new Promise((resolve, reject) => {
      userId = parseInt(userId)
      if (!_id || !userId || !groupingId) {
        return reject({ code: statusCode.Param, msg: '缺少参数' })
      }
      const friendModel = require('../db/model/friendModel')
      const friendDAO = new DAO(friendModel)
      const friendConfigModel = require('../db/model/friendConfigModel')
      const friendConfigDAO = new DAO(friendConfigModel)
      applyDAO.findOneAndUpdate({ _id, targetId: userId }, { isAccept: 1 })
        .then(applyData => {
          if (applyData) {
            const { applicantId, targetId: recipientId, groupingId: applicantGroupingId, noteName } = applyData
            // 不使用insert而使用 update及upsert选项 的原因：用户可能删除拉黑对或被对方删除拉黑，然后用户方重新申请，对方同意时更新好友信息
            // 建立好友关系
            const p1 = friendDAO.findOneAndUpdate({ applicantId, recipientId }, { generateTime: Date.now(), state: 0 }, { upsert: true })
            // 更新接受者对申请者好友设置
            const p2 = friendConfigDAO.findOneAndUpdate({ userId, friendId: applicantId }, { groupingId, noteName, disturb: true, topping: false }, { upsert: true })
            // 更新申请者对接受者好友设置
            const p3 = friendConfigDAO.findOneAndUpdate({ userId: applicantId, friendId: userId }, { groupingId: applicantGroupingId, noteName, disturb: true, topping: false }, { upsert: true })
            Promise.all([p1, p2, p3])
              .then(datas => {
                const recipientFriend = { ...datas[0]._doc, ...datas[1]._doc }
                const applicantFriend = { ...datas[0]._doc, ...datas[2]._doc }
                resolve({ code: statusCode.Success, msg: 'success', data: recipientFriend, applicantFriend })
              }).catch(err => {
                reject({ code: statusCode.Fail, msg: 'fail: ' + err })
              })
          } else {
            reject({ code: statusCode.NotExist, msg: '该申请不存在' })
          }
        }).catch(err => {
          reject({ code: statusCode.System, msg: 'fail: ' + err })
        })
    })
  },
  // 拒绝好友申请
  refuseApply(_id, userId) {
    return new Promise((resolve, reject) => {
      userId = parseInt(userId)
      if (!_id || !userId) {
        return reject({ code: statusCode.Param, msg: '缺少参数' })
      }
      applyDAO.findOneAndUpdate({ _id, targetId: userId }, { isAccept: 2 }).then(data => {
        if (data.n > 0) {
          const { _id, applicantId } = data
          resolve({ code: statusCode.Success, msg: 'success', data: { _id, applicantId } })
        } else {
          reject({ code: statusCode.NotExist, msg: '该申请不存在' })
        }
      }).catch(err => {
        reject({ code: statusCode.Fail, msg: 'fail: ' + err })
      })
    })
  },
  /* // 删除好友申请
  deleteApply(_id) {
    return new Promise((resolve, reject) => {
      if (!_id) {
        return reject({ code: statusCode.Param, msg: '缺少参数' })
      }
      applyDAO.findOneAndUpdate({ _id }, { state: 3 }).then(data => {
        if (data.n > 0) {
          resolve({ code: statusCode.Success, msg: 'success' })
        } else {
          reject({ code: statusCode.NotExist, msg: '该申请不存在' })
        }
      }).catch(err => {
        reject({ code: statusCode.Fail, msg: 'fail: ' + err })
      })
    })
  } */
}