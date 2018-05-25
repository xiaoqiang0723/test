const request = require('request')
const requestPromise = require('request-promise')

function sendMsg(error) {
	const sendErrorMsg = error ? () => { console.log('e', error) } : () => { console.log('网络异常') }
	sendErrorMsg()
}

let maxNumber = 10000
let minNumber = 0

// callback方式
function callback(i) {
	request.get(`http://localhost:3000/${i}`, (error, response, body) => {
		// console.log('error', error)
		// console.log('response', response)
		// console.log('body', body)
		if (!error && response.statusCode === 200) {
			if (body === 'equal') { console.log(i) } else if (body === 'bigger') {
				maxNumber = i
				let j = (maxNumber + minNumber) / 2
				const remainder = (maxNumber + minNumber) % 2
				if (remainder > 0) j = Number(j.toFixed(0)) + 1
				callback(j)
			} else if (body === 'smaller') {
				minNumber = i
				let j = (i + maxNumber) / 2
				const remainder = (i + maxNumber) % 2
				if (remainder > 0) j = Number(j.toFixed(0)) + 1
				callback(j)
			}
		}
	})
}

// promise方式
function guessPromise(i) {
	requestPromise(`http://localhost:3000/${i}`).then((response) => {
		if (response === 'equal') { console.log(i) } else if (response === 'bigger') {
			maxNumber = i
			let j = (maxNumber + minNumber) / 2
			const remainder = (maxNumber + minNumber) % 2
			if (remainder > 0) j = Number(j.toFixed(0)) + 1
			guessPromise(j)
		} else if (response === 'smaller') {
			minNumber = i
			let j = (i + maxNumber) / 2
			const remainder = (i + maxNumber) % 2
			if (remainder > 0) j = Number(j.toFixed(0)) + 1
			guessPromise(j)
		}
	}).catch((e) => { sendMsg(e) })
}

// async/await方式
async function guessAsync(i) {
	const result = await requestPromise(`http://localhost:3000/${i}`).then().catch((e) => { sendMsg(e) })
	if (result === 'equal') { console.log(i) } else if (result === 'bigger') {
		maxNumber = i
		let j = (maxNumber + minNumber) / 2
		const remainder = (maxNumber + minNumber) % 2
		if (remainder > 0) j = Number(j.toFixed(0)) + 1
		guessAsync(j)
	} else if (result === 'smaller') {
		minNumber = i
		let j = (i + maxNumber) / 2
		const remainder = (i + maxNumber) % 2
		if (remainder > 0) j = Number(j.toFixed(0)) + 1
		guessAsync(j)
	}
}

const options = {
	method: 'POST',
	uri: 'http://localhost:3000/start',
}

async function start() {
	const result = await requestPromise(options).then((response) => {
		// console.log('22222')
		// console.log('response', response)
		const flag = response === 'OK'
		return flag
	}).catch((e) => { sendMsg(e); return false })
	if (result) {
		console.log('result', result)
	}
	return result
}


async function play() {
	// console.log('111111111')
	const result = await start()
	// console.log('result', result)
	// console.log(start())
	if (result) { callback(minNumber) }
}

async function palyAsync() {
	const result = await start()
	if (result) {
		guessAsync(minNumber)
	}
}

async function palyPromise() {
	const result = await start()
	if (result) {
		guessPromise(minNumber)
	}
}

play()
palyAsync()
palyPromise()

