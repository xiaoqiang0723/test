const request = require('request')
const requestPromise = require('request-promise')

function sendMsg(error) {
	const sendErrorMsg = error ? () => { console.log('e', error) } : () => { console.log('网络异常') }
	sendErrorMsg()
}


// callback方式
function callback(i, maxNumber, minNumber, cb) {
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
				let j = (maxNum + minNumber) / 2
				const remainder = (maxNum + minNumber) % 2
				if (remainder > 0) j = Math.floor(j) + 1
				callback(j, maxNum, minNumber, cb)
			} else if (body === 'smaller') {
				const minNum = i
				let j = (i + maxNumber) / 2
				const remainder = (i + maxNumber) % 2
				if (remainder > 0) j = Math.floor(j) + 1
				callback(j, maxNumber, minNum, cb)
			}
		}
	})
}

// promise方式
function guessPromise(i, maxNumber, minNumber, cb) {
	const options = {}
	options.uri = `http://localhost:3000/${i}`
	options.headers = { formtype: 'promise' }

	requestPromise(options).then((response) => {
		if (response === 'equal') {
			console.log(i)
			cb(i)
		} else if (response === 'bigger') {
			const maxNum = i
			let j = (maxNum + minNumber) / 2
			const remainder = (maxNum + minNumber) % 2
			if (remainder > 0) j = Math.floor(j) + 1
			guessPromise(j, maxNum, minNumber, cb)
		} else if (response === 'smaller') {
			const minNum = i
			let j = (i + maxNumber) / 2
			const remainder = (i + maxNumber) % 2
			if (remainder > 0) j = Math.floor(j) + 1
			guessPromise(j, maxNumber, minNum, cb)
		}
	}).catch((e) => { sendMsg(e) })
}

// async/await方式
async function guessAsync(i, maxNumber, minNumber) {
	const options = {}
	options.uri = `http://localhost:3000/${i}`
	options.headers = { formtype: 'async' }

	const result = await requestPromise(options).catch((e) => { sendMsg(e) })
	// console.log('result', result)
	let number = 0
	if (result === 'equal') {
		console.log(i)
		// console.log('1111111')
		number = i
	} else if (result === 'bigger') {
		const maxNum = i
		let j = (maxNum + minNumber) / 2
		const remainder = (maxNum + minNumber) % 2
		if (remainder > 0) j = Math.floor(j) + 1
		number = await guessAsync(j, maxNum, minNumber)
	} else if (result === 'smaller') {
		const minNum = i
		let j = (i + maxNumber) / 2
		const remainder = (i + maxNumber) % 2
		if (remainder > 0) j = Math.floor(j) + 1
		number = await guessAsync(j, maxNumber, minNum)
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
	// console.log(start())
	if (result) { callback(0, maxNumber, minNumber, cb) }
}

async function palyAsync() {
	const maxNumber = 1000000
	const minNumber = 0
	const headers = {}
	headers.formtype = 'async'
	const result = await start(headers)
	let number = 0
	if (result) {
		number = await guessAsync(0, maxNumber, minNumber)
		console.log('guessNumber by async', number)
	}
}

async function palyPromise(cb) {
	const maxNumber = 1000000
	const minNumber = 0
	const headers = {}
	headers.formtype = 'promise'
	const result = await start(headers)
	if (result) {
		guessPromise(0, maxNumber, minNumber, cb)
	}
}

play((guessNumber) => {
	console.log('guessNumber by callback', guessNumber)
})
const guessNumber = palyAsync()
console.log('guessNumber by async', guessNumber)
palyPromise((i) => {
	console.log('guessNumber by promise', i)
})

