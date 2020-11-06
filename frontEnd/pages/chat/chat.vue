<template>
	<view id="chat">
		<NavBar :fixed="true" :title="talker.name" leftIcon="back" @leftClick="gotoBack">
			<image slot="right" src="@/static/images/temp/avatar.png" class="avatar"></image>
		</NavBar>
		<MyScroll ref="mescrollRef" class="scroll" :style="{transform:'translateY('+scrollMoveHeight+')'}" :top="88" :topbar="true"
		 bottom="98" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback">
			<block v-for="(item,index) in messages" :key="index">
				<MessageTime v-if="index===0 || contrastTime(item.timeStamp,messages[index-1].timeStamp)">{{item.time}}</MessageTime>
				<MessageItem :id="'msg-'+index" :messageItem="item" :reverse="item.id===myself.id" :playing="innerAudioContext&&item.content.voice===innerAudioContext.src&&voicePlaying"
				 @imageClick="previewImage" @voiceClick="voiceClick" @locationClick="openLocation" />
			</block>
		</MyScroll>
		<ChatPanel @voiceStart="voiceStart" @getChangeHeight="getChangeHeight" @submitMessage="submitMessage" />
	</view>
</template>

<script>
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js'
	import MyScroll from "@/components/MyScroll/MyScroll.vue"
	import NavBar from '@/components/NavBar/NavBar.vue'
	import MessageTime from '@/components/Message/MessageTime.vue'
	import MessageItem from '@/components/Message/MessageItem.vue'
	import ChatPanel from '@/components/ChatPanel/ChatPanel.vue'

	import {
		messageTime
	} from '@/common/js/util.js'
	import {
		apiMessages
	} from '@/common/js/mock.js'

	export default {
		components: {
			MyScroll,
			NavBar,
			MessageTime,
			MessageItem,
			ChatPanel
		},
		mixins: [MescrollMixin],
		data() {
			return {
				// mescroll下拉配置
				downOption: {
					textInOffset: '加载更多',
					textOutOffset: '释放立即加载',
					textLoading: '正在加载...',
					autoShowLoading: true,
					offset: 30,
					inOffsetRate: 0.5
				},
				// mescroll上拉配置
				upOption: {
					use: false, // 禁止上拉
					toTop: {
						src: '' // 不显示回到顶部按钮
					}
				},
				myself: {
					id: 'o',
					name: 'OUZERO',
					avatar: '/static/images/temp/avatar/' + 'myself.jpg',
				},
				talker: {
					name: 'Linda',
					avatar: '/static/images/temp/avatar/' + '1.jpg',
				},
				pageNum: 1, // 当前页数
				loadNum: 10, //加载数量
				loadOver: false, // 是否加载完成
				messages: [],
				images: [],
				isLoading: false,
				scrollMoveHeight: '0',
				innerAudioContext: null,
				voicePlaying: false
			}
		},
		onLoad() {},
		onHide() {
			this.innerAudioContext && this.innerAudioContext.stop()
		},
		onUnload() {
			this.innerAudioContext && this.innerAudioContext.destroy()
		},
		methods: {
			// mescroll初始化完成的回调
			mescrollInit() {},
			// mescroll下拉刷新的回调
			downCallback() {
				this.getMessages(this.nowPage, this.loadNum)
			},
			// 滚动到最底部
			scrollToBottom(duration = 300) {
				this.$nextTick(() => {
					this.mescroll.scrollTo(99999, duration)
				})
			},
			// 获取消息
			getMessages(page, num) {
				apiMessages(this.pageNum, this.loadNum).then(result => {
					// 当前页数加一
					this.pageNum++;
					// 关闭下拉加载状态
					this.mescroll.endSuccess();
					if (result.err === 0) {
						// console.log('获取成功', result.data)
						let messages = result.data
						let messageNum = messages.length
						//加载完成
						if (messageNum < this.loadNum) {
							this.loadOver = true
							this.mescroll.lockDownScroll(true); // 锁定下拉
						}
						// 处理消息数据
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
							item.time = messageTime(item.timeStamp)
							this.messages.unshift(messages[index])
						})
						this.$nextTick(() => {
							// console.log(this.messages)
							if (this.pageNum <= 2) {
								// 第一页直接滚动到底部 ( this.pageNum已在前面加1 )
								this.scrollToBottom(0)
							} else if (messageNum > 0) {
								// 保持顶部消息的位置
								const query = uni.createSelectorQuery().in(this);
								query.select('#msg-' + messageNum).boundingClientRect(v => {
									console.log('#msg-' + messageNum)
									let statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
									let offset = uni.upx2px(280) + statusBarHeight
									console.log(offset)
									console.log("节点离页面顶部的距离 " + v.top);
									this.mescroll.scrollTo(v.top - offset, 0) // 减去上偏移量100
								}).exec();
							}
						})
					} else {
						console.log('获取失败')
					}
				}).catch(() => {
					console.log('请求失败')
					this.pageNum--; // 请求失败，必须回减页码
					this.mescroll.endErr(); // 关闭下拉加载状态
				})
			},
			// 对比时间，前后两条消息时间差小于5分钟则不显示时间
			contrastTime(later, earlier) {
				return later - earlier > 1000 * 60 * 5
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
			// 发送消息
			submitMessage(type, content) {
				console.log(content)
				let message = {
					id: this.myself.id,
					type,
					avatar: this.myself.avatar,
					content,
					timeStamp: new Date(),
					time: messageTime(new Date())
				}
				if (type === 1) {
					this.images.push(content)
				}
				this.messages.push(message)
				this.scrollToBottom()
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
			},
			// 返回上一页
			gotoBack() {
				uni.navigateBack()
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

	.avatar {
		width: 68rpx;
		height: 68rpx;
		border-radius: $uni-border-radius-sm;
		vertical-align: middle;
	}

	.scroll {
		transition: all 0.225s;
	}
</style>
