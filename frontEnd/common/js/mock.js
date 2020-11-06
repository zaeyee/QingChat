// 导入模拟数据
import data from './data.js'

// 聊天会话
export function apiSessions() {
	return new Promise((resolve, reject) => {
		try {
			//延时一秒，模拟网络传输耗时
			setTimeout(() => {
				let result = {
					err: 0,
					data: data.sessions()
				}
				//模拟接口请求成功
				resolve(result)
			}, 1000)
		} catch (e) {
			//模拟接口请求失败
			reject({
				err: e,
				msg: '请求失败'
			});
		}
	})
}

// 好友分组
export function apiGroupings() {
	return new Promise((resolve, reject) => {
		try {
			//延时一秒，模拟网络传输耗时
			setTimeout(() => {
				let result = {
					err: 0,
					data: data.groupings()
				}
				//模拟接口请求成功
				resolve(result)
			}, 1000)
		} catch (e) {
			//模拟接口请求失败
			reject({
				err: e,
				msg: '请求失败'
			});
		}
	})
}

// 群组
export function apiGroups() {
	return new Promise((resolve, reject) => {
		try {
			//延时一秒，模拟网络传输耗时
			setTimeout(() => {
				let result = {
					err: 0,
					data: data.groups()
				}
				//模拟接口请求成功
				resolve(result)
			}, 1000)
		} catch (e) {
			//模拟接口请求失败
			reject({
				err: e,
				msg: '请求失败'
			});
		}
	})
}

// 聊天消息
export function apiMessages(pageNum, loadNum) {
	return new Promise((resolve, reject) => {
		try {
			//延时一秒，模拟网络传输耗时
			setTimeout(() => {
				let messages = data.messages()
				let result = {
					err: 0,
					data: []
				}
				for (let i = (pageNum - 1) * loadNum; i < pageNum * loadNum && i < messages.length; i++) {
					result.data.push(messages[i])
				}
				//模拟接口请求成功
				resolve(result)
			}, 1000)
		} catch (e) {
			//模拟接口请求失败
			reject({
				err: e,
				msg: '请求失败'
			});
		}
	})
}

// 新朋友
export function apiNewFriends() {
	return new Promise((resolve, reject) => {
		try {
			//延时一秒，模拟网络传输耗时
			setTimeout(() => {
				let result = {
					err: 0,
					data: data.newFriends()
				}
				//模拟接口请求成功
				resolve(result)
			}, 1000)
		} catch (e) {
			//模拟接口请求失败
			reject({
				err: e,
				msg: '请求失败'
			});
		}
	})
}

// 搜索
export function apiSearch() {
	return new Promise((resolve, reject) => {
		try {
			//延时一秒，模拟网络传输耗时
			setTimeout(() => {
				let result = {
					err: 0,
					data: data.search()
				}
				//模拟接口请求成功
				resolve(result)
			}, 1000)
		} catch (e) {
			//模拟接口请求失败
			reject({
				err: e,
				msg: '请求失败'
			});
		}
	})
}