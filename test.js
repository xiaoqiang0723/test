/* eslint-env node, mocha */
require('should')
const request = require('request')

describe('/start接口测试', () => {
	it('/start fun start', (done) => {
		request.post('http://localhost:3000/start', (error, response, body) => {
			// eslint-disable-next-line
			should(error).not.be.ok()
			response.statusCode.should.be.equal(200)
			body.should.be.equal('OK')
			done()
		})
	})
})

describe('/:number接口测试', () => {
	it('/:number fun start', (done) => {
		request.get('http://localhost:3000/20', (error, response, body) => {
			// eslint-disable-next-line
			should(error).not.be.ok()
			response.statusCode.should.be.equal(200)
			body.should.be.equalOneOf(['bigger', 'smaller', 'equal'])
			done()
		})
	})
})

function gameTest(i, callback) {
	request(`http://localhost:3000/${i}`, (error, response, body) => {
		// console.log(i)
		// console.log(body)
		// eslint-disable-next-line
		should(error).not.be.ok()
		// (`${error}`).should.be.equalOneOf(['undefined', 'null'])
		response.statusCode.should.be.equal(200)
		body.should.match((n) => {
			if (n === 'equal') {
				callback()
			} else {
				gameTest(i + 1, callback)
			}
		})
	})
}


describe('/完整测试', () => {
	beforeEach(done =>
		request.post('http://localhost:3000/start', (error, response, body) => {
			// eslint-disable-next-line
			should(error).not.be.ok()
			response.statusCode.should.be.equal(200)
			body.should.be.equal('OK')
			done()
		}))
	describe('/猜数开始', () => {
		it('/guess number start', (done) => {
			gameTest(0, done)
		})
	})
})
