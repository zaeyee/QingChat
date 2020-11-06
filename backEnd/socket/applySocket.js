const { getApplies, sendApply, readApply, acceptApply, refuseApply, deleteApply } = require('../function/applyFunction')

module.exports = (socket, io) => {
  // 获取好友申请
  socket.on('getApplies', (requestData, callback) => {
    const { userId } = socket.decoded_token
    getApplies(userId).then(result => {
      typeof callback === 'function' && callback(result)
    }).catch(error => {
      typeof callback === 'function' && callback(error)
    })
  })

  // 发送好友申请
  socket.on('sendApply', (requestData, callback) => {
    const { userId } = socket.decoded_token
    const { targetId, groupingId, message = '', noteName = '' } = requestData
    sendApply(userId, targetId, groupingId, message, noteName).then(result => {
      io.$emitUser(targetId, 'newApply', result.data)
      typeof callback === 'function' && callback(result)
    }).catch(error => {
      typeof callback === 'function' && callback(error)
    })
  })

  // 已读好友申请
  socket.on('readApply', (requestData, callback) => {
    const { userId } = socket.decoded_token
    const { latestTime } = requestData
    readApply(userId, latestTime).then(result => {
      typeof callback === 'function' && callback(result)
    }).catch(error => {
      typeof callback === 'function' && callback(error)
    })
  })

  // 同意好友申请
  socket.on('acceptApply', (requestData, callback) => {
    const { userId } = socket.decoded_token
    const { _id, groupingId } = requestData
    acceptApply(_id, userId, groupingId).then(result => {
      const { applicantFriend, ...data } = result
      io.$emitUser(data.data.friendId, 'applyAccept', applicantFriend)
      typeof callback === 'function' && callback(data)
    }).catch(error => {
      typeof callback === 'function' && callback(error)
    })
  })

  // 拒绝好友申请
  socket.on('refuseApply', (requestData, callback) => {
    const { userId } = socket.decoded_token
    const { _id } = requestData
    refuseApply(_id, userId).then(result => {
      io.$emitUser(result.data.applicantId, 'applyRefuse', result.data._id)
      typeof callback === 'function' && callback(result)
    }).catch(error => {
      typeof callback === 'function' && callback(error)
    })
  })

  /* // 删除好友申请
  socket.on('deleteApply', (requestData, callback) => {
    const { _id } = requestData
    deleteApply(_id).then(result => {
      typeof callback === 'function' && callback(result)
    }).catch(error => {
      typeof callback === 'function' && callback(error)
    })
  }) */
}