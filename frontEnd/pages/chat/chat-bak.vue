<template>
	<view id="chat">
		<NavBar class="nav-bar" :fixed="true">
			<BtnBack slot="left" />
			<view slot="center">{{talker.name}}</view>
			<view slot="right">
				<image src="@/static/images/temp/avatar.png" class="avatar"></image>
			</view>
		</NavBar>
		<scroll-view scroll-y="true" class="chat-area" :scroll-into-view="scrollIntoId" :scroll-with-animation="scrollAnimation"
		 :style="{transform:'translateY('+scrollMoveHeight+')'}" @scrolltoupper="loadMore">
			<view class="load-more" v-show="isLoading">
				<image src="/static/images/chat/load.svg" mode=""></image>
			</view>
			<view class="message-list">
				<block v-for="(item,index) in messages" :key="index">
					<MessageTime v-if="index===0 || contrastTime(item.timeStamp,messages[index-1].timeStamp)">{{item.time}}</MessageTime>
					<MessageItem :id="'msg-'+index" :messageItem="item" :reverse="item.id===myself.id" :playing="innerAudioContext&&item.content.voice===innerAudioContext.src&&voicePlaying"
					 @imageClick="previewImage" @voiceClick="voiceClick" @locationClick="openLocation" />
				</block>
			</view>
		</scroll-view>
		<ChatPanel @voiceStart="voiceStart" @getChangeHeight="getChangeHeight" @submitMessage="submitMessage" />
	</view>
</template>

<script>
	import NavBar from '@/components/NavBar/NavBar.vue'
	import BtnBack from '@/components/Btn/BtnBack.vue'
	import MessageTime from '@/components/Message/MessageTime.vue'
	import MessageItem from '@/components/Message/MessageItem.vue'
	import ChatPanel from '@/components/ChatPanel/ChatPanel.vue'

	import util from '@/common/js/util.js'
	import data from '@/common/js/data.js'

	export default {
		data() {
			return {
				myself: {
					id: 'o',
					name: 'OUZERO',
					avatar: '/static/images/temp/avatar/' + 'myself.jpg',
				},
				talker: {
					name: 'Linda',
					avatar: '/static/images/temp/avatar/' + '1.jpg',
				},
				messages: [],
				images: [],
				nowPage: 1,
				loadNum: 10,
				isLoading: false,
				scrollIntoId: '',
				scrollAnimation: false,
				scrollMoveHeight: '0',
				innerAudioContext: null,
				voicePlaying: false
			}
		},
		components: {
			NavBar,
			BtnBack,
			MessageTime,
			MessageItem,
			ChatPanel
		},
		onLoad() {
			this.getMessages(this.nowPage, this.loadNum)
		},
		onHide() {
			this.innerAudioContext && this.innerAudioContext.stop()
		},
		onUnload() {
			this.innerAudioContext && this.innerAudioContext.destroy()
		},
		methods: {
			// 对比时间，前后两条消息时间差小于5分钟则不显示时间
			contrastTime(later, earlier) {
				return later - earlier > 1000 * 60 * 5
			},
			// 获取消息
			getMessages(page, num) {
				let messages = data.messages(page, num)
				let messageNum = messages.length
				console.log(messages)
				this.isLoading = false
				if (messageNum === 0) {
					uni.showToast({
						title: '加载完毕',
						duration: 500
					})
					return
				}
				messages.forEach((item, index) => {
					if (item.type === 1) {
						item.content = '/static/images/temp/message/' + item.content
						this.images.unshift(item.content)
					} else if (item.type === 2) {
						item.content = '/static/audios/temp/message/' + item.content
					}
					if (item.id === this.myself.id) {
						item.avatar = this.myself.avatar
					} else {
						item.avatar = this.talker.avatar
					}
					item.time = util.messageTime(item.timeStamp)
					this.messages.unshift(messages[index])
				})
				this.nowPage++
				this.$nextTick(() => {
					this.scrollIntoId = 'msg-' + (messageNum - 1)
				})
			},
			// 加载更多
			loadMore() {
				if (this.isLoading) {
					return
				}
				this.scrollAnimation = false
				this.isLoading = true
				setTimeout(() => {
					this.getMessages(this.nowPage, this.loadNum)
				}, 500)
			},
			// 预览图片
			previewImage(current) {
				uni.previewImage({
					current,
					urls: this.images,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			// 监听聊天面板高度变化
			getChangeHeight(height) {
				let scrollMoveHeight = '-' + height
				if (scrollMoveHeight !== this.scrollMoveHeight) {
					console.log(scrollMoveHeight)
					this.scrollMoveHeight = scrollMoveHeight
				}
			},
			// 滚动到最底部
			scrollToBottom(scrollAnimation = this.scrollAnimation) {
				this.scrollIntoId = ''
				this.scrollAnimation = scrollAnimation
				setTimeout(() => {
					this.scrollIntoId = 'msg-' + (this.messages.length - 1)
				}, 50)
				/* this.$nextTick(() => {
					console.log(this.messages.length)
					this.scrollIntoId = 'msg-' + (this.messages.length - 1)
				}) */
			},
			// 发送消息
			submitMessage(type, content) {
				console.log(content)
				let message = {
					id: this.myself.id,
					type,
					avatar: this.myself.avatar,
					content,
					timeStamp: new Date(),
					time: util.messageTime(new Date())
				}
				if (type === 1) {
					this.images.push(content)
				}
				this.messages.push(message)
				this.scrollToBottom(true)
			},
			// 播放、暂停音频
			voiceClick(src) {
				console.log(src)
				// 如果不存在音频控制实例，则创建
				if (!this.innerAudioContext) {
					this.innerAudioContext = uni.createInnerAudioContext()
					this.innerAudioContext.autoplay = true;
					this.innerAudioContext.onPlay(() => {
						this.voicePlaying = true
					})
					this.innerAudioContext.onPause(() => {
						this.voicePlaying = false
					})
					this.innerAudioContext.onStop(() => {
						this.voicePlaying = false
					})
					this.innerAudioContext.onEnded(() => {
						this.voicePlaying = false
					})
				}
				// 如果是同一个语音，则判断是否在播放
				if (this.innerAudioContext.src && this.innerAudioContext.src === src) {
					// 如果正在播放则停止，否则播放
					if (!this.innerAudioContext.paused) {
						this.innerAudioContext.stop()
					} else {
						this.innerAudioContext.play()
					}
				} else {
					// 如果正在播放则停止，否则播放
					if (!this.innerAudioContext.paused) {
						this.innerAudioContext.stop()
					}
					// 无音频资源
					if (!src) {
						uni.showToast({
							title: '无音频资源',
							icon: 'none',
							duration: 500
						});
					}
					this.innerAudioContext.src = src
				}
			},
			// 开始录音时停止播放语音
			voiceStart() {
				if (this.innerAudioContext && !this.innerAudioContext.paused) {
					this.innerAudioContext.stop()
				}
			},
			// 查看位置
			openLocation(location) {
				uni.openLocation({
					name: location.name,
					address: location.address,
					latitude: location.latitude,
					longitude: location.longitude
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@keyframes infiniteRotate {
		0% {
			transform: rotate(0);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	page {
		background: $uni-bg-color-grey;
		overflow: hidden;
	}

	.avatar {
		width: 68rpx;
		height: 68rpx;
		border-radius: $uni-border-radius-sm;
		vertical-align: middle;
	}

	.chat-area {
		height: 100vh;
		padding-top: calc(88rpx + var(--status-bar-height));
		padding-bottom: 96rpx;
		background: $uni-bg-color-grey;
		transition: all 0.225s;

		.load-more {
			width: 36rpx;
			height: 36rpx;
			margin: auto;
			margin-top: $uni-spacing-col-sm;
			animation: infiniteRotate 0.8s linear infinite;

			image {
				width: 36rpx;
				height: 36rpx;
			}
		}
	}
</style>
