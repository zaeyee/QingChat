const express = require('express')
const router = express.Router()
const { getApplies, sendApply, acceptApply, refuseApply, deleteApply } = require('../function/applyFunction')

// 获取好友申请列表
router.post('/list', (req, res) => {
  let { userId } = req.body
  getApplies(userId).then(result => {
    res.send(result)
  }).catch(error => {
    res.send(error)
  })
})

// 发送好友申请
router.post('/send', (req, res) => {
  let { userId, groupingId, message = '', noteName = '' } = req.body
  sendApply(userId, groupingId, targetId, message, noteName).then(result => {
    res.send(result)
  }).catch(error => {
    res.send(error)
  })
})

// 同意好友申请
router.post('/accept', (req, res) => {
  let { _id, userId, groupingId } = req.body
  acceptApply(_id, userId, groupingId).then(result => {
    const { applicantFriend, ...data } = result
    res.send(data)
  }).catch(error => {
    res.send(error)
  })
})

// 拒绝好友申请
router.post('/refuse', (req, res) => {
  let { _id, userId } = req.body
  refuseApply(_id, userId).then(result => {
    res.send(result)
  }).catch(error => {
    res.send(error)
  })
})

/* // 删除好友申请
router.post('/delete', (req, res) => {
  let { _id } = req.body
  deleteApply(_id).then(result => {
    res.send(result)
  }).catch(error => {
    res.send(error)
  })
}) */

module.exports = router
