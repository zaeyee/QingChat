<template>
	<view id="personal" :style="{backgroundImage:userProfile(id).avatar}">
		<image :src="userProfile(id).avatar" mode="aspectFill" class="bg"></image>
		<NavBar leftIcon="back" :rightIcon="isFriend?'more':''" backgroundColor="transparent" @leftClick="gotoBack"
		 @rightClick="showMore" />
		<view class="main" :class="{change:showAdd && !isFriend}">
			<view class="avatar-box">
				<image class="avatar" :src="userProfile(id).avatar" mode="aspectFill"></image>
				<image class="gender" :src="genderIconSrc"></image>
			</view>
			<view class="big-name">{{userProfile(id).noteName || userProfile(id).nickname}}</view>
			<view v-if="userProfile(id).noteName" class="sub-name">昵称：{{userProfile(id).nickname}}</view>
			<view class="intro">{{userProfile(id).intro || 'Ta太懒了，还没写简介...'}}</view>
			<view v-if="isFriend" class="btn btn-primary add" @tap="gotoChat">发消息</view>
			<view v-else class="btn btn-primary add" @tap="toggleAdd">添加好友</view>
			<view class="add-box" v-if="!isFriend">
				<textarea class="add-message" v-model="message" :adjust-position="false"></textarea>
				<view class="bottom-btn">
					<view class="btn btn-default cancel" @tap="toggleAdd">取消</view>
					<view class="btn btn-primary submit" @tap="sendApply">发送</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import NavBar from '@/components/NavBar/NavBar.vue'
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} from 'vuex'

	export default {
		components: {
			NavBar,
		},
		data() {
			return {
				id: '',
				showAdd: false
			}
		},
		computed: {
			// 将 `this.状态名` 映射为 `store.state.状态名`
			...mapState(['loginId', 'friendGroupings', 'defaultGroupingId']),
			// 把 `this.getter名` 映射为 `this.$store.getters.getter名`
			...mapGetters(['userProfile']),
			// 性别图标路径
			genderIconSrc() {
				let src = '/static/images/personal/'
				let gender = this.userProfile(this.id).gender
				src += gender === 1 ? 'male' : (gender === 2 ? 'female' : 'gender')
				src += '.svg'
				return src
			},
			// 申请留言
			message() {
				return '我是' + this.userProfile(this.loginId).nickname
			},
			// 是否朋友
			isFriend() {
				if (this.id === this.loginId) {
					return true
				}
				for (let groupItem of this.friendGroupings) {
					if (groupItem.friends.includes(this.id)) {
						return true
					}
				}
				return false
			}
		},
		onLoad(options) {
			const id = parseInt(options.id)
			this.id = id
			if (!this.userProfile(id)) {
				uni.showLoading({
					title: '搜索ing'
				})
				this.getUserProfile(id).then(result => {
					uni.hideLoading()
				}).catch(error => {
					uni.hideLoading()
					uni.showModal({
						content: error,
						showCancel: false,
						success(confim) {
							confim && uni.navigateBack()
						}
					})
				})
			}
		},
		methods: {
			// 将 `this.方法名()` 映射为 `this.$store.commit('方法名')`
			...mapMutations(['addNewApply']),
			// 将 `this.方法名()` 映射为 `this.$store.dispatch('方法名')`
			...mapActions(['getUserProfile']),
			// 返回上一页
			gotoBack() {
				uni.navigateBack()
			},
			// 显示更多
			showMore() {
				console.log('更多')
			},
			// 去聊天页面
			gotoChat() {
				uni.navigateTo({
					url: '../chat/chat'
				})
			},
			// 切换添加好友
			toggleAdd() {
				this.showAdd = !this.showAdd
			},
			// 发送好友申请
			sendApply() {
				uni.showLoading({
					title: '加载ing'
				})
				uni.$userSocket.emit('sendApply', {
					targetId: this.id,
					message: this.message,
					groupingId: this.defaultGroupingId
				}, (result) => {
					console.log('发送好友申请成功：', result)
					if (result.code !== 200) {
						uni.showModal({
							content: result.msg,
							showCancel: false
						})
					} else {
						this.addNewApply(result.data)
						this.toggleAdd()
						uni.showToast({
							title: '申请成功',
							duration: 500
						})
					}
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		filter: blur(16px);
		transform: scale(1.1);

		&::after {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(255, 255, 255, .4);
		}
	}

	.main {
		position: relative;
		margin-top: 120rpx;
		text-align: center;
		letter-spacing: 2rpx;
		z-index: 1;

		.avatar-box {
			position: relative;
			display: inline-block;
			transition: all 0.3s;
			z-index: 10;

			.avatar {
				width: 380rpx;
				height: 380rpx;
				border: 8rpx solid #fff;
				border-radius: 48rpx;
				box-shadow: 0 0 40px #999;
				border-radius: $uni-border-radius-base;
				text-align: center;
			}

			.gender {
				position: absolute;
				right: 24rpx;
				bottom: 24rpx;
				width: 64rpx;
				height: 64rpx;
				padding: 6rpx;
				background: $uni-color-primary;
				border-radius: $uni-border-radius-circle;
				box-shadow: 0 0 8px $uni-color-primary-tint;
			}
		}

		.big-name {
			position: relative;
			font-size: 52rpx;
			margin-top: $uni-spacing-col-sm;
			transition: all 0.3s;
			z-index: 10;
		}

		.sub-name {
			margin-top: 4rpx;
		}

		.intro {
			width: 75%;
			margin: auto;
			margin-top: $uni-spacing-col-lg;
			text-align: left;
			line-height: 44rpx;
		}

		.add {
			position: fixed;
			left: 10%;
			bottom: $uni-spacing-col-lg;
			width: 80%;
		}

		.add-box {
			position: fixed;
			left: 0;
			bottom: -80vh;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 100%;
			height: 78vh;
			text-align: left;
			padding: 150rpx 50rpx 40rpx;
			background: $uni-bg-color-white;
			border-radius: $uni-border-radius-lg $uni-border-radius-lg 0 0;
			transition: all 0.3s;
			z-index: 9;

			.add-message {
				flex: 1;
				width: 100%;
				padding: $uni-spacing-col-base $uni-spacing-row-base;
				background: rgba(244, 244, 244, 1);
				border-radius: $uni-border-radius-base;
			}

			.bottom-btn {
				display: flex;
				margin-top: $uni-spacing-col-base;

				.cancel {
					width: 160rpx;
					margin-right: $uni-spacing-row-sm;
				}

				.submit {
					flex: 1;
				}
			}
		}


		&.change {
			.avatar-box {
				transform: scale(0.6) translate(-80%, -50%);
			}

			.big-name {
				transform: translate(5%, -400%);
			}

			.add-box {
				bottom: 0;
			}
		}
	}

	.btn {
		text-align: center;
		padding: $uni-spacing-col-sm $uni-spacing-row-sm;
		font-size: $uni-font-size-lg;
		border-radius: 50rpx;
		transition: all 0.3s;

		&:active {
			transform: scale(0.96);
		}

		&.btn-default {
			background: rgba(230, 230, 230, 1);
			box-shadow: 0 2px 6px rgba(238, 238, 238, 0.8);
		}

		&.btn-primary {
			background: $uni-color-primary;
			box-shadow: 0 2px 6px $uni-color-primary-tint;
		}
	}
</style>
