const { getFriendConfig } = require('../function/friendConfigFunction')

module.exports = (socket) => {
  // 获取单个好友设置
  socket.on('getFriendConfig', (requestData, callback) => {
    const { userId, friendId } = socket.decoded_token
    getFriendConfig(userId, friendId).then(result => {
      typeof callback === 'function' && callback(result)
    }).catch(error => {
      typeof callback === 'function' && callback(error)
    })
  })
}