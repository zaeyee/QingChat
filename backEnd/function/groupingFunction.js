const DAO = require('../db/DAO')
const groupingModel = require('../db/model/groupingModel')
const groupingDAO = new DAO(groupingModel)
const { statusCode } = require('../config')

module.exports = {
  // 获取分组列表
  getGroupings(userId) {
    return new Promise((resolve, reject) => {
      userId = parseInt(userId)
      if (!userId) {
        return reject({ code: statusCode.Param, msg: '缺少参数' })
      }
      groupingDAO.find({ userId }, null, { sort: { serial: 1 } })
        .then(data => {
          resolve({ code: statusCode.Success, msg: 'success', data })
        }).catch(err => {
          reject({ code: statusCode.Fail, msg: 'fail: ' + err })
        })
    })
  },
  // 添加分组
  addGrouping(userId, name) {
    return new Promise((resolve, reject) => {
      userId = parseInt(userId)
      if (!userId || !name) {
        return reject({ code: statusCode.Param, msg: '缺少参数' })
      }
      groupingDAO.insert({ userId, name })
        .then(() => {
          resolve({ code: statusCode.Success, msg: 'success' })
        }).catch(err => {
          reject({ code: statusCode.Fail, msg: 'fail: ' + err })
        })
    })
  },
  // 修改分组名称
  editGroupingName(_id, userId, name) {
    return new Promise((resolve, reject) => {
      userId = parseInt(userId)
      if (!_id || !userId || !name) {
        return reject({ code: statusCode.Param, msg: '缺少参数' })
      }
      groupingDAO.findOneAndUpdate({ _id, userId }, { name })
        .then(data => {
          if (data.n > 0) {
            resolve({ code: statusCode.Success, msg: 'success' })
          } else {
            reject({ code: statusCode.NotExist, msg: '该分组不存在' })
          }
        }).catch(err => {
          reject({ code: statusCode.Fail, msg: 'fail: ' + err })
        })
    })
  },
  // 删除分组
  deleteGrouping(_id, userId) {
    return new Promise((resolve, reject) => {
      userId = parseInt(userId)
      if (!_id || !userId) {
        return reject({ code: statusCode.Param, msg: '缺少参数' })
      }
      const friendModel = require('../db/model/friendModel')
      const friendDAO = new DAO(friendModel)
      groupingDAO.findOne({ userId, isDefault: true }, '_id')
        .then(data => {
          // 修改该分组下的好友的分组id为默认分组id
          friendDAO.update({ groupingId: _id, $or: [{ applicantId: userId }, { recipientId: userId }] }, { groupingId: data._id })
        })
      groupingDAO.delete({ _id })
        .then(() => {
          resolve({ code: statusCode.Success, msg: 'success' })
        }).catch(err => {
          reject({ code: statusCode.Fail, msg: 'fail: ' + err })
        })
    })
  }
}