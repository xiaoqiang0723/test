const express = require('express')
const redis = require('redis')
const serveStatic = require('serve-static')

const	app = express()
const	port = 3000
const	ip = '127.0.0.1'

let	randomNum = 0

const	cacheKey = 'randomNumKey'
const	client = redis.createClient()
app.listen(port, ip)
app.use(serveStatic('.', { index: ['index.html', 'index.htm'] }))

client.on('error', (err) => {
	console.log('Error', err)
})

function setRandomNum() {
	const randomNumF = Math.random() * 100
	randomNum = randomNumF.toFixed(0)
	client.set(cacheKey, `${randomNum}`, redis.print)
}

app.post('/start', (req, res) => {
	setRandomNum()
	console.log(randomNum)
	res.send('OK')
})

app.get('/:number', (req, res) => {
	client.get(cacheKey, () => {
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
			setRandomNum()
		}
		res.send(responContent)
	})
})
