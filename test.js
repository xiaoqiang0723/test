/* eslint-env node, mocha */
require('should')
const request = require('request')

describe('/start接口测试', () => {
	it('/start fun start', (done) => {
		request.post('http://localhost:3000/start', (error, response, body) => {
			// console.log('response', response)
			if (!error && response.statusCode === 200) {
				body.should.be.equal('OK')
			}
			done()
		})
	})
})

describe('/:number接口测试', () => {
	it('/:number fun start', (done) => {
		request.get('http://localhost:3000/20', (error, response, body) => {
			// console.log('response', response)
			if (!error && response.statusCode === 200) {
				body.should.be.equalOneOf(['bigger', 'smaller', 'equal'])
			}
			done()
		})
	})
})

function gameTest(i, callback) {
	try {
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
		})
	} catch (e) {
		console.log(e)
	}
	// }))
}


describe('/完整测试', () => {
	beforeEach(async () => {
		await request.post('http://localhost:3000/start', (error, response, body) => {
			if (!error && response.statusCode === 200) {
				return body
			}
			return ''
		})
	})
	describe('/猜数开始', () => {
		it('/guess number start', (done) => {
			gameTest(0, done())
		})
	})
})
