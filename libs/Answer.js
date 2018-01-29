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
		console.log(query.toApi())
		console.log(animes)
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
		const messeges = []

		const rows = result.map(a => this._getSingleItem(a))

		messeges.push({
			platform: 'PLATFORM_UNSPECIFIED',
			text: {text: [`Вот что есть:`, 'Вот что нашла:', 'Вот что могу посоветовать:']}
		})

		messeges.push({
			platform: 'PLATFORM_UNSPECIFIED',
			text: {text: [rows.join(';\n')]}
		})

		// messeges.push({
		// 	platform: 'TELEGRAM',
		// 	payload: {
		// 	  "telegram": {
		// 	    "text": names.join(';\n'),
		// 	    "parse_mode": "HTML"
		// 	  }
		// 	}
		// })
		// if (!result.length) {
		// 	return {
		// 		sticker: this.getRandomSticker('notFound'),
		// 		text: getRandomItem(phrases.notFound).text,
		// 	}
		// }

		// const allowed = phrases[result.length > 1 ? 'list' : 'single'].filter(phrase => {
		// 	if (!phrase.rule)
		// 		return true
		// 	return phrase.rule.validate(query, {
		// 		abortEarly: true,
		// 		allowUnknown: true,
		// 	}).error === null
		// })

		// let template = getRandomItem(allowed).text

		// // let callback_data = query.toApi()

		// const answer = {
		// 	text: this._parseAnswer(template, result, query),
		// 	// params: this.getMessParams(qs.stringify(callback_data)),
		// }
		return messeges
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
		if (!item)
			return ''
		return `${item.russian || item.name}${(addScore ? ` (${item.score}/10)` : '')} ${item.shortUrl || 'https://shikimori.org'+item.url}`
	}

	// static _getListItems(items) {
	// 	return items.map(i => ` • ${this._getSingleItem(i)};`).join('\n')
	// }
}

module.exports = Answer