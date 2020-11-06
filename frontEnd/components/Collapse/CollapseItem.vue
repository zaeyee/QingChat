<template>
	<view class="collapse-item" :class="{active:isOpen,disabled}">
		<view class="title" :class="{'left-arrow':leftArrow}" @tap="onClick">
			<view>{{title}}</view>
			<view class="right">
				<slot name="right">{{rightText}}</slot>
			</view>
		</view>
		<view v-show="isOpen" class="content">
			<slot />
		</view>
	</view>
</template>

<script>
	export default {
		name: 'CollapseItem',
		props: {
			open: {
				type: Boolean,
				default: false
			},
			disabled: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: ''
			},
			rightText: {
				type: [String, Number],
				default: ''
			},
			leftArrow: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				isOpen: false,
				contentHeight: 0
			};
		},
		watch: {
			open(val) {
				this.isOpen = val
			}
		},
		inject: ['collapse'],
		created() {
			this.isOpen = this.open
			this.nameSync = this.name ? this.name : this.collapse.childrens.length
			this.collapse.childrens.push(this)
			if (this.collapse.accordion && this.isOpen) {
				let lastEl = this.collapse.childrens[this.collapse.childrens.length - 2]
				if (lastEl) {
					this.collapse.childrens[this.collapse.childrens.length - 2].isOpen = false
				}
			}
		},
		methods: {
			close() {
				this.isOpen = false
				this.collapse.onChange && this.collapse.onChange()
			},
			onClick() {
				if (this.disabled) {
					return
				}
				if (this.collapse.accordion) {
					this.collapse.childrens.forEach(item => {
						if (item === this) {
							return
						}
						item.isOpen = false
					})
				}
				this.isOpen = !this.isOpen
				if (this.collapse.listenHeight) {
					this.$nextTick(() => {
						// 更新展开状态后获取内容高度
						const query = uni.createSelectorQuery().in(this)
						query.select('.content').boundingClientRect(result => {
							this.contentHeight = result.height
							this.collapse.onChange && this.collapse.onChange()
							// this.$forceUpdate()
						}).exec()
					})
				} else {
					this.collapse.onChange && this.collapse.onChange()
					// this.$forceUpdate()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.collapse-item {
		margin: 12rpx;
		background: $uni-bg-color-white;
		border-radius: $uni-border-radius-sm;
		overflow: hidden;

		&:first-child {
			margin-top: 0;
		}

		&:last-child {
			margin-bottom: 0;
		}

		.title {
			position: relative;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 24rpx;
			transition: all 0.3s;

			&:active {
				background: $uni-bg-color-active;
			}

			&.left-arrow {
				padding-left: 48rpx;

				&::before {
					content: "";
					position: absolute;
					top: 30rpx;
					left: 24rpx;
					border: 10rpx solid;
					border-color: transparent transparent transparent #bbb;
					transform-origin: 25% 50%;
					transition: all 0.3s;
				}
			}

			.right {
				color: $uni-text-color-grey;
				font-size: $uni-font-size-sm;
			}
		}

		&.active {
			.title.left-arrow::before {
				transform: rotateZ(90deg);
			}
		}

		&.disabled {
			.title:active {
				background: $uni-bg-color-white;
			}
		}
	}
</style>
