class Redis {
  constructor() {
    const redis = require('redis')
    const redisConfig = require('../config').redis
    this._conn = redis.createClient(redisConfig.port, redisConfig.host)
    this._conn.on('ready', (res) => console.log('redis connect ready'))
    this._conn.on('end', (err) => console.log('redis connect end'))
    this._conn.on('error', (err) => console.log(err))
    this._conn.on('connect', () => console.log('redis connect success!'))
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new Redis()
    }
    return this._instance
  }

  getConn() {
    return this._conn
  }

  set(key, value, exprie = 60 * 5) {
    return new Promise((resolve, reject) => {
      this._conn.set(key, value, 'EX', exprie, (err, res) => {
        if (err) {
          reject(false)
        } else {
          resolve(value)
        }
      })
    })
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this._conn.get(key, (err, res) => {
        if (err) {
          resolve(false)
        } else {
          resolve(res)
        }
      })
    })
  }

  remove(key) {
    return new Promise((resolve, reject) => {
      this._conn.del(key, function (err, replies) {
        if (err) {
          resolve(false)
        } else {
          resolve(replies >= 0)
        }
      })
    })
  }
}

module.exports = Redis.getInstance()