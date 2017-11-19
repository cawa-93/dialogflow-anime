const axios = require('axios')

/**
 * Получает access_token по пере
 * @param  {strung} options.nickname Логин
 * @param  {strung} options.password Пароль
 * @return {strung}                  Token
 * {@link https://shikimori.org/api/doc/1.0/access_tokens/create}
 */
function getToken({nickname, password}) {
	console.log(nickname, password)
	return axios.post('https://shikimori.org/api/access_token', {nickname,
		password})
		.then(resp => {
	console.log(resp.data)
			return resp.data.api_access_token
		})
}

function getShikimoriApi({nickname, password}) {
	return getToken({nickname,
		password}).then(token => axios.create({
		baseURL: 'https://shikimori.org/api/',
		headers: {
			'X-User-Nickname': nickname,
			'X-User-Api-Access-Token': token,
			'User-Agent': `application name: @animeFoxBot; application url: https://t.me/animeFoxBot; author email: kozackunisoft@gmail.com; shikimori nickname: ${nickname}`,
		},
	}))
}

module.exports = {
	getToken,
	getShikimoriApi,
}