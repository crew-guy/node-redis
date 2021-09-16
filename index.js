const express = require('express')
const redis = require('redis')

const app = express()

const redisUrl = "redis://127.0.0.1:6379"
const client = redis.createClient(redisUrl)

app.use(express.json())

app.listen(8080, () => {
    console.log('Listening on po%rt 8080')
})