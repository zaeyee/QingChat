const express = require('express')
const router = express.Router()
const { getUserProfile } = require('../function/userFunction')

// 搜索用户
router.post('/user', (req, res) => {
  let { keyword } = req.body
  getUserProfile(keyword).then(data => {
    res.send(data)
  }).catch(error => {
    res.send(error)
  })
})

module.exports = router
