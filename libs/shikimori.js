const axios = require('axios')

module.exports = axios.create({
	baseURL: 'https://shikimori.org/api/',
	headers: {
		'User-Agent': `application name: @animeFoxBot; author email: kozackunisoft@gmail.com;`,
	},
})