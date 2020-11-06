const jwt = require('../util/jwt')
const { statusCode } = require('../config')

module.exports = (app) => {
  // 自定义 验证token策略 中间件
  app.use((req, res, next) => {
    // 不验证token的url
    const unlessUrls = ['/user/captcha', '/user/register', '/user/login']
    for (let item of unlessUrls) {
      if (req.originalUrl.indexOf(item) > -1) {
        return next()
      }
    }
    // 获取token值
    const token = req.headers["x-access-token"] || req.body.token || req.query.token
    // 验证token
    jwt.verify(token).then(data => {
      // 解析必要的数据（相应字段为定义token时的字段）
      req.body.userId = data.userId
      return next()
    }).catch(err => {
      return res.send({ code: statusCode.Unauthorized, msg: 'token无效' })
    })
  })

  // 路由
  const userRouter = require('./userRouter')             // 用户
  const applyRouter = require('./applyRouter')           // 申请
  const groupingRouter = require('./groupingRouter')     // 分组
  const messageRouter = require('./messageRouter')       // 消息
  const searchRouter = require('./searchRouter')         // 搜索

  app.use('/user', userRouter)
  app.use('/apply', applyRouter)
  app.use('/grouping', groupingRouter)
  app.use('/message', messageRouter)
  app.use('/search', searchRouter)
}
