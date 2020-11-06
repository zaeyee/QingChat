module.exports = {
  // 状态码
  statusCode: {
    Success: 200,         // 成功
    Unauthorized: 401,    // 未授权(token失效)
    Param: 402,           // 参数问题
    Exists: 403,          // 已存在
    NotExist: 404,        // 不存在
    Fail: 406,            // 失败
    System: 500           // 系统错误
  },
  // mongodb数据库信息
  db: {
    host: 'localhost',
    port: 27017,
    name: 'QingChat',
    user: '',
    pass: ''
  },
  // redis连接信息
  redis: {
    host: 'localhost',
    port: 6379,
    pass: ''
  },
  // 邮箱信息
  email: {
    host: 'smtp.ym.163.com',
    port: 994,
    secure: true,
    user: 'test@ouzero.com',
    pass: 'ouzero.com'
  },
  secret: 'test'
}
