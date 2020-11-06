<template>
	<view id="login">
		<form @submit="login">
			<image src="@/static/images/logo.png" class="logo"></image>
			<view class="input">
				<input type="text" v-model="account" placeholder="倾遇号/邮箱" />
			</view>
			<view class="input">
				<input type="text" v-model="password" placeholder="输入密码" password="true" />
			</view>
			<button form-type="submit" class="submit" :class="{active:inputCheck}">
				<view class="icon"></view>
			</button>
		</form>
		<view class="footer">
			<view @tap="">忘记密码</view>
			<view @tap="gotoRegister">用户注册</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	const idReg = /^[1-9]\d{4,9}$/
	const emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/i

	export default {
		name: 'Login',
		data() {
			return {
				account: '',
				password: ''
			}
		},
		computed: {
			// 将 `this.状态名` 映射为 `store.state.状态名`
			...mapState(['token', 'loginId']),
			// 输入检查
			inputCheck() {
				return (idReg.test(this.account) || emailReg.test(this.account)) && this.password.length >= 8
			}
		},
		onLoad() {
			if (this.token && this.loginId) {
				uni.reLaunch({
					url: '../index/index'
				})
			}
		},
		methods: {
			// 将 `this.方法名()` 映射为 `this.$store.commit('方法名')`
			...mapMutations(['userLogin']),
			// 去注册页
			gotoRegister() {
				uni.navigateTo({
					url: '../register/register'
				})
			},
			// 登录
			login() {
				if (!this.inputCheck) {
					return
				}
				uni.showLoading({
					title: '加载ing'
				})
				uni.$request({
					url: '/user/login',
					data: {
						account: this.account,
						password: this.password
					},
					errorTip: true
				}).then(result => {
					this.userLogin(result.data)
					uni.showToast({
						title: '登录成功',
						duration: 500
					})
					setTimeout(() => {
						uni.reLaunch({
							url: '../index/index'
						})
					}, 500)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	#login {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding-top: var(--status-bar-height);
		background: $uni-bg-color-white;
	}

	.logo {
		display: block;
		width: 192rpx;
		height: 92rpx;
		margin: 76rpx auto;
	}

	.input {
		text-align: center;
		line-height: 50rpx;
		font-size: $uni-font-size-base;
		margin: $uni-spacing-col-sm $uni-spacing-row-lg;
		padding: $uni-spacing-col-sm $uni-spacing-row-base;
		background: $uni-bg-color;
		border-radius: 50rpx;
	}

	.submit {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 110rpx;
		height: 110rpx;
		background: $uni-bg-color;
		margin-top: $uni-spacing-col-base * 2;
		border-radius: $uni-border-radius-circle;
		transition: all 0.3s;

		&.active {
			background: $uni-color-primary;
		}

		.icon {
			width: 48rpx;
			height: 6rpx;
			background: $uni-bg-color-white;
			border-radius: $uni-border-radius-base;

			&::before,
			&::after {
				content: "";
				position: absolute;
				right: 0;
				width: 30rpx;
				height: 6rpx;
				background: $uni-bg-color-white;
				border-radius: $uni-border-radius-base;
				transform-origin: left;
			}

			&::before {
				transform: translateY(30%) rotateZ(-135deg);
			}

			&::after {
				transform: translateY(-30%) rotateZ(135deg);
			}
		}
	}

	.footer {
		position: relative;
		display: flex;
		justify-content: space-evenly;
		margin-bottom: 80rpx;
		font-size: $uni-font-size-sm;

		&::before {
			content: "";
			position: absolute;
			top: 15%;
			width: 4rpx;
			height: 70%;
			background: $uni-bg-color;
		}
	}
</style>
