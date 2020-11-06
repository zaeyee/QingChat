const { getGroupings, addGrouping, editGroupingName, deleteGrouping } = require('../function/groupingFunction')
const { getFriends } = require('../function/friendFunction')
const { getFriendConfig } = require('../function/friendConfigFunction')

module.exports = (socket) => {
  // 获取分组及好友列表
  socket.on('getFriendGroupings', (requestData, callback) => {
    const { userId } = socket.decoded_token
    Promise.all([getGroupings(userId), getFriends(userId)]).then(async result => {
      const { data: groupings, ...dataObj } = result[0]
      const friends = result[1].data
      const friendConfigs = {}
      for (let item of friends) {
        const { applicantId, recipientId } = item
        const friendId = applicantId === userId ? recipientId : applicantId
        const friendConfigResult = await getFriendConfig(userId, friendId)
        if (friendConfigResult.code === 200) {
          friendConfigs[friendId] = friendConfigResult.data
        }
      }
      typeof callback === 'function' && callback({ ...dataObj, data: { groupings, friends, friendConfigs } })
    }).catch(error => {
      typeof callback === 'function' && callback(error)
    })
  })

  // 添加分组
  socket.on('addGrouping', (requestData, callback) => {
    let { userId } = socket.decoded_token
    let { name } = requestData
    addGrouping(userId, name).then(result => {
      typeof callback === 'function' && callback(result)
    }).catch(error => {
      typeof callback === 'function' && callback(error)
    })
  })

  // 修改分组名称
  socket.on('editGroupingName', (requestData, callback) => {
    let { _id, name } = requestData
    editGroupingName(_id, name).then(result => {
      typeof callback === 'function' && callback(result)
    }).catch(error => {
      typeof callback === 'function' && callback(error)
    })
  })

  // 删除分组
  socket.on('deleteGrouping', (requestData, callback) => {
    let { id } = socket.decoded_token
    let { _id } = requestData
    deleteGrouping(_id, id).then(result => {
      typeof callback === 'function' && callback(result)
    }).catch(error => {
      typeof callback === 'function' && callback(error)
    })
  })
}