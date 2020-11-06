<template>
	<view id="register">
		<form @submit="register">
			<image src="@/static/images/logo.png" class="logo"></image>
			<view class="input">
				<input type="text" v-model="email" placeholder="请输入邮箱" />
			</view>
			<view class="input captcha">
				<input type="text" v-model="captcha" placeholder="请输入验证码" />
				<view class="get-captcha" :class="{active:emailCheck}" @tap="getCaptcha">{{waitSecond>0?waitSecond+'s':'获取'}}</view>
			</view>
			<view class="input">
				<input type="text" v-model="password" placeholder="请输入密码" password="true" />
			</view>
			<view class="input">
				<input type="text" v-model="reRassword" placeholder="请再次输入密码" password="true" />
			</view>
			<button form-type="submit" class="submit" :class="{active:inputCheck}">
				<view class="icon"></view>
			</button>
		</form>
		<view class="footer">
			<view @tap="backToLogin">返回登录</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'

	const emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/i

	export default {
		data() {
			return {
				email: '',
				captcha: '',
				password: '',
				reRassword: '',
				waitSecond: 0,
				captchaTimer: null
			}
		},
		computed: {
			// 邮箱检查
			emailCheck() {
				return emailReg.test(this.email)
			},
			// 输入检查
			inputCheck() {
				return this.emailCheck && this.captcha.length === 6 && this.password.length >= 8 && this.password === this.reRassword
			}
		},
		methods: {
			// 将 `this.方法名()` 映射为 `this.$store.commit('方法名')`
			...mapMutations(['userLogin']),
			// 返回登录
			backToLogin() {
				uni.navigateBack()
			},
			// 获取验证码
			getCaptcha() {
				if (!this.emailCheck || this.captchaTimer) {
					return
				}
				uni.showLoading({
					title: '加载ing'
				})
				uni.$request({
					url: '/user/captcha',
					data: {
						email: this.email
					},
					errorTip: true
				}).then(result => {
					this.waitSecond = 60
					this.captchaTimer = setInterval(() => {
						this.waitSecond--
						if (this.waitSecond <= 0) {
							clearInterval(this.captchaTimer)
							this.captchaTimer = null
						}
					}, 1000)
					uni.showToast({
						title: '验证码发送成功'
					})
				})
			},
			// 注册
			register() {
				if (!this.inputCheck) {
					return
				}
				uni.showLoading({
					title: '加载ing'
				})
				uni.$request({
					url: '/user/register',
					data: {
						email: this.email,
						captcha: this.captcha,
						password: this.password
					},
					errorTip: true
				}).then(result => {
					this.userLogin(result.data)
					uni.showToast({
						title: '注册成功',
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
	#register {
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
		height: 84rpx;
		font-size: $uni-font-size-base;
		margin: $uni-spacing-col-sm $uni-spacing-row-lg;
		padding: $uni-spacing-col-sm $uni-spacing-row-base;
		background: $uni-bg-color;
		border-radius: 50rpx;


	}

	.captcha {
		position: relative;
		padding-left: 120rpx;
		padding-right: 120rpx;

		.get-captcha {
			position: absolute;
			top: 0;
			right: 0;
			width: 120rpx;
			height: 100%;
			color: #555;
			line-height: 84rpx;
			background: $uni-bg-color-hover;
			border-radius: 0 50rpx 50rpx 0;
			cursor: pointer;
			transition: all 0.3s;

			&.active {
				background: $uni-color-primary;
			}
		}
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
