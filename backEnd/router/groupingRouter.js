const express = require('express')
const router = express.Router()
const { getGroupings, addGrouping, editGroupingName, deleteGrouping } = require('../function/groupingFunction')
const { getFriends } = require('../function/friendFunction')

// 获取分组列表
router.post('/list', (req, res) => {
  let { userId } = req.body
  Promise.all([getGroupings(userId), getFriends(userId)]).then(data => {
    res.send(data[0], data[1])
  }).catch(error => {
    res.send(error[0], error[1])
  })
})

// 添加分组
router.post('/add', (req, res) => {
  let { userId, name } = req.body
  addGrouping(userId, name).then(data => {
    res.send(data)
  }).catch(error => {
    res.send(error)
  })
})

// 修改分组名称
router.post('/editName', (req, res) => {
  let { _id, name } = req.body
  editGroupingName(_id, name).then(data => {
    res.send(data)
  }).catch(error => {
    res.send(error)
  })
})

// 删除分组
router.post('/delete', (req, res) => {
  let { _id, userId } = req.body
  deleteGrouping(_id, userId).then(data => {
    res.send(data)
  }).catch(error => {
    res.send(error)
  })
})

module.exports = router
