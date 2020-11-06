<template>
	<view id="add">
		<NavBar title="添加" leftIcon="back" @leftClick="gotoBack" />
		<Search placeholder="倾遇号/群号" @click="gotoSearch" />
		<ListItem title="扫一扫添加好友" icon="scan-code" />
	</view>
</template>

<script>
	import NavBar from '@/components/NavBar/NavBar.vue'
	import Search from '@/components/Search/Search.vue'
	import ListItem from '@/components/List/ListItem.vue'

	export default {
		components: {
			NavBar,
			Search,
			ListItem
		},
		data() {
			return {

			};
		},
		methods: {
			// 返回上一页
			gotoBack() {
				uni.navigateBack()
			},
			// 去搜索页
			gotoSearch() {
				uni.navigateTo({
					url: '../search/search?type=2&placeholder=倾遇号/群号',
					animationType: 'fade-in'
				})
			},
		}
	}
</script>

<style lang="scss">
</style>
