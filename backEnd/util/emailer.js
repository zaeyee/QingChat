const nodemailer = require('nodemailer')
const { email } = require('../config')
const { host, port, secure, user, pass } = email
const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } })

module.exports = {
  send(mail, code) {
    const mailObj = {
      from: '<test@ouzero.com>',
      to: mail,
      subject: 'QingChat',
      // text和html二选一
      // text: '',
      html: `您的验证码是：<strong>${code}</strong>，有效期五分钟`
    }
    return transporter.sendMail(mailObj)
  }
}
