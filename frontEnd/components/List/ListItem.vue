<template>
	<view class="list-item" :class="[size,{arrow:showArrow}]" :style="itemStyle" @tap="click">
		<slot name="left">
			<view class="left" v-if="icon">
				<image v-if="isIconSrc" class="icon-image" :src="icon"></image>
				<Icon v-else :type="icon" :size="size==='sm'?36:44" />
			</view>
		</slot>
		<slot name="main">
			<view class="main">
				<text class="title">{{title}}</text>
				<text v-if="describe" class="describe">{{describe}}</text>
			</view>
		</slot>
		<slot name="right">
			<view class="right">
				<Badge v-if="showBadge" :text="badgeText" :type="badgeType" size="small" />
			</view>
		</slot>
	</view>
</template>

<script>
	import Icon from '../Icon/Icon.vue'
	import Badge from '../Badge/Badge.vue'

	export default {
		name: 'ListItem',
		components: {
			Icon,
			Badge
		},
		props: {
			icon: {
				type: String,
				default: ''
			},
			title: {
				type: [String, Number],
				default: ''
			},
			describe: {
				type: [String, Number],
				default: ''
			},
			size: {
				type: String,
				default: ''
			},
			colSpacing: {
				type: [String, Number],
				default: '12rpx'
			},
			rowSpacing: {
				type: [String, Number],
				default: '12rpx'
			},
			showArrow: {
				type: Boolean,
				default: true
			},
			showBadge: {
				type: Boolean,
				default: false
			},
			badgeText: {
				type: [String, Number],
				default: ''
			},
			badgeType: {
				type: [String, Number],
				default: 'error'
			}
		},
		data() {
			return {

			};
		},
		computed: {
			// 图标是路径
			isIconSrc() {
				return this.icon.indexOf('/') > -1
			},
			// 样式
			itemStyle() {
				let colSpacing = this.colSpacing
				let rowSpacing = this.rowSpacing
				if (!isNaN(colSpacing)) {
					colSpacing += 'rpx'
				}
				if (!isNaN(rowSpacing)) {
					rowSpacing += 'rpx'
				}
				return {
					marginTop: colSpacing,
					marginRight: rowSpacing,
					marginBottom: colSpacing,
					marginLeft: rowSpacing
				}
			}
		},
		methods: {
			// 点击事件
			click() {
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-item {
		position: relative;
		display: flex;
		align-items: center;
		padding: 16rpx 20rpx;
		min-height: 84rpx;
		background: $uni-bg-color-white;
		border-radius: $uni-border-radius-sm;
		transition: all 0.3s;

		&:first-of-type {
			margin-top: 0;
		}

		&:last-child {
			margin-bottom: 0;
		}

		&:active {
			background: $uni-bg-color-active;
		}

		&.arrow {
			padding-right: 40rpx;

			&::before,
			&::after {
				content: "";
				position: absolute;
				top: 50%;
				right: 20rpx;
				width: 2rpx;
				height: 16rpx;
				background: #ddd;
				transform-origin: top;
			}

			&::before {
				transform: rotateZ(135deg);
			}

			&::after {
				transform: rotateZ(45deg);
			}
		}

		.left {
			margin-right: $uni-spacing-row-sm;

			.icon-image {
				flex: none;
				width: 68rpx;
				height: 68rpx;
				vertical-align: middle;
				border-radius: $uni-border-radius-sm;
			}
		}

		.main {
			flex: auto;
			display: flex;
			flex-direction: column;
			justify-content: center;

			.title,
			.describe {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
				word-break: break-all;
				line-height: 40rpx;
			}

			.title {
				font-weight: 400;
				color: $uni-text-color;
				font-size: $uni-font-size-base;
			}

			.describe {
				color: $uni-text-color-grey;
				font-size: $uni-font-size-sm;
			}
		}

		&.sm {
			padding: 12rpx 16rpx;

			.icon.image {
				width: 68rpx;
				height: 68rpx;
			}

			.main {

				.title,
				.describe {
					line-height: 34rpx;
				}
			}
		}


		.right {
			flex: none;
			margin-left: 8rpx;
		}
	}
</style>
