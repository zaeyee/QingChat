<template>
	<view class="emoji">
		<view class="emoji-item" v-for="item in emojis" :key="item" @tap="click(item)">{{item}}</view>
	</view>
</template>

<script>
	export default {
		name: 'ChatEmoji',
		data() {
			return {
				emojis: ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "😗", "😙", "😚", "🙂",
					"🤗", "🤔", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜",
					"😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧",
					"😨", "😩", "😬", "😰", "😱", "😳", "😵", "😡", "😠", "😷", "🤒", "🤕", "🤢", "🤧", "😇", "🤠", "🤡", "🤥", "🤓",
					"😈", "👿", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🏻",
					"🏼", "🏽", "🏾", "🏿", "🗣", "👤", "👥", "👫", "👬", "👭", "👂", "👂🏻", "👂🏼", "👂🏽", "👂🏾", "👂🏿", "👃",
					"👃🏻", "👃🏼", "👃🏽", "👃🏾", "👃🏿", "👣", "👀", "👁", "👅", "👄", "💋", "👓", "🕶", "👔", "👕", "👖", "👗",
					"👘", "👙", "👚", "👛", "👜", "👝", "🎒", "👞", "👟", "👠", "👡", "👢", "👑", "👒", "🎩", "🎓", "⛑", "💄", "💍",
					"🌂", "💼"
				],
			}
		},
		methods: {
			click(emoji) {
				this.$emit('click', emoji)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.emoji {
		display: flex;
		flex-wrap: wrap;
		overflow-y: auto;
		padding: 12rpx;

		.emoji-item {
			flex-basis: 12.5%;
			font-size: 40rpx;
			padding: 12rpx;
			text-align: center;
		}
	}
</style>
