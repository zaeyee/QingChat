export default {
	// 登录token
	token: '',
	// 登录ID
	loginId: '',
	// 聊天会话
	sessions: [],
	// 好友分组
	friendGroupings: [],
	// 群聊分组
	groupGroupings: [{
		name: "置顶群聊",
		groups: []
	}, {
		name: "我创建的群聊",
		groups: []
	}, {
		name: "我管理的群聊",
		groups: []
	}, {
		name: "我加入的群聊",
		groups: []
	}],
	// 好友申请
	applies: [],
	// 用户信息，以ID为键名，缓存已加载的用户信息
	userProfiles: {},
	// 好友设置，以ID为键名
	friendConfigs: {},
	// 消息，以对方ID为键名
	messages: {},
	// 默认分组_id
	defaultGroupingId: ''
}
