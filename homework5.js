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
				cb(error, i)
			} else if (body === 'bigger') {
				callback(i, minNumber, cb)
			} else if (body === 'smaller') {
				callback(maxNumber, i, cb)
			}
		} else {
			cb(error, i)
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
			number = i
			return i
		} else if (response === 'bigger') {
			return guessPromise(i, minNumber)
		} else if (response === 'smaller') {
			return guessPromise(maxNumber, i)
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
	let number = 0
	if (result === 'equal') {
		number = i
	} else if (result === 'bigger') {
		number = await guessAsync(i, minNumber)
	} else if (result === 'smaller') {
		number = await guessAsync(maxNumber, i)
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
	if (result) { callback(maxNumber, minNumber, cb) }
}

async function palyAsync(cb) {
	const maxNumber = 1000000
	const minNumber = 0
	const headers = {}
	headers.formtype = 'async'
	const result = await start(headers)
	if (result) {
		guessAsync(maxNumber, minNumber).then((number) => {
			cb(null, number)
		}).catch((err) => {
			console.log('err', err)
			cb(err, null)
		})
	}
}

async function palyPromise(cb) {
	const maxNumber = 1000000
	const minNumber = 0
	const headers = {}
	headers.formtype = 'promise'
	const result = await start(headers)
	if (result) {
		guessPromise(maxNumber, minNumber).then((res) => {
			cb(null, res)
		}).catch((err) => {
			console.log('err', err)
			cb(err, null)
		})
	}
}

play((err, guessNumber) => {
	if (!err) {
		console.log('guessNumber by callback', guessNumber)
	} else {
		console.log('err', err)
	}
})

palyAsync((err, number) => {
	if (!err) {
		console.log('guessNumber by async', number)
	} else {
		console.log('err', err)
	}
})

palyPromise((err, res) => {
	if (!err) {
		console.log('guessNumber by promise', res)
	} else {
		console.log('err', err)
	}
})

