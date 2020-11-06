import io from './weapp.socket.io.js'
import store from '@/store'

// socket服务url
// #ifdef H5
const url = 'ws://localhost:3030'
// #endif
// #ifdef APP-PLUS
const url = 'ws://192.168.89.10:3030'
// #endif
// const url = 'ws://192.168.89.10:3030'
// const url = 'ws://192.168.43.252:3030'
// const url = 'ws://192.168.43.106:3030'
// const url = 'ws://172.16.109.167:3030'

// 跳转登录
function gotoLogin(msg) {
	store.commit('userLogout')
	uni.showModal({
		content: msg,
		showCancel: false,
		success(res) {
			res.confirm && uni.reLaunch({
				url: '/pages/login/login'
			})
		}
	})
}

// 初始化socket
function initSocket(options = {}) {
	const {
		connect,
		disconnect,
		error
	} = options
	const token = uni.getStorageSync('user').token
	if (!token) {
		gotoLogin('您还未登录')
		return
	}
	const socket = io(url, {
		query: {
			token
		}
	})

	socket.on('connect', () => {
		console.log('connect')
		uni.showToast({
			title: 'socket连接成功'
		})
		typeof connect === 'function' && connect(socket)
	})

	socket.on('disconnect', () => {
		console.log('disconnect')
		uni.showToast({
			title: 'socket断开连接'
		})
		typeof disconnect === 'function' && disconnect(socket)
	})

	socket.on('error', (result) => {
		result = JSON.parse(JSON.stringify(result))
		if (result.code === 401) {
			gotoLogin('登录已过期')
			return
		}
		console.log(result)
		uni.showToast({
			title: 'socket连接错误：' + result
		})
		typeof error === 'function' && error(socket)
	})

	return socket
}

export default initSocket
