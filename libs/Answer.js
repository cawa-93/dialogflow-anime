/** @module */
const {getRandomItem} = require('./utils.js')
const phrases = require('./database/phrases')
const qs = require('qs')
const SearchQuery = require('./SearchQuery')
const shikimori = require('./shikimori').getShikimoriApi({
	nickname: process.env.NICKNAME,
	password: process.env.PASSWORD,
})
.catch(resp => {
	console.error('shikimori authorization failed')
	console.error(resp.data)
})
/**
 * @class
 */
class Answer {

	constructor ({action, parameters, inputContexts, requestSource, session}) {
		this.action = action
		this.parameters = parameters
		this.requestSource = requestSource || 'default'
		console.log(this.requestSource)
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
			source: 'shikimori.org'
		}
	}

	static async getAnimes (params) {
    	const API = await shikimori
  		const resp = await API.get('/animes', { params })
      return Promise.all(resp.data.map(a => API.get('/animes/' + a.id).then(resp => resp.data)))
  }
	/**
	 * Возвращяет случайный стикер
	 * @param  {string} type Категория набора стикеров
	 * @return {string}      ID стикера
	 */
	// static getRandomSticker(type) {
	// 	return getRandomItem(phrases.stickers[type])
	// }

	// static getWaitText() {
	// 	return {
	// 		text: getRandomItem(phrases.wait).text,
	// 	}
	// }

	// static getStartMess() {
	// 	return {
	// 		text: '<b>Примеры запросов:</b>\n<i>Сериал в жанре комедия;\n5 фильмов ужасов;\nтоп 10 комедий;\n5 Аниме похожих на "Наруто";\nТоп ужасов 2017;\nКомедии 18+;</i>',
	// 		params: this.getMessParams(),
	// 	}
	// }

	// static getErrorText(e) {
	// 	return {
	// 		sticker: this.getRandomSticker('error'),
	// 		text: `<b>Кажется в процессе что-то сломалось.</b>\nСообщите о проблеме @kozack:\n<pre>${e.stack.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;')}</pre>.`,
	// 		params: this.getMessParams(),
	// 	}
	// }

	/**
	 * Возвращает текст ответа
	 * @param  {module:libs/SearchQuery~SearchQuery} query  Объект запроса
	 * @param  {Array}  result Массив аниме
	 * @return {Object}        Объект с данными для сообщения
	 */
	getFulfillmentMessages(query, result = []) {
		const messeges = []

		const names = result.map(a => this[`_getSingleItem_${this.requestSource}`](a))

		console.log(...names)

		messeges.push({
			platform: 'PLATFORM_UNSPECIFIED',
			text: {text: [`Вот что есть:\n${names.join(';\n')}`]}
		})

		messeges.push({
			platform: 'TELEGRAM',
			text: {text: [`Вот что есть:\n${names.join(';\n')}`]}
		})
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
	_getSingleItem_default(item, addScore = true) {
		if (!item)
			return ''
		return `${item.russian || item.name}`+ (addScore ? ` (${item.score}/10)` : '')
	}

	_getSingleItem_telegram(item, addScore = true) {
		if (!item)
			return ''
		return `<a href="${item.shortUrl || 'https://shikimori.org'+item.url}">${item.russian || item.name}</a>`+ (addScore ? ` (${item.score}/10)` : '')
	}
	// static _getListItems(items) {
	// 	return items.map(i => ` • ${this._getSingleItem(i)};`).join('\n')
	// }
}

module.exports = Answer