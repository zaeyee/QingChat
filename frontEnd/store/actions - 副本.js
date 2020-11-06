export default {
	// 获取聊天会话
	getSessions({
		commit
	}) {
		return new Promise((resolve, reject) => {
			uni.$request({
				url: '/message/list',
				data: {
					// lastTime: this.lastTime
				}
			}).then(result => {
				if (result.code !== 200) {
					return reject(result.msg)
				}
				commit('initSessions', result.data)
				resolve(true)
			}).catch(error => {
				reject(error)
			})
		})
	},
	// 获取联系人(好友，群聊)
	getContacts({
		commit
	}) {
		let getGroupings = uni.$request({
			url: '/grouping/list'
		})
		let getFriends = uni.$request({
			url: '/friend/list'
		})
		return new Promise((resolve, reject) => {
			Promise.all([getGroupings, getFriends]).then(results => {
				if (results[0].code !== 200) {
					return reject(results[0].msg)
				}
				if (results[1].code !== 200) {
					return reject(results[1].msg)
				}
				commit('initFriendGroupings', {
					groupings: results[0].data,
					friends: results[1].data
				})
				// this.initGroupGroupings(results[1].data)
				resolve(true)
			}).catch(error => {
				reject(error)
			})
		})
	},
	// 获取好友申请
	getApplies({
		state,
		commit,
		dispatch
	}) {
		return new Promise((resolve, reject) => {
			uni.$request({
				url: '/apply/list'
			}).then(result => {
				if (result.code !== 200) {
					return reject(result.msg)
				}
				const applies = result.data
				commit('initApplies', applies)
				resolve(true)
				for (let item of applies) {
					const {
						applicantId
					} = item
					if (!state.userProfiles[applicantId]) {
						dispatch('getUserProfile', applicantId)
					}
				}
			}).catch(error => {
				reject(error)
			})
		})
	},
	// 获取用户信息
	getUserProfile({
		commit
	}, targetId) {
		return new Promise((resolve, reject) => {
			uni.$request({
				url: '/user/profile',
				data: {
					targetId
				}
			}).then(result => {
				if (result.code !== 200) {
					return reject(result.msg)
				}
				commit('addUserProfile', result.data)
				resolve(true)
			}).catch(error => {
				reject(error)
			})
		})
	}
}
