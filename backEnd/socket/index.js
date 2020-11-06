const socketIO = require('socket.io')
const jwt = require('../util/jwt')
const { statusCode } = require('../config')
const userSocket = require('./userSocket')
const applySocket = require('./applySocket')
const groupingSocket = require('./groupingSocket')
const messageSocket = require('./messageSocket')
const searchSocket = require('./searchSocket')

module.exports = (server) => {
  const io = socketIO.listen(server)

  io.use((socket, next) => {
    const token = socket.handshake.query.token
    // 验证token
    jwt.verify(token).then(data => {
      socket.decoded_token = data
      return next()
    }).catch(err => {
      return next(new Error(JSON.stringify({ code: statusCode.Unauthorized, msg: 'authentication error' })))
    })
  })

  // 在io上挂载一个用户映射表 key为用户ID，value为socketId
  io.$usersMap = {}
  // 在io上挂载一个用于向指定用户ID发射的函数
  io.$emitUser = (targetId, event, data = null, callback = null) => {
    const socketId = io.$usersMap[targetId]
    if (io.sockets.connected[socketId]) {
      io.sockets.connected[socketId].emit(event, data, callback)
    }
    return false
  }

  io.on('connection', (socket) => {
    console.log('用户：socketId ' + socket.id + ' connect')

    // 新用户链接时放入映射表中
    io.$usersMap[socket.decoded_token.userId] = socket.id

    socket.on('disconnect', () => {
      console.log('用户：socketId ' + socket.id + ' disconnected')

      // 将断开链接的用户在用户映射表中置空
      io.$usersMap[socket.decoded_token.userId] = undefined
    })

    userSocket(socket, io)
    applySocket(socket, io)
    groupingSocket(socket, io)
    messageSocket(socket, io)
    searchSocket(socket, io)
  })

  return io
}