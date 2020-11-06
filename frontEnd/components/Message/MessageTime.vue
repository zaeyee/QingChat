<template>
	<view class="message-time">
		<slot />
	</view>
</template>

<script>
	export default {
		name: 'MessageTime'
	}
</script>

<style lang="scss" scoped>
	.message-time {
		text-align: center;
		color: $uni-text-color-grey;
		font-size: $uni-font-size-sm;
		margin: $uni-spacing-col-sm $uni-spacing-row-base;
	}
</style>
