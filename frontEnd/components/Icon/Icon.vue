<template>
	<text :class="'iconfont icon-'+type" :style="iconStyle" @tap="click"></text>
</template>

<script>
	export default {
		name: 'Icon',
		props: {
			type: {
				type: String,
				default: ''
			},
			color: {
				type: String,
				default: '#333'
			},
			size: {
				type: [Number, String],
				default: 44
			}
		},
		data() {
			return {}
		},
		computed: {
			iconStyle() {
				let size = this.size
				if (!isNaN(size)) {
					size += 'rpx'
				}
				return {
					lineHeight: '100%',
					fontSize: size,
					color: this.color
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

<style>
	@import url("./iconfont.css");
</style>
