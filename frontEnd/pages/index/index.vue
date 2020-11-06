<template>
	<view id="index">
		<NavBar :fixed="true" title="消息" rightIcon="add" @leftClick="logout" @rightClick="toggleExtend">
			<image slot="left" src="@/static/images/temp/avatar.png" class="avatar"></image>
		</NavBar>
		<MyScroll ref="mescrollRef" :top="88" :topbar="true" :bottombar="false" :down="downOption" :up="upOption" @init="mescrollInit"
		 @down="downCallback">
			<Search @click="gotoSearch" />
			<uniSwiperAction class="swiper-action">
				<uniSwiperActionItem v-for="(item,index) in sessions" :key="index" class="swiper-action-item">
					<ListChat class="swiper-action-main" colSpacing="0" rowSpacing="0" :topping="false" :avatar="userProfile(item.friendId).avatar"
					 :title="friendConfig(item.friendId).noteName || userProfile(item.friendId).nickname" :time="formatTime(item.latestTime)"
					 :describe="item.latestMessage" :tip="item.unreadNumber" @click="gotoChat" @tipRemove="tipRemove(item.id)" />
					<view slot="right" class="swiper-action-more">
						<view class="topping" @click="toppingClick(item.id)">{{item.topping?'取消置顶':'置顶'}}</view>
						<view class="delete" @click="deleteClick(item.id)">删除</view>
					</view>
				</uniSwiperActionItem>
			</uniSwiperAction>
			<view v-if="sessions.length==0" class="none">
				<image class="icon" src="/static/images/index/none.svg" mode="aspectFit"></image>
				<text>暂时没有新消息</text>
			</view>
		</MyScroll>
		<view class="extend" :class="{show:showExtend}">
			<view class="mask" @tap="toggleExtend"></view>
			<view class="panel">
				<view class="item">
					<Icon type="scan-code" class="icon" />
					<text>扫一扫</text>
				</view>
				<view class="item" @tap="gotoAdd">
					<Icon type="add-contact" class="icon" />
					<text>加好友/群</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js'
	import MyScroll from '@/components/MyScroll/MyScroll.vue'
	import NavBar from '@/components/NavBar/NavBar.vue'
	import Icon from '@/components/Icon/Icon.vue'
	import Search from '@/components/Search/Search.vue'
	import uniSwiperAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwiperActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import ListChat from '@/components/List/ListChat.vue'
	import {
		sessionTime
	} from '@/common/js/util.js'
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} from 'vuex'

	export default {
		components: {
			MyScroll,
			NavBar,
			Icon,
			Search,
			uniSwiperAction,
			uniSwiperActionItem,
			ListChat
		},
		mixins: [MescrollMixin],
		data() {
			return {
				// mescroll实例对象
				mescroll: null,
				// mescroll下拉配置
				downOption: {
					auto: false,
					textOutOffset: '释放立即刷新',
					textLoading: '正在刷新...',
					textEnding: '刷新成功',
					endFail: false,
					// autoShowLoading: true,
					offset: 36,
					inOffsetRate: 0.5
				},
				// mescroll上拉配置
				upOption: {
					use: false, // 禁止上拉
					toTop: {
						src: '' // 不显示回到顶部按钮
					}
				},
				lastTime: '',
				pageHide: false,
				showExtend: false
			}
		},
		computed: {
			// 将 `this.状态名` 映射为 `store.state.状态名`
			...mapState(['sessions']),
			// 把 `this.getter名` 映射为 `this.$store.getters.getter名`
			...mapGetters(['friendConfig', 'userProfile', 'applyNum']),
			// 整理新的会话数据
			newSessions() {
				/* let toppingSessions = [],
					otherSessions = []
				this.sessions.forEach((item, index) => {
					if (item.topping) {
						toppingSessions.push(item)
					} else {
						otherSessions.push(item)
					}
				})
				toppingSessions.sort((a, b) => {
					return b.timeStamp - a.timeStamp
				})
				otherSessions.sort((a, b) => {
					return b.timeStamp - a.timeStamp
				})
				// console.log(toppingSessions)
				return toppingSessions.concat(otherSessions) */
			}
		},
		onLoad() {
			let messages = uni.getStorageSync('messages')
			// this.lastTime = 
		},
		onHide() {
			this.pageHide = true
		},
		onTabItemTap(e) {
			if (!this.pageHide) {
				this.mescroll && this.mescroll.scrollTo(0, 300)
			}
			this.pageHide = false
		},
		methods: {
			// 将 `this.方法名()` 映射为 `this.$store.commit('方法名')`
			...mapMutations(['userLogout']),
			// 将 `this.方法名()` 映射为 `this.$store.dispatch('方法名')`
			...mapActions(['getSessions']),
			// mescroll初始化完成的回调
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			// mescroll下拉刷新的回调
			downCallback() {
				this.getSessions().then(result => {
					// 设置下拉成功
					this.setEnding(true)
					// 关闭下拉加载状态
					this.mescroll.endSuccess()
				}).catch(error => {
					// 设置下拉失败
					this.setEnding(false)
					// 关闭下拉加载状态
					this.mescroll.endSuccess()
				})
			},
			// 设置下拉结束语和结果
			setEnding(status) {
				this.mescroll.optDown.textEnding = status ? '刷新成功' : '刷新失败'
				this.mescroll.optDown.endFail = !status
			},
			// 格式化时间
			formatTime(timeStamp) {
				return sessionTime(timeStamp)
			},
			// 去搜索页
			gotoSearch() {
				uni.navigateTo({
					url: '../search/search',
					animationType: 'fade-in'
				})
			},
			// 去聊天页
			gotoChat() {
				uni.navigateTo({
					url: '../chat/chat'
				})
			},
			// 去登录页
			gotoLogin() {
				uni.navigateTo({
					url: '../login/login'
				})
			},
			// tip移除
			tipRemove(id) {
				this.sessions.forEach(item => {
					if (item.id === id) {
						item.tip = 0
					}
				})
			},
			// 置顶会话操作
			toppingClick(id) {
				this.sessions.forEach(item => {
					if (item.id === id) {
						item.topping = !item.topping
					}
				})
			},
			// 删除会话操作
			deleteClick(id) {
				this.sessions.forEach((item, index) => {
					if (item.id === id) {
						this.sessions.splice(index, 1)
					}
				})
			},
			// 切换扩展面板
			toggleExtend() {
				this.showExtend = !this.showExtend
			},
			// 去添加页
			gotoAdd() {
				this.toggleExtend()
				setTimeout(() => {
					uni.navigateTo({
						url: '../add/add'
					})
				}, 200)
			},
			// 注销登录
			logout() {
				this.userLogout()
				uni.navigateTo({
					url: '../login/login'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.avatar {
		width: 56rpx;
		height: 56rpx;
		border-radius: $uni-border-radius-sm;
	}

	.swiper-action-item {
		margin: 12rpx 0;
		padding: 0 12rpx;
		overflow: visible;
	}

	.swiper-action-main {
		flex: 1;
	}

	.swiper-action-more {
		display: flex;
		color: $uni-text-color-inverse;
		border-radius: $uni-border-radius-sm;
		margin-left: 12rpx;
		overflow: hidden;

		.topping,
		.delete {
			display: inline-flex;
			justify-content: center;
			align-items: center;
			min-width: 140rpx;
			padding: $uni-spacing-col-base $uni-spacing-row-base;
		}

		.topping {
			background: $uni-color-default;
		}

		.delete {
			background: $uni-color-error;
		}
	}

	.none {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: calc(100vh - 88rpx - 76rpx - var(--status-bar-height) - var(--window-bottom));
		color: #bfbfbf;
		font-size: 26rpx;

		.icon {
			height: 260rpx;
		}
	}

	.extend {
		position: fixed;
		top: 0;
		right: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		visibility: hidden;
		transition: all 0.2s;
		z-index: 100;

		&.show {
			opacity: 1;
			visibility: visible;

			.panel {
				opacity: 1;
				transform: scale(1);
			}
		}

		.mask {
			width: 100%;
			height: 100%;
			background: $uni-bg-color-mask;
		}

		.panel {
			position: fixed;
			top: calc(88rpx + var(--status-bar-height));
			right: 12rpx;
			opacity: 0;
			padding: 8rpx 0;
			background: $uni-bg-color-white;
			border-radius: 4px;
			transform: scale(0);
			transition: all 0.4s;
			transform-origin: 90% top;

			&::before {
				content: '';
				position: absolute;
				top: -24rpx;
				right: 18rpx;
				border: 14rpx solid;
				border-color: transparent transparent $uni-bg-color-white transparent;
			}

			.item {
				display: flex;
				align-items: center;
				padding: 16rpx 28rpx 16rpx 24rpx;
				transition: all 0.3s;

				&:active {
					background: $uni-bg-color-active;
				}

				.icon {
					margin-right: 10rpx;
				}
			}
		}
	}
</style>
