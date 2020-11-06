export default {
	// 获取聊天会话
	getSessions({
		commit
	}) {
		return new Promise((resolve, reject) => {
			// 发射获取好友申请
			uni.$userSocket.emit('getMessages', {}, (result) => {
				if (result.code !== 200) {
					return reject(result.msg)
				}
				// 初始化好友申请
				commit('initSessions', result.data)
				resolve(true)
			})
		})
	},
	// 获取分组及好友列表
	getFriendGroupings({
		commit
	}) {
		return new Promise((resolve, reject) => {
			// 发射获取分组及好友
			uni.$userSocket.emit('getFriendGroupings', {}, (result) => {
				if (result.code !== 200) {
					return reject(result.msg)
				}
				// 初始化好友设置
				commit('initFriendConfig', result.data.friendConfigs)
				// 初始化分组及好友
				commit('initGroupingFriends', {
					groupings: result.data.groupings,
					friends: result.data.friends
				})
				resolve(true)
			})
		})
	},
	// 获取好友申请列表
	getApplies({
		commit
	}) {
		return new Promise((resolve, reject) => {
			// 发射获取好友申请
			uni.$userSocket.emit('getApplies', {}, (result) => {
				if (result.code !== 200) {
					return reject(result.msg)
				}
				// 初始化好友申请
				commit('initApplies', result.data)
				resolve(true)
			})
		})
	},
	// 获取用户信息
	getUserProfile({
		commit
	}, targetId) {
		return new Promise((resolve, reject) => {
			// 发射获取用户信息
			uni.$userSocket.emit('getUserProfile', {
				targetId
			}, (result) => {
				if (result.code !== 200) {
					return reject(result.msg)
				}
				// 添加用户信息
				commit('addUserProfile', result.data)
				resolve(true)
			})
		})
	}
}
