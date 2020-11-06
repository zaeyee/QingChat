import permision from "@/js_sdk/wa-permission/permission.js"

// #ifdef APP-PLUS
const isIos = (plus.os.name == "iOS")
// #endif

export default {
	async verifyRecordPermission() {
		if (isIos) {
			return new Promise((resolve) => {
				resolve(permision.judgeIosPermission('record'))
			})
		}
		return await permision.requestAndroidPermission('android.permission.RECORD_AUDIO') === 1
	}
}
