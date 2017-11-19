/** @module */
const {getRandomItem} = require('./utils.js')
const phrases = require('./database/phrases')
const qs = require('qs')

/**
 * @class
 */
class AnswerFactory {
	/**
	 * Возвращяет случайный стикер
	 * @param  {string} type Категория набора стикеров
	 * @return {string}      ID стикера
	 */
	static getRandomSticker(type) {
		return getRandomItem(phrases.stickers[type])
	}

	static getWaitText() {
		return {
			text: getRandomItem(phrases.wait).text,
		}
	}

	static getStartMess() {
		return {
			text: '<b>Примеры запросов:</b>\n<i>Сериал в жанре комедия;\n5 фильмов ужасов;\nтоп 10 комедий;\n5 Аниме похожих на "Наруто";\nТоп ужасов 2017;\nКомедии 18+;</i>',
			params: this.getMessParams(),
		}
	}

	static getErrorText(e) {
		return {
			sticker: this.getRandomSticker('error'),
			text: `<b>Кажется в процессе что-то сломалось.</b>\nСообщите о проблеме @kozack:\n<pre>${e.stack.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;')}</pre>.`,
			params: this.getMessParams(),
		}
	}

	/**
	 * Возвращает текст ответа
	 * @param  {module:libs/SearchQuery~SearchQuery} query  Объект запроса
	 * @param  {Array}  result Массив аниме
	 * @return {Object}        Объект с данными для сообщения
	 */
	static getAnswer(query, result = []) {
		if (!result.length) {
			return {
				sticker: this.getRandomSticker('notFound'),
				text: getRandomItem(phrases.notFound).text,
			}
		}

		const allowed = phrases[result.length > 1 ? 'list' : 'single'].filter(phrase => {
			if (!phrase.rule)
				return true
			return phrase.rule.validate(query, {
				abortEarly: true,
				allowUnknown: true,
			}).error === null
		})

		let template = getRandomItem(allowed).text

		let callback_data = query.toApi()

		const answer = {
			text: this._parseAnswer(template, result, query),
			params: this.getMessParams(qs.stringify(callback_data)),
		}
		return answer
	}

	static getMessParams(callback_data) {
		const res = {
			parse_mode : 'HTML',
		}
		if (callback_data && typeof callback_data === 'string' && callback_data.length <= 64) {
			res.reply_markup = {
				inline_keyboard: [
					[
						{
							text: 'Другие варианты',
							callback_data,
						},
					],
				],
			}
		}
		return res
	}

	static _parseAnswer(template, result = [], query= {}) {
		// if (query.similar)
			// template = template.replace('{{similar}}', this._getSingleItem(query.similar, false))

		return template
			.replace('{list}', this._getListItems(result))
			.replace('{name}', this._getSingleItem(result[0]))
	}

	static _getSingleItem(item, addScore = true) {
		if (!item)
			return ''
		return `<a href="${item.shortUrl || 'https://shikimori.org'+item.url}">${item.russian || item.name}</a>`+ (addScore ? ` (${item.score}/10)` : '')
	}
	static _getListItems(items) {
		return items.map(i => ` • ${this._getSingleItem(i)};`).join('\n')
	}
}

module.exports = AnswerFactory