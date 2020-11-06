const express = require('express')
const router = express.Router()
const { getUserProfile, sendEmailCaptcha, userRegister, userLogin } = require('../function/userFunction')

// 获取单个用户信息(不包含私密信息)
router.post('/profile', (req, res) => {
  let { targetId } = req.body
  getUserProfile(targetId).then(data => {
    res.send(data)
  }).catch(error => {
    res.send(error)
  })
})

// 邮箱验证码
router.post('/captcha', (req, res) => {
  let { email } = req.body
  sendEmailCaptcha(email).then(data => {
    res.send(data)
  }).catch(error => {
    res.send(error)
  })
})

// 用户注册
router.post('/register', (req, res) => {
  let { email, captcha, password } = req.body
  userRegister(email, captcha, password).then(data => {
    res.send(data)
  }).catch(error => {
    res.send(error)
  })
})

// 用户登录
router.post('/login', (req, res) => {
  let { account, password } = req.body
  userLogin(account, password).then(data => {
    res.send(data)
  }).catch(error => {
    res.send(error)
  })
})

module.exports = router
