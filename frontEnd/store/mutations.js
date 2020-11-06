export default {
	// 用户登录
	userLogin(state, data, callback) {
		const {
			token,
			...profile
		} = data
		state.token = token
		state.loginId = profile.id
		uni.setStorageSync('user', data)
		this.commit('addUserProfile', profile)
		typeof callback === 'function' && callback()
	},
	// 用户退出登录
	userLogout(state) {
		state.token = ''
		state.loginId = ''
		state.socket && state.socket.disconnect()
		uni.removeStorageSync('user')
	},
	// 初始化聊天会话
	initSessions(state, messages) {
		const sessions = []
		for (let message of messages) {
			const {
				senderId,
				receiverId
			} = message
			const friendId = state.loginId === senderId ? receiverId : senderId
			if (!sessions[friendId]) {
				sessions[friendId] = [message]
			} else {
				sessions[friendId].push(message)
			}
		}
		state.sessions = sessions
	},
	// 初始化好友设置
	initFriendConfig(state, friendConfigs) {
		state.friendConfigs = friendConfigs
	},
	// 初始化分组及好友
	initGroupingFriends(state, data) {
		const {
			groupings,
			friends
		} = data
		const friendConfigs = state.friendConfigs,
			groupingNum = groupings.length,
			friendNum = friends.length
		for (let i = 0; i < groupingNum; i++) {
			// 保存默认分组id到state
			if (groupings[i].isDefault) {
				state.defaultGroupingId = groupings[i]._id
			}
			// 先给每各分组加个friends数组，以便存放好友ID
			groupings[i].friends = []
		}
		out: for (let i = 0; i < friendNum; i++) {
			const {
				applicantId,
				recipientId,
				generateTime
			} = friends[i]
			const friendId = applicantId === state.loginId ? recipientId : applicantId,
				groupingId = friendConfigs[friendId].groupingId
			friendConfigs[friendId] = {
				...friendConfigs[friendId],
				applicantId,
				recipientId,
				generateTime
			}
			if (!groupingId) {
				groupingId = state.defaultGroupingId
			}
			for (let j = 0; j < groupingNum; j++) {
				if (groupingId === groupings[j]._id) {
					groupings[j].friends.push(friendId)
					break out
				}
			}
		}
		state.friendConfigs = friendConfigs
		state.friendGroupings = groupings
	},
	// 初始化群聊分组
	initGroupGroupings(state, groups) {
		state.groupGroupings[0].groups = []
		state.groupGroupings[1].groups = []
		state.groupGroupings[2].groups = []
		state.groupGroupings[3].groups = []
		groups.forEach(item => {
			if (item.topping) {
				state.groupGroupings[0].groups.push(item)
			}
			if (item.founderId === state.loginId) {
				state.groupGroupings[1].groups.push(item)
			} else if (item.isManager) {
				state.groupGroupings[2].groups.push(item)
			} else {
				state.groupGroupings[3].groups.push(item)
			}
		})
	},
	// 初始化好友申请
	initApplies(state, applies) {
		for (let item of applies) {
			const {
				applicantId
			} = item
			if (!state.userProfiles[applicantId]) {
				this.dispatch('getUserProfile', applicantId)
			}
		}
		state.applies = applies
	},
	// 添加用户信息
	addUserProfile(state, userProfile) {
		if (!userProfile.avatar) {
			userProfile.avatar = '/static/images/personal/avatar.png'
		}
		state.userProfiles = { ...state.userProfiles,
			[userProfile.id]: userProfile
		}
	},
	// 添加新消息
	addNewMessage(state, message) {
		const {
			senderId,
			receiverId,
			type,
			content,
			sendTime
		} = message
		const messages = state.messages,
			friendId = senderId === state.loginId ? receiverId : senderId
		if (!messages[friendId]) {
			messages[friendId] = [message]
		} else {
			messages[friendId].push(message)
		}
		state.messages = messages
		let latestMessage
		switch (type) {
			case 1:
				latestMessage = '[图片]'
				break
			case 2:
				latestMessage = '[视频]'
				break
			case 3:
				latestMessage = '[语音]'
				break
			case 4:
				latestMessage = '[位置]'
			default:
				latestMessage = content
		}
		this.commit('updateSession', {
			friendId,
			latestMessage,
			latestTime: sendTime,
			unreadNumber: 1
		})
	},
	// 更新会话消息
	updateSession(state, session) {
		const sessions = state.sessions,
			sessionNum = sessions.length
		const {
			friendId,
			latestMessage,
			latestTime,
			unreadNumber
		} = session
		let exists = false
		for (let i = 0; i < sessionNum; i++) {
			if (sessions[i].friendId === message.friendId) {
				sessions[i].latestMessage = latestMessage
				sessions[i].latestTime = latestTime
				sessions[i].unreadNumber = unreadNumber
				exists = true
				break
			}
		}
		if (!exists) {
			sessions.unshift(session)
		}
		state.sessions = sessions
	},
	// 添加新好友申请
	addNewApply(state, apply) {
		const applies = state.applies,
			applyNum = applies.length
		let exists = false
		for (let i = 0; i < applyNum; i++) {
			if (applies[i]._id === apply._id) {
				applies[i].apply
				exists = true
				break
			}
		}
		if (!exists) {
			applies.unshift(apply)
		}
		state.applies = applies
	},
	// 添加新好友
	addNewFriend(state, friendConfig) {
		const friendGroupings = state.friendGroupings,
			friendGroupingNum = friendGroupings.length,
			friendId = friendConfig.friendId
		for (let i = 0; i < friendGroupingNum; i++) {
			if (friendGroupings[i]._id === friendConfig.groupingId) {
				friendGroupings[i].friends.push(friendId)
				break
			}
		}
		state.friendConfigs[friendId] = friendConfig
		state.friendGroupings = friendGroupings
	},
	// 已读好友申请
	readApply(state, latestTime) {
		const applies = state.applies,
			applyNum = applies.length
		for (let i = 0; i < applyNum; i++) {
			if (applies[i].applyTime >= latestTime) {
				applies[i].isRead = true
			}
		}
		state.applies = applies
	},
	// 通过好友申请(修改状态为1，并添新好友)
	acceptApply(state, friendConfig) {
		this.commit('editApplyAccept', {
			applicantId: friendConfig.applicantId,
			targetId: friendConfig.recipientId,
			isAccept: 1
		})
		this.commit('addNewFriend', friendConfig)
	},
	// 修改好友申请同意状态
	editApplyAccept(state, data) {
		const applies = state.applies,
			applyNum = applies.length
		for (let i = 0; i < applyNum; i++) {
			if (applies[i].applicantId === data.applicantId && applies[i].targetId === data.targetId) {
				applies[i].isAccept = data.isAccept
			}
		}
		state.applies = applies
	}
}
