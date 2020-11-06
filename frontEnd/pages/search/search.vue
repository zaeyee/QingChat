<template>
	<view id="local-search" :class="{active}">
		<view class="header">
			<view class="input">
				<input type="text" v-model="keyword" :focus="true" :placeholder="placeholder" confirm-type="搜索" @input="inputKeyword"
				 @confirm="searchGlobal" />
				<image class="icon" src="/static/images/common/search.svg"></image>
			</view>
			<view class="cancel" @tap="closeSearch">取消</view>
		</view>
		<view class="result" v-show="active">
			<Collapse v-if="showResult">
				<CollapseItem title="用户" :open="true" :disabled="true" :leftArrow="false" rightText="sss">
					<ListItem v-for="(item,index) in result.users" :key="index" size="sm" colSpacing="0" rowSpacing="0" :icon="item.avatar || '/static/images/personal/avatar.png'"
					 :title="item.noteName || item.nickname" :describe="item.intro" :showArrow="false" @click="gotoPersonal(item.id)" />
					<view slot="right">查看更多</view>
				</CollapseItem>
				<CollapseItem title="群聊" :open="true" :disabled="true" :leftArrow="false">
					<ListItem v-for="(item,index) in result.groups" :key="index" size="sm" colSpacing="0" rowSpacing="0" :icon="item.avatar"
					 :title="item.name" :showArrow="false" @click="gotoPersonal" />
					<view slot="right">查看更多</view>
				</CollapseItem>
			</Collapse>
			<view v-else-if="type===2 && keyword">
				<ListItem :title="'找用户：'+keyword" icon="user" @click="searchUser" />
				<ListItem :title="'找群聊：'+keyword" icon="group" @click="searchGroup" />
			</view>
		</view>
	</view>
</template>

<script>
	import Collapse from '@/components/Collapse/Collapse.vue'
	import CollapseItem from '@/components/Collapse/CollapseItem.vue'
	import ListItem from '@/components/List/ListItem.vue'
	import {
		debounce
	} from '@/common/js/util.js'
	import {
		mapActions
	} from 'vuex'

	const idReg = /^[1-9]\d{4,9}$/

	export default {
		components: {
			Collapse,
			CollapseItem,
			ListItem
		},
		data() {
			return {
				type: 1,
				active: false,
				keyword: '',
				showResult: false,
				placeholder: '搜索',
				result: {
					users: [],
					groups: []
				}
			}
		},
		onLoad(options) {
			let {
				type,
				placeholder
			} = options
			if (type) {
				this.type = parseInt(type)
			}
			if (placeholder) {
				this.placeholder = placeholder
			}
		},
		onReady() {
			// 展示显示动画
			setTimeout(() => {
				this.active = true
			}, 20)
		},
		onBackPress(e) {
			// 拦截点击物理返回事件，先展示动画再关闭
			if (e.from === 'backbutton') {
				this.closeSearch()
				return true
			}
		},
		methods: {
			// 将 `this.方法名()` 映射为 `this.$store.dispatch('方法名')`
			...mapActions(['getUserProfile']),
			// 关闭搜索页
			closeSearch() {
				this.keyword = ''
				this.active = false
				setTimeout(() => {
					uni.navigateBack({
						animationType: 'fade-out'
					})
				}, 280)
			},
			// 去个人页
			gotoPersonal(id) {
				uni.navigateTo({
					url: '../personal/personal?id=' + id
				})
			},
			// 输入
			inputKeyword() {
				this.showResult = false
			},
			// 搜索全局
			searchGlobal() {
				if (!this.keyword) {
					uni.showToast({
						title: '请输入关键词',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '加载ing'
				})
				// 发射搜索全局
				uni.$userSocket.emit('searchGlobal', {
					keyword: this.keyword
				}, (result1) => {
					if (result1.code !== 200) {
						uni.showToast({
							title: result1.msg,
							icon: 'none'
						})
					} else {
						this.showResult = true
						this.result.users = [result1.data]
					}
					uni.hideLoading()
				})
			},
			// 搜索用户
			searchUser() {
				if (!idReg.test(this.keyword)) {
					uni.showToast({
						title: '请输入正确的ID',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '搜索ing'
				})
				const id = this.keyword
				this.getUserProfile(id).then(result => {
					uni.hideLoading()
					// 跳转到个人页
					this.gotoPersonal(id)
				}).catch(error => {
					console.log(error)
					uni.hideLoading()
					uni.showToast({
						title: error,
						icon: 'none'
					})
				})
			},
			// 搜索群
			searchGroup() {

			}
		}
	}
</script>

<style lang="scss" scoped>
	#local-search {
		display: flex;
		flex-direction: column;
		padding-top: calc(88rpx + var(--status-bar-height));

		.header {
			flex: none;
			display: flex;
			align-items: center;
			padding: 8rpx 20rpx;
			background: $uni-bg-color;
			overflow: hidden;
			transition: all 0.3s;

			.input {
				flex: 1;
				position: relative;
				display: flex;
				justify-content: center;
				align-items: center;


				.icon {
					position: absolute;
					top: calc(50% - 14rpx);
					left: 20rpx;
					width: 28rpx;
					height: 28rpx;
					margin-right: 8rpx;
				}

				input {
					width: 100%;
					height: 60rpx;
					line-height: 40rpx;
					padding: 10rpx 28rpx 10rpx 58rpx;
					color: $uni-text-color;
					font-size: $uni-font-size-base;
					background: $uni-bg-color-white;
					border-radius: 50rpx;
				}
			}

			.cancel {
				flex: none;
				width: 0;
				opacity: 0;
				white-space: nowrap;
				transition: all 0.3s;
			}
		}

		.result {
			position: absolute;
			bottom: 0;
			width: 100%;
			height: calc(100% - 96rpx - var(--status-bar-height));
			overflow-y: auto;
		}

		&.active {
			.header {
				margin-top: -76rpx;

				.cancel {
					width: 60rpx;
					opacity: 1;
					margin-left: 20rpx;
				}
			}
		}
	}
</style>
