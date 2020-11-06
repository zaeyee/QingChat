import Vue from 'vue'
import App from './App'
import store from './store'
import request from './common/js/request.js'
import socket from './common/js/socket'

Vue.config.productionTip = false
Vue.prototype.$store = store

uni.$request = request
uni.$socket = socket

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
