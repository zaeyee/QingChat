const { getMessages, sendMessage } = require('../function/messageFunction')

module.exports = (socket) => {
  // 获取消息列表
  socket.on('getMessages', (requestData, callback) => {
    let { userId } = socket.decoded_token
    let { lastTime } = requestData
    getMessages(userId, lastTime).then(data => {
      typeof callback === 'function' && callback(data)
    }).catch(error => {
      typeof callback === 'function' && callback(error)
    })
  })

  // 发送消息
  socket.on('sendMessage', (requestData, callback) => {
    let { userId } = socket.decoded_token
    let { receiverId, type, content, addition } = requestData
    sendMessage(userId, receiverId, type, content, addition).then(data => {
      typeof callback === 'function' && callback(data)
    }).catch(error => {
      typeof callback === 'function' && callback(error)
    })
  })
}