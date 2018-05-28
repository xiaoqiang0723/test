const request = require('request')
const requestPromise = require('request-promise')

function sendMsg(error) {
	const sendErrorMsg = error ? () => { console.log('e', error) } : () => { console.log('网络异常') }
	sendErrorMsg()
}


// callback方式
function callback(maxNumber, minNumber, cb) {
	const i = Math.floor((maxNumber + minNumber) / 2)

	const options = {}
	options.uri = `http://localhost:3000/${i}`
	options.headers = { formtype: 'callback' }

	request.get(options, (error, response, body) => {
		if (!error && response.statusCode === 200) {
			if (body === 'equal') {
				console.log(i)
				cb(i)
			} else if (body === 'bigger') {
				const maxNum = i
				callback(maxNum, minNumber, cb)
			} else if (body === 'smaller') {
				const minNum = i
				callback(maxNumber, minNum, cb)
			}
		}
	})
}

// promise方式
function guessPromise(maxNumber, minNumber) {
	const i = Math.floor((maxNumber + minNumber) / 2)

	const options = {}
	options.uri = `http://localhost:3000/${i}`
	options.headers = { formtype: 'promise' }

	let number = 0

	return requestPromise(options).then((response) => {
		if (response === 'equal') {
			console.log(i)
			number = i
			return i
		} else if (response === 'bigger') {
			const maxNum = i
			return guessPromise(maxNum, minNumber)
		} else if (response === 'smaller') {
			const minNum = i
			return guessPromise(maxNumber, minNum)
		}
		return number
	}).catch((e) => { sendMsg(e) })
}

// async/await方式
async function guessAsync(maxNumber, minNumber) {
	const i = Math.floor((maxNumber + minNumber) / 2)

	const options = {}
	options.uri = `http://localhost:3000/${i}`
	options.headers = { formtype: 'async' }

	const result = await requestPromise(options).catch((e) => { sendMsg(e) })
	// console.log('result', result)
	let number = 0
	if (result === 'equal') {
		console.log(i)
		number = i
	} else if (result === 'bigger') {
		const maxNum = i
		number = await guessAsync(maxNum, minNumber)
	} else if (result === 'smaller') {
		const minNum = i
		number = await guessAsync(maxNumber, minNum)
	}
	return number
}

const options = {
	method: 'POST',
	uri: 'http://localhost:3000/start',
	headers: {},
}

async function start(headers) {
	options.headers = headers
	const result = await requestPromise(options).then((response) => {
		console.log('response', response)
		const flag = response === 'OK'
		return flag
	}).catch((e) => { sendMsg(e); return false })
	if (result) {
		console.log('result', result)
	}
	return result
}


async function play(cb) {
	const maxNumber = 1000000
	const minNumber = 0
	const headers = {}
	headers.formtype = 'callback'
	const result = await start(headers)
	// console.log('result', result)
	if (result) { callback(maxNumber, minNumber, cb) }
}

async function palyAsync() {
	const maxNumber = 1000000
	const minNumber = 0
	const headers = {}
	headers.formtype = 'async'
	const result = await start(headers)
	if (result) {
		guessAsync(maxNumber, minNumber).then((number) => {
			console.log('guessNumber by async', number)
		})
	}
}

async function palyPromise() {
	const maxNumber = 1000000
	const minNumber = 0
	const headers = {}
	headers.formtype = 'promise'
	const result = await start(headers)
	if (result) {
		guessPromise(maxNumber, minNumber).then((res) => {
			console.log('guessNumber by promise', res)
		})
	}
}

play((guessNumber) => {
	console.log('guessNumber by callback', guessNumber)
})

palyAsync()

palyPromise()

