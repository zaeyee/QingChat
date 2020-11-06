import store from '@/store'

// API基础url
// #ifdef H5
const baseUrl = 'http://localhost:3000'
// #endif
// #ifdef APP-PLUS
const baseUrl = 'http://192.168.89.10:3000'
// #endif
// const baseUrl = 'http://192.168.43.252:3000'
// const baseUrl = 'http://192.168.43.106:3000'
// const baseUrl = 'http://172.16.109.167:3000'
// 不验证token的url
const unlessUrls = ['/user/captcha', '/user/register', '/user/login']

// 判断是否不验证的url
function isUnlessUrl(url) {
	for (let item of unlessUrls) {
		if (url.indexOf(item) > -1) {
			return true
		}
	}
	return false
}

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

// 网络请求
function request(options) {
	const {
		success,
		fail,
		complete
	} = options
	let url = options.url || '/',
		method = (options.method && options.method.toUpperCase()) || 'POST',
		data = options.data || {},
		errorTip = options.errorTip || false,
		token = uni.getStorageSync('user').token,
		header = method === 'GET' ? {
			'X-Requested-With': 'XMLHttpRequest',
			'Accept': 'application/json',
			'Content-Type': 'application/json; charset=UTF-8'
		} : {
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}
	header['X-Access-Token'] = token
	if (url.charAt(0) !== '/') {
		url = baseUrl + '/' + url
	}
	return new Promise((resolve, reject) => {
		// 无token且需要验证token
		if (!token && !isUnlessUrl(url)) {
			gotoLogin('您还未登录')
			return
		}
		uni.request({
			url: baseUrl + url,
			method,
			data,
			header,
			success(res) {
				//API服务错误
				if (res.statusCode && res.statusCode !== 200) {
					uni.showModal({
						content: 'API服务错误：' + res.errMsg,
						showCancel: false
					})
					return
				}
				const data = res.data
				// token无效，跳转登录
				if (data.code === 401) {
					gotoLogin('登录已过期')
					return
				}
				// 当出现其他错误且需要处理时直接返回
				if (errorTip && data.code !== 200) {
					uni.showModal({
						content: '错误：' + data.msg,
						showCancel: false
					})
					return
				}
				resolve(data)
				typeof success === 'function' && success(data)
			},
			fail(err) {
				// 网络请求错误
				uni.showModal({
					content: '网络请求失败：' + err.errMsg,
					showCancel: false
				})
				reject(err)
				typeof fail === 'function' && fail(err)
			},
			complete() {
				uni.hideLoading()
				typeof complete === 'function' && complete()
			}
		})
	})
}

export default request
