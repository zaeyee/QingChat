// 数字未满10，前面添加0
function addZero(num) {
	return num < 10 ? '0' + num : num
}

// 格式化会话时间
export function sessionTime(d) {
	let old = new Date(d)
	let now = new Date()
	let Y = old.getFullYear()
	let M = addZero(old.getMonth() + 1)
	let D = addZero(old.getDate())
	let H = addZero(old.getHours())
	let m = addZero(old.getMinutes())
	let nY = now.getFullYear()
	let nM = addZero(now.getMonth() + 1)
	let nD = addZero(now.getDate())
	let nH = addZero(now.getHours())
	let nm = addZero(now.getMinutes())
	if (Y === nY && M === nM) {
		if (D === nD) {
			return H + ':' + m
		} else if (D + 1 === nD) {
			return '昨天' + H + ':' + m
		}
	}
	return Y + '-' + M + '-' + D
}

// 格式化消息时间
export function messageTime(d) {
	let old = new Date(d)
	let now = new Date()
	let Y = old.getFullYear()
	let M = old.getMonth() + 1
	let D = old.getDate()
	let H = addZero(old.getHours())
	let m = addZero(old.getMinutes())
	let nY = now.getFullYear()
	let nM = now.getMonth() + 1
	let nD = now.getDate()
	let nH = addZero(now.getHours())
	let nm = addZero(now.getMinutes())
	if (Y === nY) {
		if (M === nM) {
			if (D === nD) {
				return H + ':' + m
			} else if (D + 1 === nD) {
				return '昨天 ' + H + ':' + m
			}
		}
		return M + '月' + D + '日 ' + H + ':' + m
	}
	return Y + '年' + M + '月' + D + '日 ' + H + ':' + m
}

// 获取节点布局位置
export function getNodeInfo(seletor, all) {
	return new Promise((resolve, reject) => {
		try {
			const query = uni.createSelectorQuery()
			query.selectAll(seletor).boundingClientRect(results => {
				resolve(all ? results : results[0])
			}).exec()
		} catch (error) {
			reject(error)
		}
	})
}

// 防抖函数
export function debounce(func, delay) {
	let timer = null
	return function(...args) {
		timer && clearTimeout(timer)
		timer = setTimeout(() => {
			func.apply(this, ...args)
		}, delay)
	}
}
