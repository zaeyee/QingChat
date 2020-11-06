const jwt = require('jsonwebtoken')
const { secret } = require('../config')

module.exports = {
  generate(data, expiresIn = 60 * 60 * 24 * 3) {
    return jwt.sign(data, secret, { expiresIn })
  },
  verify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
}
