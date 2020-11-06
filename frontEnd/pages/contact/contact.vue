<template>
	<view id="contact">
		<NavBar :fixed="true" title="联系人" rightIcon="add-contact" @rightClick="gotoAdd">
			<image slot="left" src="@/static/images/temp/avatar.png" class="avatar"></image>
		</NavBar>
		<MyScroll ref="mescrollRef" :top="88" :topbar="true" :bottombar="false" :down="downOption" :up="upOption" @init="mescrollInit"
		 @down="downCallback">
			<Search @click="gotoSearch" />
			<ListItem title="新朋友" :showBadge="true" :badgeText="applyNum" @click="gotoApply" />
			<view class="tab-title">
				<view class="title" :class="{active:tabIndex===0}" @tap="switchTab(0)">分组</view>
				<view class="title" :class="{active:tabIndex===1}" @tap="switchTab(1)">群聊</view>
			</view>
			<swiper class="swiper" :style="{minHeight:tabs[this.tabIndex].swiperHeight}" :current="tabIndex" :duration="300"
			 easing-function="easeInOutCubic" @change="swiperChange">
				<swiper-item :style="{minHeight:tabs[0].swiperHeight}">
					<Collapse class="collapse" :closeAll="tabs[0].closeAll" :listenHeight="true" @change="collapseChange">
						<CollapseItem v-for="(groupingItem,groupingIndex) in friendGroupings" :key="groupingIndex" :title="groupingItem.name"
						 :rightText="groupingItem.friends.length">
							<ListItem v-for="(friendItem,friendIndex) in groupingItem.friends" :key="friendIndex" size="sm" colSpacing="0"
							 rowSpacing="0" :icon="userProfile(friendItem).avatar" :title="friendConfig(friendItem).noteName || userProfile(friendItem).nickname"
							 :describe="userProfile(friendItem).intro" :showArrow="false" @click="gotoPersonal(friendItem)" />
						</CollapseItem>
					</Collapse>
				</swiper-item>
				<swiper-item :style="{minHeight:tabs[1].swiperHeight}">
					<Collapse class="collapse" :closeAll="tabs[1].closeAll" :listenHeight="true" @change="collapseChange">
						<CollapseItem v-for="(groupingItem,groupingIndex) in groupGroupings" :key="groupingIndex" :title="groupingItem.name"
						 :rightText="groupingItem.groups.length">
							<ListItem v-for="(groupItem,groupIndex) in groupingItem.groups" :key="groupIndex" size="sm" colSpacing="0"
							 rowSpacing="0" :icon="groupItem.avatar" :title="groupItem.name" :showArrow="false" @click="gotoChat" />
						</CollapseItem>
					</Collapse>
				</swiper-item>
			</swiper>
		</MyScroll>
	</view>
</template>

<script>
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js'
	import MyScroll from "@/components/MyScroll/MyScroll.vue"
	import NavBar from '@/components/NavBar/NavBar.vue'
	import Search from '@/components/Search/Search.vue'
	import Collapse from '@/components/Collapse/Collapse.vue'
	import CollapseItem from '@/components/Collapse/CollapseItem.vue'
	import ListItem from '@/components/List/ListItem.vue'
	import {
		getNodeInfo
	} from '@/common/js/util.js'
	import {
		mapState,
		mapGetters,
		mapActions
	} from 'vuex'

	export default {
		components: {
			MyScroll,
			NavBar,
			Search,
			Collapse,
			ListItem,
			CollapseItem
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
				tabs: [{
					name: '分组',
					collapseHeight: 0,
					swiperHeight: 0,
					closeAll: false
				}, {
					name: '群聊',
					collapseHeight: 0,
					swiperHeight: 0,
					closeAll: false
				}],
				tabIndex: 0,
				pageHide: false
			}
		},
		computed: {
			// 将 `this.状态名` 映射为 `store.state.状态名`
			...mapState(['friendGroupings', 'groupGroupings']),
			// 把 `this.getter名` 映射为 `this.$store.getters.getter名`
			...mapGetters(['friendConfig', 'userProfile', 'applyNum'])
		},
		onHide() {
			this.pageHide = true
		},
		onTabItemTap(e) {
			if (!this.pageHide) {
				this.closeAll()
				this.mescroll && this.mescroll.scrollTo(0, 300)
			}
			this.pageHide = false
		},
		methods: {
			// 将 `this.方法名()` 映射为 `this.$store.dispatch('方法名')`
			...mapActions(['getFriendGroupings']),
			// mescroll初始化完成的回调
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			// mescroll下拉刷新的回调
			downCallback() {
				this.getFriendGroupings().then(result => {
					// 结束下拉加载状态(成功)
					this.endDropDown(true)
					this.$nextTick(() => {
						// 初始化Swiper高度
						this.initSwiperHeight()
					})
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
			// 切换选项卡
			switchTab(index) {
				this.tabIndex = index
			},
			// swiper改变
			swiperChange(e) {
				this.tabIndex = e.detail.current
			},
			// 初始化swiper高度(未展开折叠面板时高度)
			initSwiperHeight() {
				getNodeInfo('.collapse', true).then(results => {
					// console.log(results)
					results.forEach((item, index) => {
						let height = item.height + uni.upx2px(12) //获取当前tabItem的高度，12(rpx)为下方空隙大小
						this.tabs[index].collapseHeight = height
						this.tabs[index].swiperHeight = height + 'px'
					})
				})
			},
			// 监听折叠面板状态改变
			collapseChange(activeArr) {
				// console.log(activeArr)
				let height = this.tabs[this.tabIndex].collapseHeight
				activeArr.forEach(item => {
					height += item.contentHeight
				})
				// console.log(height)
				this.tabs[this.tabIndex].swiperHeight = height + 'px'
			},
			// 关闭当前tabIndex下的所有折叠面板
			closeAll() {
				this.tabs[this.tabIndex].closeAll = true
				this.$nextTick(() => {
					// 待更新数据后，重置为false用于下次更新
					this.tabs[this.tabIndex].closeAll = false
				})
			},
			// 跳转添加页
			gotoAdd() {
				uni.navigateTo({
					url: '../add/add'
				})
			},
			// 跳转搜索页
			gotoSearch() {
				uni.navigateTo({
					url: '../search/search',
					animationType: 'fade-in'
				})
			},
			// 跳转好友申请页
			gotoApply() {
				uni.navigateTo({
					url: '../apply/apply'
				})
			},
			// 跳转个人页
			gotoPersonal(id) {
				uni.navigateTo({
					url: '../personal/personal?id=' + id
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

	.tab-title {
		display: flex;
		margin: 12rpx;
		padding: 16rpx;
		background: $uni-bg-color-white;
		border-radius: $uni-border-radius-sm;
		overflow: hidden;

		.title {
			line-height: 36rpx;
			padding: 8rpx 30rpx;
			border-radius: 50rpx;
			color: $uni-text-color-grey;
			font-size: 26rpx;
			transition: all 0.3s;

			&.active {
				background: $uni-bg-color;
				color: $uni-text-color;
			}
		}
	}

	.swiper {
		height: calc(100vh - 356rpx - var(--status-bar-height));
		/* #ifdef H5 */
		height: calc(100vh - 368rpx - var(--status-bar-height) - 50px);
		/* #endif */
	}
</style>
