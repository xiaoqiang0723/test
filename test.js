/* eslint-env node, mocha */
require('should')
const request = require('request')

describe('/start接口测试', () => {
	it('/start fun start', (done) => {
		request.post('http://localhost:3000/start', (error, response, body) => {
			// console.log('response', response)
			if (!error && response.statusCode === 200) {
				body.should.be.equal('OK')
				done()
			}
			if (error) {
				done(error)
			}
		})
	})
})

describe('/:number接口测试', () => {
	it('/:number fun start', (done) => {
		request.get('http://localhost:3000/20', (error, response, body) => {
			// console.log('response', response)
			if (!error && response.statusCode === 200) {
				body.should.be.equalOneOf(['bigger', 'smaller', 'equal'])
				done()
			}
			if (error) {
				done(error)
			}
		})
	})
})

function gameTest(i, callback) {
	request(`http://localhost:3000/${i}`, (error, response, body) => {
		console.log(i)
		console.log(body)
		if (!error && response.statusCode === 200) {
			body.should.match((n) => {
				if (n === 'equal') {
					callback()
				} else {
					gameTest(i + 1)
				}
			})
		}
		if (error) {
			callback(error)
		}
	})
	// }))
}


describe('/完整测试', () => {
	beforeEach(async () => {
		await new Promise((resolve, reject) => {
			request.post('http://localhost:3000/start', (error, response, body) => {
				// error.should.be.equal('undefined')
				if (!error && response.statusCode === 200) {
					resolve(body)
				}
				reject()
			})
		})
	})
	describe('/猜数开始', () => {
		it('/guess number start', (done) => {
			gameTest(0, done())
		})
	})
})
