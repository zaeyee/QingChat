const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./db/connect')
const bodyParser = require('body-parser')

//解析表单数据  x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
//解析json数据
app.use(bodyParser.json())
// cors解决跨域
app.use(cors())

// 引入路由
require('./router')(app)

// 开启普通网络接口服务
app.listen(3000, () => {
  console.log(`Success! Server running at http://localhost:3000`)
})

// 开启一个socket服务
const server = app.listen(3030)
const io = require('./socket')(server)
