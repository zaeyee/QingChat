const { getUserProfile } = require('../function/userFunction')

module.exports = (socket) => {
  // 获取用户信息
  socket.on('getUserProfile', (requestData, callback) => {
    let { targetId } = requestData
    getUserProfile(targetId).then(data => {
      typeof callback === 'function' && callback(data)
    }).catch(error => {
      typeof callback === 'function' && callback(error)
    })
  })
}