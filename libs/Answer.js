/** @module */
const {getRandomItem} = require('./utils.js')
const phrases = require('./database/phrases')
const qs = require('qs')
const SearchQuery = require('./SearchQuery')
const shikimori = require('./shikimori')
/**
 * @class
 */
class Answer {

	constructor ({action, parameters, inputContexts, request, session}) {
		this.action = action
		this.parameters = parameters
		this.request = request
		if (!this.request) {
			this.request = {}
		}
		if (!this.request.source) {
			this.request.source = 'default'
		}
	}

	async toResponse () {
		try {
			if (this[`action_${this.action}`]) {
				return await this[`action_${this.action}`]()
			}
		} catch (e) {
			console.error(e.stack)
		}
	}

	async action_SearchQuery() {
		const query = new SearchQuery(this.parameters)
		const animes = await Answer.getAnimes(query.toApi())
		return {
			fulfillmentMessages: this.getFulfillmentMessages(query, animes),
			source: 'shikimori.org',
		}
	}
	async action_SearchByName() {
		const animes = await Answer.getAnimes({
			search: this.parameters.name,
			limit: 1,
		})
		const messages = []
		if (animes.length) {
			messages.push({
				platform: 'PLATFORM_UNSPECIFIED',
				card: this._getSingleItem(animes[0])
			})

			const similar = await Answer.getSimilar(animes[0].id, 3)
			if (similar.length) {
				messages.push(
					{
						platform: 'PLATFORM_UNSPECIFIED',
						text: {text: ['Вот похожие аниме:']}
					},
					...similar.map(a => ({
						platform: 'PLATFORM_UNSPECIFIED',
						card: this._getSingleItem(a)
					}))
				)
			}
		}

		return {
			fulfillmentMessages: messages,
			source: 'shikimori.org',
		}
	}

	static async getAnimes (params) {
		const resp = await shikimori.get('/animes', { params })
    return Promise.all(resp.data.map(a => shikimori.get('/animes/' + a.id).then(resp => resp.data)))
  }


	static async getSimilar (id, limit) {
		const {data} = await shikimori.get(`/animes/${id}/similar`)
    return Promise.all(data.slice(0,limit).map(a => shikimori.get('/animes/' + a.id).then(resp => resp.data)))
  }

	/**
	 * Возвращает текст ответа
	 * @param  {module:libs/SearchQuery~SearchQuery} query  Объект запроса
	 * @param  {Array}  result Массив аниме
	 * @return {Object}        Объект с данными для сообщения
	 */
	getFulfillmentMessages(query, result = []) {
		return [
			{
				platform: 'PLATFORM_UNSPECIFIED',
				text: {text: [`Думаю это подойдёт`]}
			},
			...result.map(a => ({
				platform: 'PLATFORM_UNSPECIFIED',
				card: this._getSingleItem(a)
			}))
		]

	}

	_getSingleItem(item, addScore = true) {
		return {
			title: (item.russian || item.name) + (item.score ? ` (${item.score}/10)` : ''),
			subtitle: item.description ? item.description.replace(/\[[^]+\]/gi, '') : undefined,
			imageUri: item.image ? `https://shikimori.org${item.image.original}` : undefined,
			buttons: [{
			  "text": 'Смотреть',
			  "postback": item.shortUrl || 'https://shikimori.org'+item.url,
			}]
		}
	}
}

module.exports = Answer