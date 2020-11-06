<template>
	<view class="nav-bar" :class="{fixed,'status-bar':statusBar}" :style="{color,backgroundColor}">
		<view class="left" @tap="leftClick">
			<Icon v-if="leftIcon" :type="leftIcon" :color="color" />
			<text v-if="leftText" class="side-text">{{leftText}}</text>
			<!-- 左边插槽 -->
			<slot name="left"></slot>
		</view>
		<view class="center">
			<text v-if="title" class="title-text">{{title}}</text>
			<!-- 中间插槽(默认) -->
			<slot />
		</view>
		<view class="right" @tap="rightClick">
			<!-- 右边插槽 -->
			<slot name="right"></slot>
			<text v-if="rightText" class="side-text">{{rightText}}</text>
			<Icon v-if="rightIcon" :type="rightIcon" :color="color" />
		</view>
	</view>
</template>

<script>
	import Icon from '../Icon/Icon.vue'

	export default {
		name: 'NavBar',
		components: {
			Icon
		},
		props: {
			// 中间标题文字
			title: {
				type: String,
				default: ''
			},
			// 左边文字
			leftText: {
				type: String,
				default: ''
			},
			// 右边文字
			rightText: {
				type: String,
				default: ''
			},
			// 左边图标[back, more, close]
			leftIcon: {
				type: String,
				default: ''
			},
			//右边图标[back, more, close]
			rightIcon: {
				type: String,
				default: ''
			},
			// 是否固定顶部
			fixed: {
				type: Boolean,
				default: false,
			},
			// 是否包含状态栏
			statusBar: {
				type: Boolean,
				default: true,
			},
			// 文字和图标颜色
			color: {
				type: String,
				default: ''
			},
			// 背景颜色
			backgroundColor: {
				type: String,
				default: ''
			}
		},
		data() {
			return {};
		},
		methods: {
			leftClick() {
				this.$emit("leftClick");
			},
			rightClick() {
				this.$emit("rightClick");
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-bar {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		width: 100%;
		min-height: 88rpx;
		padding: 0 20rpx;
		background: $uni-bg-color;
		font-size: 30rpx;

		&.fixed {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99;
		}

		&.status-bar {
			padding-top: var(--status-bar-height);
		}

		.left,
		.right,
		.center {
			display: inline-flex;
			align-items: center;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			height: 100%;
			min-height: 88rpx;
		}

		.left {
			flex: none;
			width: 120rpx;
			justify-content: flex-start;
		}

		.center {
			flex: 1;
			padding: 0 $uni-spacing-row-sm;
			justify-content: center;
		}

		.right {
			flex: none;
			width: 120rpx;
			justify-content: flex-end;
		}

		.title-text,
		.side-text {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.side-text {
			// font-size: $uni-font-size-base;
		}
	}
</style>
