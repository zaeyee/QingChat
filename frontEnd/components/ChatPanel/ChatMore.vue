<template>
	<view class="more">
		<view class="more-item" @tap="submitImages('album')">
			<view class="icon">
				<image src="/static/images/chat/picture.svg"></image>
			</view>
			<text class="text">图片</text>
		</view>
		<view class="more-item" @tap="submitImages('camera')">
			<view class="icon">
				<image src="/static/images/chat/camera.svg"></image>
			</view>
			<text class="text">拍摄</text>
		</view>
		<view class="more-item" @tap="chooseVideo">
			<view class="icon">
				<image src="/static/images/chat/video.svg"></image>
			</view>
			<text class="text">视频</text>
		</view>
		<view class="more-item" @tap="chooseLocation">
			<view class="icon">
				<image src="/static/images/chat/map.svg"></image>
			</view>
			<text class="text">位置</text>
		</view>
		<view class="more-item" @tap="chooseFile">
			<view class="icon">
				<image src="/static/images/chat/folder.svg"></image>
			</view>
			<text class="text">文件</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ChatMore',
		methods: {
			// 发送图片
			submitImages(sourceType) {
				uni.chooseImage({
					sizeType: ['original', 'compressed'],
					sourceType: [sourceType],
					success: (res) => {
						this.$emit('submitImages', res.tempFilePaths)
					}
				});
			},
			// 选择视频
			chooseVideo() {
				uni.chooseVideo({
					sourceType: ['camera', 'album'],
					success: (res) => {
						this.$emit('submitVideo', res.tempFilePath)
					}
				});
			},
			// 选择位置
			chooseLocation() {
				uni.chooseLocation({
					success: (res) => {
						let content = {
							name: res.name,
							address: res.address,
							latitude: res.latitude,
							longitude: res.longitude
						}
						this.$emit('submitLocation', content)
					}
				});
			},
			// 选择文件
			chooseFile() {

			}
		}
	}
</script>

<style lang="scss" scoped>
	.more {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		width: 100%;
		height: 100%;
		padding: 32rpx;

		.more-item {
			flex-basis: 25%;
			display: flex;
			flex-direction: column;
			align-items: center;

			&:active .icon {
				background: $uni-bg-color-active;
			}

			.icon {
				width: 96rpx;
				height: 96rpx;
				padding: 16rpx;
				background: $uni-bg-color-white;
				border-radius: $uni-border-radius-sm;
				transition: all 0.3s;

				image {
					width: 64rpx;
					height: 64rpx;
				}
			}

			.text {
				font-size: $uni-font-size-sm;
				margin-top: 8rpx;
			}
		}
	}
</style>
