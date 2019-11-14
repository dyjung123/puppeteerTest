const express = require('express')
const bodyparser = require('body-parser')
const crawlingRouter = express.Router()

const crawlingApi = require('../api/crawling')

crawlingRouter.use(bodyparser.urlencoded({ extended: true }))

crawlingRouter.use((req, res, next) => {
    console.log('Time : ',Date.now())
    next()
})

crawlingRouter.post('/getstock',crawlingApi.getStock)

module.exports = {
  crawlingRouter
}