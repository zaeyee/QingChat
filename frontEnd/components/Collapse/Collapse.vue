<template>
	<view>
		<slot />
	</view>
</template>

<script>
	export default {
		name: 'Collapse',
		props: {
			accordion: {
				// 是否开启手风琴效果
				type: Boolean,
				default: false
			},
			listenHeight: {
				// 是否监听内容高度变化
				type: Boolean,
				default: false
			},
			closeAll: {
				// 是否关闭全部
				type: Boolean,
				default: false
			}
		},
		data() {
			return {}
		},
		provide() {
			return {
				collapse: this
			}
		},
		created() {
			this.childrens = []
		},
		watch: {
			closeAll(val) {
				val && this.childrens.forEach(item => {
					item.close()
				})
			}
		},
		methods: {
			onChange(height) {
				let activeArr = []
				this.childrens.forEach((item, index) => {
					if (item.isOpen) {
						if (this.listenHeight) {
							activeArr.push({
								name: item.nameSync, //展开状态的CollapseItem的name值
								contentHeight: item.contentHeight //展开状态的CollapseItem的内容高度
							})
						} else {
							activeArr.push(item.nameSync)
						}
					}
				})
				this.$emit('change', activeArr)
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
