/* eslint-env node, mocha */
require('should')
const http = require('http')

describe('/start接口测试', () => {
	it('/start fun start', (done) => {
		http.request(
			{
				hostname: 'localhost',
				port: 3000,
				path: '/start',
				method: 'POST',
			},
			(res) => {
				res.boby = ''
				res.on('data', (chunk) => {
					res.boby += chunk
				})
				res.on('end', () => {
					res.boby.should.be.equal('OK')
					done()
				})
			},
		).end()
	})
})

describe('/:number接口测试', () => {
	it('/:number fun start', (done) => {
		http.request(
			{
				hostname: 'localhost',
				port: 3000,
				path: '/30',
				method: 'GET',
			},
			(res) => {
				res.boby = ''
				res.on('data', (chunk) => {
					res.boby += chunk
				})
				res.on('end', () => {
					res.boby.should.be.equalOneOf(['bigger', 'smaller', 'equal'])
					done()
				})
			},
		).end()
	})
})
