const redis = require('redis')

const	client = redis.createClient()
client.on('error', (err) => {
	console.log('Error', err)
});
(() => {
	for (let i = 0; i < 10; i += 1) {
		const value = {}
		value.i = i

		client.hset('test', `${i}`, JSON.stringify(value), () => {
			console.log('保持成功')
		})

		client.sadd('test2', JSON.stringify(value), (err, number) => {
			console.log('是否成功=>', number)
		})

		client.lset('test3', i, JSON.stringify(value), (err, number) => {
			console.log('number of test3', number)
		})
	}
	for (let i = 0; i < 10; i += 1) {
		client.hget('test', `${i}`, (err, value) => {
			console.log('value', value)
			console.log('value of obj', JSON.parse(value))
		})
	}

	client.hdel('test', '9', (err, value) => {
		console.log('number', value)
	})

	client.hget('test', '9', (err, value) => {
		console.log('err', err)
		console.log('value', value)
	})

	client.SRANDMEMBER('test2', 3, (err, value) => {
		console.log('value of test2', value)
	})

	client.lrange('test3', 0, 3, (err, value) => {
		console.log('value of test3', value)
	})
})()
