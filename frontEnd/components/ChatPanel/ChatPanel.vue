<template>
	<view class="chat-panel" :style="{paddingBottom:panelBottom}">
		<view class="control">
			<image class="icon" :src="'/static/images/chat/'+(voiceMode?'keyboard':'voice')+'.svg'" @tap="switchVoiceMode"></image>
			<textarea class="input" v-show="!voiceMode" v-model="textContent" auto-height="true" :show-confirm-bar="false"
			 :adjust-position="false" :focus="inputMode" @focus="inputFocus" @linechange="lineChange"></textarea>
			<view class="voice" v-show="voiceMode" :class="{hover:showVoiceMask}" @touchstart="voiceStart" @touchend="voiceEnd"
			 @touchmove.stop.prevent="voiceCancel">{{cancelVoice?'松开 取消':(showVoiceMask?'松开 发送':'按住 说话')}}</view>
			<image class="icon" :src="'/static/images/chat/'+(emojiMode?'keyboard':'face')+'.svg'" @tap="switchEmojiMode"></image>
			<view class="more-submit">
				<image class="icon" :class="{show:!showSubmit}" :src="'/static/images/chat/more.svg'" @tap="switchMoreMode"></image>
				<view class="submit" :class="{show:showSubmit}" @touchend.prevent="submitText">
					<image src="/static/images/chat/send.svg"></image>
				</view>
			</view>
		</view>
		<view class="extend" :class="{show:emojiMode||moreMode}">
			<ChatEmoji :class="{show:emojiMode}" @click="emojiClick" />
			<ChatMore :class="{show:moreMode}" @submitImages="submitImages" @submitVideo="submitVideo" @submitLocation="submitLocation" />
		</view>
		<view class="voice-mask" :class="{show:showVoiceMask}">
			<view class="duration">
				<text :style="voiceDurationStyle">{{voiceDuration}}″</text>
			</view>
			<view class="cancel" :class="{active:cancelVoice}">
				<view class="cancel-text">松开 取消</view>
				<view class="cancel-icon"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import ChatEmoji from './ChatEmoji.vue'
	import ChatMore from './ChatMore.vue'
	import permision from '@/common/js/permission.js'

	const recorderManager = uni.getRecorderManager();

	export default {
		name: 'ChatPanel',
		components: {
			ChatEmoji,
			ChatMore
		},
		data() {
			return {
				inputMode: false,
				voiceMode: false,
				emojiMode: false,
				moreMode: false,
				textContent: '',
				panelBottom: '',
				listenKeyboard: true,
				voiceInterval: null,
				voiceDuration: 0,
				showVoiceMask: false,
				cancelVoice: false,
				touchPageY: 0
			}
		},
		computed: {
			showSubmit() {
				if (this.voiceMode) {
					return false
				}
				return this.textContent.length > 0
			},
			voiceDurationStyle() {
				return {
					width: 120 + 440 * (this.voiceDuration / 60) + 'rpx'
				}
			}
		},
		watch: {
			cancelVoice(val) {
				val && uni.vibrateShort();
			}
		},
		mounted() {
			// #ifdef APP-PLUS || MP-WEIXIN || MP-QQ
			uni.onKeyboardHeightChange(res => {
				let height = res.height + 'px'
				this.panelBottom = height
				if (this.listenKeyboard && res.height === 0) {
					// 只有当监听键盘 且键盘放下时才改变高度
					console.log('键盘改变：' + height)
					this.getChangeHeight(height)
				}
			})
			// #endif
		},
		methods: {
			// 获取改变的高度
			getChangeHeight(height) {
				if (!height) {
					height = (this.emojiMode || this.moreMode) ? '480rpx' : '0'
					console.log('切换模式改变的高度（扩展面板）：' + height)
				}
				this.$emit('getChangeHeight', height)
			},
			// 切换语音模式
			switchVoiceMode() {
				this.emojiMode = false
				this.moreMode = false
				if (this.inputMode) {
					console.log('当前是输入模式，不监听键盘高度改变')
					this.listenKeyboard = false
				} else {
					this.listenKeyboard = true
				}
				if (this.voiceMode) {
					this.voiceMode = false
					this.inputMode = true
				} else {
					this.getChangeHeight()
					// #ifdef H5
					uni.showToast({
						title: '网页端暂不支持发送语音',
						icon: 'none',
						duration: 800,
					});
					return
					// #endif
					this.inputMode = false
					this.voiceMode = true
				}
			},
			// 切换Emoji表情模式
			switchEmojiMode() {
				this.voiceMode = false
				this.moreMode = false
				if (this.inputMode) {
					console.log('当前是输入模式，不监听键盘高度改变')
					this.listenKeyboard = false
				} else {
					this.listenKeyboard = true
				}
				if (this.emojiMode) {
					this.inputMode = true
					this.emojiMode = false
				} else {
					this.emojiMode = true
					this.inputMode = false
					this.getChangeHeight()
				}
			},
			// 切换更多模式
			switchMoreMode() {
				this.voiceMode = false
				this.emojiMode = false
				if (this.inputMode) {
					console.log('当前是输入模式，不监听键盘高度改变')
					this.listenKeyboard = false
				} else {
					this.listenKeyboard = true
				}
				if (this.moreMode) {
					this.inputMode = true
					this.moreMode = false
				} else {
					this.moreMode = true
					this.inputMode = false
					this.getChangeHeight()
				}
			},
			// 输入框聚焦
			inputFocus(e) {
				if (!this.inputMode) {
					this.inputMode = true
				}
				this.listenKeyboard = false
				this.emojiMode = false
				this.moreMode = false
				let height = e.detail.height ? e.detail.height + 'px' : '0'
				console.log('聚焦改变的高度（键盘）：' + height)
				this.getChangeHeight(height)
				this.listenKeyboard = true
			},
			// 输入框行数变化
			lineChange(e) {
				// 行数改变时高度改变逻辑
				if (!this.inputMode) {
					return
				}
				/* const query = uni.createSelectorQuery().in(this);
				query.select('.input').boundingClientRect(data => {
					let height = data.height + this.keyboardHeight + 'px'
					console.log('输入框行数变化：' + height)
					this.$emit('getChangeHeight', height)
				}).exec(); */
			},
			// 开始录音
			voiceStart(e) {
				permision.verifyRecordPermission().then((possess) => {
					console.log(possess)
					if (possess) {
						console.log('开始录音')
						this.$emit('voiceStart')
						this.showVoiceMask = true
						clearInterval(this.voiceInterval)
						uni.vibrateShort();
						this.touchPageY = e.changedTouches[0].pageY
						this.voiceDuration = 0
						recorderManager.start();
						this.voiceInterval = setInterval(() => {
							this.voiceDuration++
							console.log(this.voiceDuration)
							if (this.voiceDuration >= 60) {
								this.voiceEnd()
							}
						}, 1000)
					} else {
						console.log('无录音权限')
						this.voiceEnd()
						uni.showToast({
							title: '无录音权限',
							icon: 'none',
							duration: 500
						});
					}
				})
			},
			// 结束录音
			voiceEnd() {
				console.log('结束录音')
				this.showVoiceMask = false
				clearInterval(this.voiceInterval)
				recorderManager.stop();
				recorderManager.onStop((res) => {
					if (this.cancelVoice) {
						console.log('取消录音')
						this.cancelVoice = false
						return
					}
					if (this.voiceDuration < 1) {
						console.log('录音时长小于1s')
						uni.showToast({
							title: '录音时长小于1s',
							icon: 'none',
							duration: 800,
							mask: true
						});
						return
					}
					console.log(this.voiceDuration)
					let data = {
						voice: res.tempFilePath,
						duration: this.voiceDuration
					}
					this.submitMessage(3, data)
				});
			},
			// 取消录音
			voiceCancel(e) {
				// console.log(e)
				if (this.touchPageY - e.changedTouches[0].pageY > 80) {
					this.cancelVoice = true
				} else {
					this.cancelVoice = false
				}
			},
			// 输入表情
			emojiClick(emoji) {
				this.textContent += emoji
			},
			// 统一发送消息
			submitMessage(type, content) {
				this.$emit('submitMessage', type, content)
			},
			// 发送文本
			submitText() {
				this.submitMessage(0, this.textContent)
				this.textContent = ''
			},
			// 发送图片
			submitImages(pathArr) {
				pathArr.forEach(item => {
					this.submitMessage(1, item)
				})
			},
			// 发送视频
			submitVideo(path) {
				this.submitMessage(2, path)
			},
			// 发送位置
			submitLocation(content) {
				this.submitMessage(4, content)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.chat-panel {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		box-shadow: 0 0 10px rgba(237, 237, 237, 1);
		background: $uni-bg-color-white;
		transition: all 0.225s;
		z-index: 100;

		.control {
			position: relative;
			display: flex;
			align-items: flex-end;
			padding: 16rpx 10rpx;
			background: $uni-bg-color-white;
			z-index: 10;

			.icon {
				flex: none;
				width: 64rpx;
				height: 64rpx;
				margin: 0 4rpx;
				transition: all 0.3s;

				&:active {
					transform: scale(0.9);
				}
			}

			.input {
				flex: 1;
				font-size: 28rpx;
				margin: 0 8rpx;
				line-height: 34rpx;
				padding: 16rpx 24rpx;
				background: $uni-bg-color;
				border-radius: $uni-border-radius-lg;
				max-height: 120rpx;
				box-sizing: content-box;
			}

			.voice {
				flex: 1;
				font-size: 28rpx;
				margin: 0 8rpx;
				text-align: center;
				line-height: 34rpx;
				padding: 16rpx 24rpx;
				background: $uni-bg-color;
				border-radius: $uni-border-radius-lg;
				transition: all 0.3s;

				&.hover {
					background: $uni-bg-color-hover;
				}
			}

			.more-submit {
				flex: none;
				position: relative;
				min-width: 64rpx;
				height: 64rpx;
				margin: 0 4rpx;

				.icon {
					position: absolute;
					margin: 0;
					opacity: 0;
					visibility: hidden;

					&.show {
						opacity: 1;
						visibility: visible;
					}
				}

				.submit {
					padding: 10rpx;
					font-size: 0;
					color: $uni-text-color-inverse;
					background: linear-gradient(160deg, #ffa042 20%, #ff7f00 80%);
					border-radius: 40rpx;
					transition: all 0.3s;
					opacity: 0;
					visibility: hidden;

					image {
						width: 44rpx;
						height: 44rpx;
						vertical-align: middle;
					}

					&:active {
						transform: scale(0.9);
					}

					&.show {
						opacity: 1;
						visibility: visible;
						padding: 10rpx 30rpx;
					}
				}
			}

		}

		.extend {
			position: relative;
			width: 100%;
			height: 0;
			visibility: hidden;
			font-size: $uni-font-size-base;
			background: $uni-bg-color;
			transition: all 0.225s;
			z-index: 10;

			&.show {
				height: 480rpx;
				visibility: visible;
			}

			.emoji,
			.more {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				opacity: 0;
				visibility: hidden;
				transition: all 0.225s;

				&.show {
					opacity: 1;
					visibility: visible;
				}
			}
		}

		.voice-mask {
			position: fixed;
			top: 0;
			bottom: 0;
			width: 100%;
			height: 100%;
			opacity: 0;
			visibility: hidden;
			background: $uni-bg-color-mask;
			z-index: 9;
			transition: all 0.3s;

			&.show {
				opacity: 1;
				visibility: visible;
			}

			.duration {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				margin: auto;
				width: 560rpx;
				height: 76rpx;
				line-height: 76rpx;
				text-align: center;
				background: rgba(39, 40, 50, 0.2);
				border-radius: 25px;
				overflow: hidden;

				text {
					position: absolute;
					top: 0;
					left: 50%;
					display: inline-block;
					min-width: 100rpx;
					background: $uni-color-primary;
					border-radius: 25px;
					transform: translateX(-50%);
					transition: all 0.3s;
				}
			}

			.cancel {
				position: absolute;
				left: 0;
				right: 0;
				bottom: 180rpx;

				.cancel-icon {
					position: relative;
					width: 100rpx;
					height: 100rpx;
					margin: auto;
					background: rgba(130, 130, 130, 1);
					border-radius: $uni-border-radius-circle;
					transition: all 0.3s;

					&::before,
					&::after {
						content: "";
						position: absolute;
						top: calc(50% - 2rpx);
						left: 20rpx;
						width: 60rpx;
						height: 4rpx;
						background: $uni-text-color;
						border-radius: $uni-border-radius-lg;
					}

					&::before {
						transform: rotateZ(45deg);
					}

					&::after {
						transform: rotateZ(-45deg);
					}
				}

				.cancel-text {
					opacity: 0;
					visibility: hidden;
					text-align: center;
					color: $uni-text-color-inverse;
					font-size: $uni-font-size-base;
					margin-bottom: $uni-spacing-col-sm;
					transition: all 0.3s;
				}

				&.active {
					.cancel-icon {
						transform: scale(1.2);
						background: $uni-bg-color-white;
					}

					.cancel-text {
						opacity: 1;
						visibility: visible;
					}
				}
			}
		}
	}
</style>
