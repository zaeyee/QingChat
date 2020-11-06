<script>
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} from 'vuex'

	export default {
		computed: {
			// 将 `this.状态名` 映射为 `store.state.状态名`
			...mapState(['token', 'loginId']),
			// 把 `this.getter名` 映射为 `this.$store.getters.getter名`
			...mapGetters(['applyNum'])
		},
		watch: {
			// 监听未读好友申请数，设置tabbar角标
			applyNum(newVal, oldVal) {
				this.setTabBarBadge(newVal)
			}
		},
		onLaunch: function() {
			console.log('App Launch')
			// 如果未通过登录，则断开socket连接并跳转登录页
			if (!this.checkLogin()) {
				uni.$userSocket && uni.$userSocket.disconnect()
				uni.reLaunch({
					url: 'pages/login/login'
				})
				return
			}
			this.connectSocket()
			this.getFriendGroupings()
			this.getSessions()
			this.getApplies()
		},
		onShow: function() {
			console.log('App Show')
			this.setTabBarBadge(this.applyNum)
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			// 将 `this.方法名()` 映射为 `this.$store.commit('方法名')`
			...mapMutations(['userLogin', 'addNewMessage', 'addNewApply', 'addNewFriend', 'editApplyAccept']),
			// 将 `this.方法名()` 映射为 `this.$store.dispatch('方法名')`
			...mapActions(['getSessions', 'getFriendGroupings', 'getApplies']),
			// 检测登录，不验证token
			checkLogin() {
				if (this.token) {
					return true
				}
				const user = uni.getStorageSync('user')
				if (user) {
					this.userLogin(user, this.connectSocket)
					return true
				}
				return false
			},
			// 设置tabbar角标
			setTabBarBadge(number) {
				if (number > 0) {
					uni.setTabBarBadge({
						index: 1,
						text: number + ''
					})
				} else {
					uni.removeTabBarBadge({
						index: 1
					})
				}
			},
			// 连接socket
			connectSocket() {
				if (uni.$userSocket && uni.$userSocket.connected) {
					return
				}
				// 挂载到uni实例上
				uni.$userSocket = uni.$socket({
					// 连接成功后的回调
					connect: (socket) => {
						// 监听新好友申请
						socket.on('newApply', (data) => {
							console.log('收到好友申请：', data)
							this.addNewApply(data)
						})
						// 监听好友申请被同意
						socket.on('applyAccept', (data) => {
							console.log('好友申请被同意：', data)
							// 修改好友申请状态
							this.editApplyAccept({
								applicantId: this.loginId,
								targetId: data.friendId,
								isAccept: 1
							})
							// 添加新好友
							this.addNewFriend(data)
							// 添加新消息
							this.addNewMessage({
								senderId: data.friendId,
								receiverId: this.loginId,
								type: 0,
								content: '我同意了你的好友申请',
								addition: '',
								sendTime: Date.now()
							})
						})
						// 监听好友申请被拒绝
						socket.on('applyRefuse', (data) => {
							console.log('好友申请被拒绝：', data)
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	view,
	view::before,
	view::after,
	text,
	text::before,
	text::after,
	progress,
	progress::before,
	progress::after,
	button,
	button::before,
	button::after,
	checkbox,
	checkbox::before,
	checkbox::after,
	form,
	form::before,
	form::after,
	input,
	input::before,
	input::after,
	label,
	label::before,
	label::after,
	picker,
	picker::before,
	picker::after,
	radio,
	radio::before,
	radio::after,
	slider,
	slider::before,
	slider::after,
	switch,
	switch::before,
	switch::after,
	textarea,
	textarea::before,
	textarea::after,
	navigator,
	navigator::before,
	navigator::after,
	audio,
	audio::before,
	audio::after,
	image,
	image::before,
	image::after,
	video,
	video::before,
	video::after {
		box-sizing: border-box;
	}

	button::after {
		display: none;
	}

	page {
		color: $uni-text-color;
		font-family: "PingFangSC-Medium";
		font-size: $uni-font-size-base;
		background: $uni-bg-color;
	}
</style>
