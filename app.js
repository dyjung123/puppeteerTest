const express = require('express')
var cors = require('cors')
const app = express()
const port = 3003

const {crawlingRouter} = require('./routes/crawling')

app.use(express.json())
// 호스팅하면 origin을 해당 url로 수정 필수.
app.use(cors())

app.use(express.static('public')) // 기본 호스팅 경로.
app.use('/crawling',crawlingRouter)

app.listen(port, ()=>{
    console.log("Server "+port+"is start....")
})
