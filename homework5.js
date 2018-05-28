const request = require('request')
const requestPromise = require('request-promise')

function sendMsg(error) {
	const sendErrorMsg = error ? () => { console.log('e', error) } : () => { console.log('网络异常') }
	sendErrorMsg()
}

let maxNumber = 1000000
let minNumber = 0

// callback方式
function callback(i, cb) {
	request.get(`http://localhost:3000/${i}`, (error, response, body) => {
		if (!error && response.statusCode === 200) {
			if (body === 'equal') { console.log(i); cb(i) } else if (body === 'bigger') {
				maxNumber = i
				let j = (maxNumber + minNumber) / 2
				const remainder = (maxNumber + minNumber) % 2
				if (remainder > 0) j = Number(j.toFixed(0)) + 1
				callback(j, cb)
			} else if (body === 'smaller') {
				minNumber = i
				let j = (i + maxNumber) / 2
				const remainder = (i + maxNumber) % 2
				if (remainder > 0) j = Number(j.toFixed(0)) + 1
				callback(j, cb)
			}
		}
	})
}

// promise方式
async function guessPromise(i) {
	const number = await requestPromise(`http://localhost:3000/${i}`).then((response) => {
		if (response === 'equal') { console.log(i); return i } else if (response === 'bigger') {
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
		return 0
	}).catch((e) => { sendMsg(e) })

	return number
}

// async/await方式
async function guessAsync(i) {
	const result = await requestPromise(`http://localhost:3000/${i}`).catch((e) => { sendMsg(e) })
	if (result === 'equal') { console.log(i); return i } else if (result === 'bigger') {
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
	return 0
}

const options = {
	method: 'POST',
	uri: 'http://localhost:3000/start',
}

async function start() {
	const result = await requestPromise(options).then((response) => {
		const flag = response === 'OK'
		return flag
	}).catch((e) => { sendMsg(e); return false })
	if (result) {
		console.log('result', result)
	}
	return result
}


async function play(cb) {
	const result = await start()
	// console.log('result', result)
	// console.log(start())
	if (result) { callback(minNumber, cb) }
}

async function palyAsync() {
	const result = await start()
	let number = 0
	if (result) {
		number = guessAsync(minNumber)
	}
	return number
}

async function palyPromise() {
	const result = await start()
	let number = 0
	if (result) {
		number = await guessPromise(minNumber)
	}
	return number
}

play((guessNumber) => {
	console.log('guessNumber', guessNumber)
})
const guessNumber = palyAsync()
console.log('guessNumber', guessNumber)
const guessNumber2 = palyPromise()
console.log('guessNumber', guessNumber2)

