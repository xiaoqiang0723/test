const request = require('request')
const requestPromise = require('request-promise')
const util = require('util')

// callback方式
function callback(maxNumber, minNumber, cb) {
	const i = Math.floor((maxNumber + minNumber) / 2)

	// const options = {}
	// options.uri = `http://localhost:3000/${i}`
	// options.headers = { formtype: 'callback' }

	request.get(`http://localhost:3000/${i}`, (error, response, body) => {
		if (error) {
			cb(error)
		}
		if (response.statusCode !== 200) {
			cb(new Error('网络异常，请稍后再试'))
		}
		if (!error && response.statusCode === 200) {
			if (body === 'equal') {
				cb(error, i)
			} else if (body === 'bigger') {
				callback(i, minNumber, cb)
			} else if (body === 'smaller') {
				callback(maxNumber, i, cb)
			}
		}
	})
}

// promise方式
function guessPromise(maxNumber, minNumber) {
	const i = Math.floor((maxNumber + minNumber) / 2)

	// const options = {}
	// options.uri = `http://localhost:3000/${i}`
	// options.headers = { formtype: 'promise' }

	return requestPromise(`http://localhost:3000/${i}`).then((response) => {
		if (response === 'equal') {
			return i
		} else if (response === 'bigger') {
			return guessPromise(i, minNumber)
		} else if (response === 'smaller') {
			return guessPromise(maxNumber, i)
		}
		return 0
	})
}

// async/await方式
async function guessAsync(maxNumber, minNumber) {
	const i = Math.floor((maxNumber + minNumber) / 2)

	// const options = {}
	// options.uri = `http://localhost:3000/${i}`
	// options.headers = { formtype: 'async' }

	const result = await requestPromise(`http://localhost:3000/${i}`)
	if (result === 'equal') {
		return i
	} else if (result === 'bigger') {
		return guessAsync(i, minNumber)
	} else if (result === 'smaller') {
		return guessAsync(maxNumber, i)
	}
	return 0
}

const options = {
	method: 'POST',
	uri: 'http://localhost:3000/start',
}

async function start(headers) {
	if (headers) {
		options.headers = headers
	}

	const result = await requestPromise(options).then((response) => {
		console.log('response', response)
		const flag = response === 'OK'
		return flag
	})
	if (result) {
		console.log('result', result)
	}
	return result
}

// async function play() {
// 	const maxNumber = 1000000
// 	const minNumber = 0
// 	try {
// 		const result = await start()
// 		if (result) {
// 			callback(maxNumber, minNumber, (err, guessNumber) => {
// 				if (!err) {
// 					console.log('guessNumber by callback', guessNumber)

// 					guessAsync(maxNumber, minNumber).then((res) => {
// 						console.log('guessNumber by async', res)
// 						guessPromise(maxNumber, minNumber).then((ress) => {
// 							console.log('guessNumber by promise', ress)
// 						})
// 					})
// 				} else {
// 					throw err
// 				}
// 			})
// 		}
// 	} catch (e) {
// 		console.log('err', e)
// 	}
// }

async function play() {
	const maxNumber = 1000000
	const minNumber = 0
	try {
		const result = await start()
		if (result) {
			const res1 = await guessAsync(maxNumber, minNumber)
			console.log('guessNumber by async', res1)

			const res2 = await guessPromise(maxNumber, minNumber)
			console.log('guessNumber by promise', res2)

			const promiseCallback = util.promisify(callback)

			const res3 = await promiseCallback(maxNumber, minNumber)
			console.log('guessNumber by callback', res3)
		}
	} catch (e) {
		console.log('err', e)
	}
}

play()


// async function play(cb) {
// 	const maxNumber = 1000000
// 	const minNumber = 0
// 	const headers = {}
// 	headers.formtype = 'callback'
// 	const result = await start(headers).catch(err => cb(err))
// 	if (result) { callback(maxNumber, minNumber, cb) }
// }

// async function palyAsync() {
// 	const maxNumber = 1000000
// 	const minNumber = 0
// 	const headers = {}
// 	headers.formtype = 'async'
// 	const result = await start(headers)
// 	if (result) {
// 		return guessAsync(maxNumber, minNumber)
// 	}
// 	return 0
// }

// async function palyPromise() {
// 	const maxNumber = 1000000
// 	const minNumber = 0
// 	const headers = {}
// 	headers.formtype = 'promise'
// 	const result = await start(headers)
// 	if (result) {
// 		return guessPromise(maxNumber, minNumber)
// 	}
// 	return 0
// }

// play((err, guessNumber) => {
// 	if (!err) {
// 		console.log('guessNumber by callback', guessNumber)
// 	} else {
// 		console.log('err', err)
// 	}
// })

// palyAsync().then((res) => {
// 	console.log('guessNumber by async', res)
// }).catch((err) => {
// 	console.log('err', err)
// })

// palyPromise().then((res) => {
// 	console.log('guessNumber by promise', res)
// }).catch((err) => {
// 	console.log('err', err)
// })

