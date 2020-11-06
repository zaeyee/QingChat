const { getUserProfile } = require('../function/userFunction')

module.exports = (socket) => {
  // 搜索全局
  socket.on('searchGlobal', (requestData, callback) => {
    let { keyword } = requestData
    Promise.all([getUserProfile(keyword)]).then(data => {
      typeof callback === 'function' && callback(data[0])
    }).catch(error => {
      typeof callback === 'function' && callback(error)
    })
  })
}