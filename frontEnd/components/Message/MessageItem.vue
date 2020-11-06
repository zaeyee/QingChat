<template>
	<view class="message-item" :class="{reverse}">
		<image :src="messageItem.avatar" class="avatar" />
		<text v-if="messageItem.type===0" class="content content-text">{{messageItem.content}}</text>
		<image v-else-if="messageItem.type===1" :src="messageItem.content" class="content content-image" mode="widthFix"
		 :lazy-load="true" @tap="imageClick(messageItem.content)"></image>
		<video v-else-if="messageItem.type===2" :src="messageItem.content" class="content content-image" controls></video>
		<view v-if="messageItem.type===3" class="content content-voice" :class="{playing}" :style="voiceStyle" @tap="voiceClick">
			<text>{{messageItem.content.duration}}″</text>
			<image src="/static/images/chat/wave.svg" mode="aspectFill"></image>
		</view>
		<view v-if="messageItem.type===4" class="content content-location" @tap="locationClick">
			<view class="location-name">{{messageItem.content.name}}</view>
			<view class="location-address">{{messageItem.content.address}}</view>
			<map class="location-map" :latitude="messageItem.content.latitude" :longitude="messageItem.content.longitude"
			 :markers="covers"></map>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'MessageItem',
		props: {
			messageItem: {
				type: Object,
				default () {
					return {}
				}
			},
			reverse: {
				type: Boolean,
				default: false
			},
			playing: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			voiceStyle() {
				return {
					width: 120 + 160 * (this.messageItem.content.duration / 60) + 'rpx'
				}
			}
		},
		data() {
			return {
				covers: [{
					latitude: this.messageItem.content.latitude,
					longitude: this.messageItem.content.longitude,
					iconPath: '/static/images/chat/map.svg'
				}]
			};
		},
		methods: {
			// 图片点击
			imageClick(current) {
				this.$emit('imageClick', current)
			},
			// 音频点击
			voiceClick() {
				console.log('音频点击' + this.messageItem.content.voice)
				this.$emit('voiceClick', this.messageItem.content.voice)
			},
			// 位置点击
			locationClick() {
				let location = this.messageItem.content
				this.$emit('locationClick', this.messageItem.content)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.message-item {
		display: flex;
		flex-direction: row;
		margin: $uni-spacing-col-sm $uni-spacing-row-base;

		.avatar {
			flex: none;
			width: 64rpx;
			height: 64rpx;
			border-radius: $uni-border-radius-sm;
		}

		.content {
			max-width: 76%;
			margin: 0 $uni-spacing-row-sm;
			font-size: $uni-font-size-base;
			background: $uni-bg-color-white;
			border-radius: 4px 20px 20px 20px;

			&.content-text {
				padding: 14rpx 22rpx;
				word-wrap: break-word;
			}

			&.content-image {
				max-width: 50%;
				padding: 0;
				border: 1px solid #eee;
				background: transparent;
			}

			&.content-voice {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				flex-direction: row-reverse;
				max-width: 280rpx;
				min-width: 120rpx;
				padding: 14rpx 22rpx;

				&.playing::after {
					content: "";
					position: absolute;
					right: 22rpx;
					bottom: 14rpx;
					width: 10rpx;
					height: 10rpx;
					background: $uni-color-success;
					border-radius: $uni-border-radius-circle;
					transform: scale(1);
				}

				image {
					flex: none;
					width: 26rpx;
					height: 26rpx;
					margin-right: $uni-spacing-row-sm;
				}
			}

			&.content-location {
				width: 480rpx;

				.location-name {
					font-size: $uni-font-size-lg;
					line-height: 48rpx;
					padding: 10rpx 16rpx 0;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.location-address {
					color: $uni-text-color-grey;
					font-size: $uni-font-size-sm;
					padding: 0 16rpx 10rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.location-map {
					width: 480rpx;
					height: 240rpx;
				}
			}
		}

		&.reverse {
			flex-direction: row-reverse;

			.content {
				border-radius: 20px 4px 20px 20px;
				background: $uni-color-primary;

				&.content-image {
					background: transparent;
				}

				&.content-voice {
					flex-direction: row;

					image {
						margin-left: $uni-spacing-row-sm;
						margin-right: 0;
					}

					&.playing::after {
						left: 22rpx;
						right: auto;
					}
				}

				&.content-location {
					background: $uni-bg-color-white;
				}
			}
		}
	}
</style>
