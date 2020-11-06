const express = require('express')
const router = express.Router()
const { getMessages, sendMessage } = require('../function/messageFunction')

// 获取消息列表
router.post('/list', (req, res) => {
  let { userId, lastTime } = req.body
  getMessages(userId, lastTime).then(data => {
    res.send(data)
  }).catch(error => {
    res.send(error)
  })
})

// 发送消息
router.post('/send', (req, res) => {
  let { userId, receiverId, type, content, addition } = req.body
  sendMessage(userId, receiverId, type, content, addition).then(data => {
    res.send(data)
  }).catch(error => {
    res.send(error)
  })
})

module.exports = router
