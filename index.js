const express = require('express')
const redis = require('redis')
const serveStatic = require('serve-static')

const	app = express()
const	port = 3000
const	ip = '127.0.0.1'

const	cacheKey = 'randomNumKey'
const	client = redis.createClient()
app.listen(port, ip)
app.use(serveStatic('.', { index: ['index.html', 'index.htm'] }))

client.on('error', (err) => {
	console.log('Error', err)
})

function setRandomNum(formtype, callback) {
	const randomNumF = Math.random() * 1000000
	const randomNum = randomNumF.toFixed(0)
	client.set(cacheKey + formtype, `${randomNum}`, callback)
}

app.post('/start', (req, res) => {
	const formtype = req.headers.formtype || ''
	setRandomNum(formtype, () => {
		console.log('start')
		// console.log(req.headers)
		res.send('OK')
	})
})

app.get('/:number', (req, res) => {
	const formtype = req.headers.formtype || ''
	client.get(cacheKey + formtype, (error, num) => {
		if (error) {
			res.send(error)
		}
		const { number } = req.params

		console.log(number)

		const responContent = (Number(number) > Number(num) && 'bigger')
		|| (Number(number) < Number(num) && 'smaller') || (Number(number) === Number(num) && 'equal') || ''

		// const set = responContent === 'equal' ? () => { setRandomNum(formtype) } : () => {}
		const set = responContent === 'equal' ? () => { } : () => {}
		set()

		res.send(responContent)
	})
})
