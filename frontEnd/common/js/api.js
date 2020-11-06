import {
	mapState,
	mapMutations
} from 'vuex'

module.exports = {
	// 将 `this.方法名()` 映射为 `this.$store.commit('方法名')`
	...mapMutations(['initSessions', 'initFriendGroupings', 'initGroupGroupings', 'initApplies']),
	// 获取聊天会话
	getSessions: () => {
		console.log(this)
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
				this.initSessions(result.data)
				resolve(true)
			}).catch(error => {
				reject(error)
			})
		})
	},
	// 获取联系人(好友，群聊)
	getContacts() {
		let getFriendGroupings = uni.$request({
			url: '/grouping/list'
		})
		return new Promise((resolve, reject) => {
			Promise.all([getFriendGroupings]).then(results => {
				if (results[0].code !== 200) {
					return reject(results[0].msg)
				}
				/* if (results[1].code !== 200) {
					return reject(results[1].msg)
				} */
				this.initFriendGroupings(results[0].data)
				// this.initGroupGroupings(results[1].data)
				resolve(true)
			}).catch(error => {
				reject(error)
			})
		})
	},
	// 获取好友申请
	getApplies() {
		return new Promise((resolve, reject) => {
			uni.$request({
				url: '/apply/list'
			}).then(result => {
				if (result.code !== 200) {
					return reject(result.msg)
				}
				this.init
				resolve(true)
			}).catch(error => {
				reject(error)
			})
		})
	}
}
