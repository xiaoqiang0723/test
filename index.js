const express = require('express')
const redis = require('redis')

const	app = express()
const	port = 3000
const	ip = '127.0.0.1'

let	randomNum = 0

const	cacheKey = 'randomNumKey'
const	client = redis.createClient()
app.listen(port, ip)

client.on('error', (err) => {
	console.log('Error', err)
})

function getRandomNum(callback) {
	if (callback) {
		client.get(cacheKey, callback)
		return
	}
	const randomNumF = Math.random() * 100
	randomNum = randomNumF.toFixed(0)
	client.set(cacheKey, `${randomNum}`, redis.print)
}

app.get('/start', (req, res) => {
	getRandomNum()
	res.send('OK')
})

app.get('/:number', (req, res) => {
	getRandomNum(() => {
		const params = req ? req.params : 0
		const number = params ? params.number : 0
		console.log('number', number)
		let responContent = ''
		if (number > randomNum) {
			responContent = 'bigger'
		} else if (number < randomNum) {
			responContent = 'smaller'
		} else if (number === randomNum) {
			responContent = 'equal'
			getRandomNum()
		}
		res.send(responContent)
	})
})
