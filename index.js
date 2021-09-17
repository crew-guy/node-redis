const { default: axios } = require('axios')
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


app.get('/posts/:id', async (req, res) => {
    const {id} = req.body
    const cachedPost = await client.get(`post-${id}`)

    if (cachedPost) {
        return res.json(JSON.parse(cachedPost))
    }
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
    const cachedRes = await client.set(`post-${id}`, JSON.stringify(response.data))
    console.log(cachedRes)
    return res.json(response.data);

})

app.listen(8080, () => {
    console.log('Listening on po%rt 8080')
})