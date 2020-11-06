<template>
	<text v-if="text" class="badge" :class="inverted ? 'badge-' + type + ' badge-' + size + ' badge-' + type + '-inverted' : 'badge-' + type + ' badge-' + size"
	 @tap="click">{{ text }}</text>
</template>

<script>
	export default {
		name: 'Badge',
		props: {
			text: {
				type: [String, Number],
				default: ''
			},
			type: {
				type: String,
				default: 'default'
			},
			size: {
				type: String,
				default: 'normal'
			},
			inverted: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			};
		},
		methods: {
			click() {
				this.$emit('click');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.badge {
		display: flex;
		justify-content: center;
		align-items: center;
		min-width: 40rpx;
		height: 40rpx;
		font-size: 26rpx;
		padding: 0 12rpx;
		color: $uni-text-color;
		border-radius: 100px;
		background-color: $uni-bg-color-hover;
		background-color: transparent;
	}

	.badge-inverted {
		padding: 0 5px 0 0;
		color: $uni-bg-color-hover;
	}

	.badge-default {
		color: $uni-text-color;
		background-color: $uni-bg-color-hover;
	}

	.badge-default-inverted {
		color: $uni-text-color-grey;
		background-color: transparent;
	}

	.badge-primary {
		color: $uni-text-color-inverse;
		background-color: $uni-color-primary;
	}

	.badge-primary-inverted {
		color: $uni-color-primary;
		background-color: transparent;
	}

	.badge-success {
		color: $uni-text-color-inverse;
		background-color: $uni-color-success;
	}

	.badge-success-inverted {
		color: $uni-color-success;
		background-color: transparent;
	}

	.badge-warning {
		color: $uni-text-color-inverse;
		background-color: $uni-color-warning;
	}

	.badge-warning-inverted {
		color: $uni-color-warning;
		background-color: transparent;
	}

	.badge-error {
		color: $uni-text-color-inverse;
		background-color: $uni-color-error;
	}

	.badge-error-inverted {
		color: $uni-color-error;
		background-color: transparent;
	}

	.badge-small {
		transform: scale(0.8);
		transform-origin: center center;
	}
</style>
