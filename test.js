/* eslint-env node, mocha */
require('should')
const request = require('request')

describe('/start接口测试', () => {
	it('/start fun start', (done) => {
		request.post('http:localhost:3000/start', (error, response, body) => {
			if (!error && response.statusCode === 200) {
				body.should.be.equal('OK')
			}
			done()
		})
	})
})

describe('/:number接口测试', () => {
	it('/:number fun start', (done) => {
		request('http:localhost:3000/20', (error, response, body) => {
			if (!error && response.statusCode === 200) {
				body.should.be.equalOneOf(['bigger', 'smaller', 'equal'])
			}
			done()
		})
	})
})
