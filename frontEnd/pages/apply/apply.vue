<template>
	<view id="apply">
		<NavBar :fixed="true" title="新朋友" leftIcon="back" rightText="添加" @leftClick="gotoBack" @rightClick="gotoAdd" />
		<MyScroll ref="mescrollRef" :top="88" :topbar="true" :bottombar="false" :down="downOption" :up="upOption" @init="mescrollInit"
		 @down="downCallback">
			<ListItem v-for="(item,index) in applies" :key="index" :icon="userProfile(item.applicantId===loginId?item.targetId:item.applicantId).avatar"
			 :title="userProfile(item.applicantId===loginId?item.targetId:item.applicantId).nickname" :describe="item.applicantId===loginId?'已发送好友申请':item.message"
			 :showArrow="false" @click="gotoPersonal(item.applicantId===loginId?item.targetId:item.applicantId)">
				<block v-if="item.applicantId===loginId" slot="right">
					<view class="status">{{item.isAccept===1?'对方已同意':(item.isAccept===2?'对方已拒绝':'等待验证')}}</view>
				</block>
				<block v-else slot="right">
					<view v-if="item.isAccept===0" class="consent" @tap.stop="accept(item._id,item.applicantId)">同意</view>
					<view v-else class="status">{{item.isAccept===1?'已同意':'已拒绝'}}</view>
				</block>
			</ListItem>
		</MyScroll>
	</view>
</template>

<script>
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js'
	import MyScroll from "@/components/MyScroll/MyScroll.vue"
	import NavBar from '@/components/NavBar/NavBar.vue'
	import ListItem from '@/components/List/ListItem.vue'
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
			ListItem
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
				}
			}
		},
		computed: {
			// 将 `this.状态名` 映射为 `store.state.状态名`
			...mapState(['loginId', 'applies', 'defaultGroupingId']),
			// 把 `this.getter名` 映射为 `this.$store.getters.getter名`
			...mapGetters(['userProfile'])
		},
		watch: {
			// 观察好友申请数组变化，设置申请已读
			applies(newVal) {
				const applyNum = newVal.length,
					latestTime = newVal[applyNum - 1].applyTime
					console.log(newVal)
				applyNum > 0 && uni.$userSocket.emit('readApply', {
					latestTime
				}, (result) => {
					console.log(result)
					if (result.code === 200) {
						this.readApply(latestTime)
					}
				})
			}
		},
		methods: {
			// 将 `this.方法名()` 映射为 `this.$store.commit('方法名')`
			...mapMutations(['readApply', 'acceptApply', 'addNewMessage']),
			// 将 `this.方法名()` 映射为 `this.$store.dispatch('方法名')`
			...mapActions(['getApplies']),
			// mescroll初始化完成的回调
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			// mescroll下拉刷新的回调
			downCallback() {
				this.getApplies().then(result => {
					// 结束下拉加载状态(成功)
					this.endDropDown(true)
				}).catch(error => {
					// 结束下拉加载状态(失败)
					this.endDropDown(false)
				})
			},
			// 结束下拉
			endDropDown(success) {
				if (success) {
					this.mescroll.optDown.textEnding = '刷新成功'
					this.mescroll.optDown.endFail = false
					this.mescroll.endErr()
				} else {
					this.mescroll.optDown.textEnding = '刷新失败'
					this.mescroll.optDown.endFail = true
					this.mescroll.endSuccess()
				}
			},
			// 返回上一页
			gotoBack() {
				uni.navigateBack()
			},
			// 跳转添加页
			gotoAdd() {
				uni.navigateTo({
					url: '../add/add'
				})
			},
			// 跳转个人页
			gotoPersonal(id) {
				uni.navigateTo({
					url: '../personal/personal?id=' + id
				})
			},
			// 同意好友申请
			accept(_id, applicantId) {
				uni.showLoading({
					title: '加载ing'
				})
				uni.$userSocket.emit('acceptApply', {
					_id,
					groupingId: this.defaultGroupingId
				}, (result) => {
					console.log('同意好友申请成功：', result)
					if (result.code !== 200) {
						uni.showModal({
							content: result.msg,
							showCancel: false
						})
					} else {
						// 同意好友申请
						this.acceptApply(result.data)
						// 添加新消息
						this.addNewMessage({
							senderId: result.data.userId,
							receiverId: result.data.friendId,
							type: 0,
							content: '我同意了你的好友申请',
							addition: '',
							sendTime: Date.now()
						})
						uni.showToast({
							title: '同意成功',
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
	.consent {
		padding: 8rpx 24rpx;
		font-size: $uni-font-size-sm;
		background: rgba(243, 247, 250, 1);
		border-radius: $uni-border-radius-lg;
		transition: all 0.3s;

		&:active {
			background: rgba(220, 220, 220, 1);
		}
	}

	.status {
		padding: 0 12rpx;
		color: $uni-text-color-grey;
		font-size: $uni-font-size-sm;
	}
</style>
