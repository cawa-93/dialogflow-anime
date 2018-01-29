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

	static async getAnimes (params) {
  		const resp = await shikimori.get('/animes', { params })
      return Promise.all(resp.data.map(a => shikimori.get('/animes/' + a.id).then(resp => resp.data)))
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

	// static getMessParams(callback_data) {
	// 	const res = {
	// 		parse_mode : 'HTML',
	// 	}
	// 	if (callback_data && typeof callback_data === 'string' && callback_data.length <= 64) {
	// 		res.reply_markup = {
	// 			inline_keyboard: [
	// 				[
	// 					{
	// 						text: 'Другие варианты',
	// 						callback_data,
	// 					},
	// 				],
	// 			],
	// 		}
	// 	}
	// 	return res
	// }

	// static _parseAnswer(template, result = [], query= {}) {
	// 	// if (query.similar)
	// 		// template = template.replace('{{similar}}', this._getSingleItem(query.similar, false))

	// 	return template
	// 		.replace('{{list}}', this._getListItems(result))
	// 		.replace('{{name}}', this._getSingleItem(result[0]))
	// }
	// 
	// 
	_getSingleItem(item, addScore = true) {
		// if (!item)
			// return ''
		// return `${item.russian || item.name}${(addScore ? ` (${item.score}/10)` : '')} ${item.shortUrl || 'https://shikimori.org'+item.url}`
		return {
			title: (item.russian || item.name) + (item.score ? ` (${item.score}/10)` : ''),
			// subtitle: item.russian ? item.name : undefined,
			subtitle: item.description ? item.description : undefined,
			imageUri: item.image ? `https://shikimori.org${item.image.preview}` : undefined
		}
	}

	// static _getListItems(items) {
	// 	return items.map(i => ` • ${this._getSingleItem(i)};`).join('\n')
	// }
}

module.exports = Answer