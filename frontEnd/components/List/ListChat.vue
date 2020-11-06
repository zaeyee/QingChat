<template>
	<view class="list-chat" :style="itemStyle" @tap="click">
		<view class="topping" v-show="topping"></view>
		<image v-if="avatar" class="avatar" :src="avatar"></image>
		<view class="main">
			<view class="flex-between">
				<view class="title">{{title}}</view>
				<view class="time">{{time}}</view>
			</view>
			<view class="flex-between">
				<view class="describe">{{describe}}</view>
				<view v-show="tip" class="tip" :style="tipStyle" @touchstart="tipTouch" @touchmove.stop.prevent="tipMove" @touchend="tipRemove">{{tip}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ListChat',
		props: {
			topping: {
				type: Boolean,
				default: false
			},
			avatar: {
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
			time: {
				type: String,
				default: ''
			},
			tip: {
				type: [String, Number],
				default: ''
			},
			colSpacing: {
				type: [String, Number],
				default: '12rpx'
			},
			rowSpacing: {
				type: [String, Number],
				default: '12rpx'
			}
		},
		data() {
			return {
				tipPageX: 0,
				tipPageY: 0,
				tipMoveX: 0,
				tipMoveY: 0,
				tipStyle: {}
			};
		},
		computed: {
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
			},
			// tip触摸
			tipTouch(e) {
				this.tipPageX = e.changedTouches[0].pageX
				this.tipPageY = e.changedTouches[0].pageY
				this.$emit('tipTouch')
			},
			// tip移动
			tipMove(e) {
				let moveX = e.changedTouches[0].pageX - this.tipPageX
				let moveY = e.changedTouches[0].pageY - this.tipPageY
				this.tipMoveX = moveX
				this.tipMoveY = moveY
				this.tipStyle = {
					transform: 'translate(' + moveX + 'px, ' + moveY + 'px)'
				}
				this.$emit('tipMove')
			},
			// tip移除
			tipRemove() {
				if (Math.abs(this.tipMoveX) > 15 || Math.abs(this.tipMoveY) > 15) {
					this.$emit('tipRemove')
				}
				this.tipStyle = {
					transform: 'translate(0, 0)'
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-chat {
		position: relative;
		display: flex;
		padding: 20rpx;
		background: $uni-bg-color-white;
		border-radius: $uni-border-radius-sm;
		transition: all 0.3s;

		&:active {
			background: $uni-bg-color-active;
		}

		.topping {
			position: absolute;
			width: 48rpx;
			height: 48rpx;
			margin-top: -20rpx;
			margin-left: -20rpx;
			border-radius: $uni-border-radius-sm;
			overflow: hidden;
			z-index: 1;

			&::before {
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				width: 48rpx;
				height: 48rpx;
				background: $uni-color-primary;
				transform: rotateZ(45deg) translate(-75%);
				transition: all 0.3s;
			}
		}

		.avatar {
			flex: none;
			width: 80rpx;
			height: 80rpx;
			vertical-align: middle;
			background: $uni-color-primary;
			margin-right: $uni-spacing-row-sm;
			border-radius: $uni-border-radius-sm;
		}

		.main {
			flex: auto;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.flex-between {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.title {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
				font-weight: 400;
				word-break: break-all;
				color: $uni-text-color;
				font-size: $uni-font-size-lg;
			}

			.time {
				flex: none;
				line-height: 40rpx;
				margin-left: 8rpx;
				color: $uni-text-color-disable;
				font-size: $uni-font-size-sm;
			}

			.describe {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
				word-break: break-all;
				color: $uni-text-color-grey;
				font-size: $uni-font-size-sm;
			}

			.tip {
				flex: none;
				display: flex;
				justify-content: center;
				align-items: center;
				min-width: $uni-font-size-lg;
				height: $uni-font-size-lg;
				padding: 0 10rpx;
				margin-left: 8rpx;
				color: $uni-text-color-inverse;
				font-size: $uni-font-size-sm;
				background: $uni-color-error;
				border-radius: 25px;
				z-index: 2;
			}
		}
	}
</style>
