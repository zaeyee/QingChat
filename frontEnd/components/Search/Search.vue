<template>
	<view class="search">
		<view class="input" :style="inputStyle" @tap="click">
			<image class="icon" src="/static/images/common/search.svg"></image>
			<text>{{placeholder}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'Search',
		props: {
			align: {
				type: String,
				default: 'center'
			},
			placeholder: {
				type: String,
				default: '搜索'
			}
		},
		data() {
			return {}
		},
		computed: {
			inputStyle() {
				let justifyContent = 'center'
				if (this.align === 'left') {
					justifyContent = 'flex-start'
				} else if (this.align === 'right') {
					justifyContent = 'flex-end'
				}
				return {
					justifyContent
				}
			}
		},
		methods: {
			click() {
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		padding: 8rpx 20rpx;
		background: $uni-bg-color;

		.input {
			display: flex;
			justify-content: center;
			align-items: center;
			color: $uni-text-color-placeholder;
			text-align: center;
			height: 60rpx;
			line-height: 40rpx;
			padding: 8rpx 20rpx;
			background: $uni-bg-color-white;
			border-radius: 50rpx;
			cursor: text;

			.icon {
				width: 28rpx;
				height: 28rpx;
				margin-right: 8rpx;
			}
		}
	}
</style>
