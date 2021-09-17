const express = require('express')
const redis = require('redis')
const util = require('util')

const app = express()
app.use(express.json())

const redisUrl = "redis://127.0.0.1:6379"
const client = redis.createClient(redisUrl)
client.set = util.promisify(client.set)
client.get = util.promisify(client.get)

app.post('/', async (req, res) => {
    console.log(req.body)
    const { key, value } = req.body
    const response = await client.set(key, value);
    res.json(response)
})

app.get('/', async (req, res) => {
    const {key} = req.body
    const response = await client.get(key)
    res.json(response)
})

app.listen(8080, () => {
    console.log('Listening on po%rt 8080')
})