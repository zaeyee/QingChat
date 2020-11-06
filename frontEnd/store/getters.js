export default {
	// 未处理的好友申请数量
	applyNum: state => {
		let applies = state.applies,
			num = 0
		for (let item of applies) {
			if (!item.isRead && item.applicantId !== state.loginId) {
				num++
			}
		}
		return num
	},
	// 好友设置
	friendConfig: state => id => {
		return state.friendConfigs[id] || {
			_id: '',
			userId: 10001,
			friendId: id,
			noteName: '',
			disturb: true,
			topping: false,
			groupingId: state.defaultGroupingId
		}
	},
	// 用户信息,
	userProfile: state => id => {
		return state.userProfiles[id] || {
			_id: '',
			id,
			avatar: '/static/images/personal/avatar.png',
			email: '',
			nickname: id,
			gender: 0,
			intro: ''
		}
	}
}
