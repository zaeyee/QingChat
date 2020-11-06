const DAO = require('../db/DAO')
const userModel = require('../db/model/userModel')
const userDAO = new DAO(userModel)
const { statusCode } = require('../config')
const redis = require('../util/redis')
const bcrypt = require('../util/bcrypt')
const jwt = require('../util/jwt')
const emailer = require('../util/emailer')
const idReg = /^[1-9]\d{4,9}$/
const emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/i

module.exports = {
  // 获取用户信息
  getUserProfile(id) {
    return new Promise((resolve, reject) => {
      id = parseInt(id)
      if (!id) {
        return reject({ code: statusCode.Param, msg: '缺少参数' })
      }
      userDAO.findOne({ id, usable: true }, 'id email nickname avatar gender intro')
        .then(data => {
          if (data) {
            resolve({ code: statusCode.Success, msg: 'success', data })
          } else {
            reject({ code: statusCode.NotExist, msg: '目标ID用户不存在' })
          }
        }).catch(err => {
          reject({ code: statusCode.Fail, msg: 'fail: ' + err })
        })
    })
  },
  // 发送邮箱验证码
  sendEmailCaptcha(email) {
    return new Promise((resolve, reject) => {
      if (!emailReg.test(email)) {
        return reject({ code: statusCode.Param, msg: '邮箱格式错误' })
      }
      let captcha = parseInt(Math.random() * 1000000)
      if (captcha < 99999) {
        captcha += 100000
      }
      emailer.send(email, captcha).then(() => {
        redis.set(email, captcha).then(data => {
          if (data) {
            resolve({ code: statusCode.Success, msg: 'success' })
          } else {
            reject({ code: statusCode.System, msg: '系统错误' })
          }
        })
      }).catch(err => {
        reject({ code: statusCode.Fail, msg: 'fail: ' + err })
      })
    })
  },
  // 用户注册
  userRegister(email, captcha, password) {
    return new Promise((resolve, reject) => {
      if (!emailReg.test(email)) {
        return reject({ code: statusCode.Param, msg: '邮箱格式错误' })
      }
      if (!password || password.length < 8) {
        return reject({ code: statusCode.Param, msg: '密码长度不可少于8位' })
      }
      redis.get(email).then(data => {
        if (data && data === captcha) {
          userDAO.findOne({ email }).then(data => {
            if (data) {
              reject({ code: statusCode.Exist, msg: '邮箱已存在' })
            } else {
              password = bcrypt.generate(password)
              userDAO.insert({ email, password }).then(data => {
                const { id, email, nickname, avatar, gender, intro } = data
                // 生成登录的token
                const token = jwt.generate({ userId: id })
                const groupingModel = require('../db/model/groupingModel')
                const groupingDAO = new DAO(groupingModel)
                // 新建默认分组
                groupingDAO.insert({ userId: id, name: '默认分组', isDefault: true })
                resolve({ code: statusCode.Success, msg: 'success', data: { token, id, email, nickname, avatar, gender, intro } })
              }).catch(err => {
                reject({ code: statusCode.Fail, msg: 'fail: ' + err })
              })
              redis.remove(email) // 删除redis中已使用的验证码
            }
          }).catch(err => {
            reject({ code: statusCode.System, msg: 'fail: ' + err })
          })
        } else {
          reject({ code: statusCode.Param, msg: '邮箱验证码错误' })
        }
      })
    })
  },
  // 用户登录
  userLogin(account, password) {
    return new Promise((resolve, reject) => {
      let conditions
      if (idReg.test(account)) {
        conditions = { id: account }
      } else if (emailReg.test(account)) {
        conditions = { email: account }
      } else {
        return reject({ code: statusCode.Param, msg: '账号格式错误' })
      }
      if (!password || password.length < 8) {
        return reject({ code: statusCode.Param, msg: '密码长度不可少于8位' })
      }
      userDAO.findOne(conditions).then(data => {
        if (data) {
          if (bcrypt.compare(password, data.password)) {
            if (data.usable) {
              // 生成登录的token
              const token = jwt.generate({ userId: data.id })
              const { id, email, nickname, avatar, gender, intro } = data
              resolve({ code: statusCode.Success, msg: 'success', data: { token, id, email, nickname, avatar, gender, intro } })
            } else {
              reject({ code: statusCode.Fail, msg: '账号不可使用' })
            }
          } else {
            reject({ code: statusCode.Fail, msg: '账号或密码错误' })
          }
        } else {
          reject({ code: statusCode.NotExist, msg: '该用户不存在' })
        }
      }).catch(err => {
        reject({ code: statusCode.System, msg: 'fail: ' + err })
      })
    })
  }
}