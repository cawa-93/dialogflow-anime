/**
 * Модуль парсера сообщений
 * @module
 */
const database = require('./database')
const SearchQuery = require('./SearchQuery')
const XRegExp = require('xregexp')
XRegExp.addToken(/\\b/, () => '(?:^|$|[^a-zA-Zа-яА-Я0-9-])')

class SearchQueryFactory {
	/**
	 * Поиск фразы в скобках, либо текст просле "про ..."
	 * @param  {string} message Сообщение пользователя
	 * @return {?string}        Фраза в скобках, либо текст просле "про ..."
	 */
	getSearch(message) {
		if (!message || typeof message !== 'string') {
			return null
		}

		let result = XRegExp.exec(message, XRegExp('\\b"(?<name>[^"]+)"\\b', 'ng'))
		if (result && result.name) {
			return result.name
		}

		// Определение сюжета
		// Очень не надёжный способ !
		// TODO: придумать как не включать в это поле всё подряд
		result = XRegExp.exec(message, XRegExp('\\bпро\\b(?<search>.+)\\b', 'ni'))
		if (result && result.search) {
			return result.search
		}

		return null
	}

	/**
	 * Поиск упоминаний известных жанров
	 * @param  {string} message Сообщение пользователя
	 * @return {?module:libs/database/genres~Genre[]}       Массив найденных жанров
	 */
	getGenre(message) {
		if (!message || typeof message !== 'string') {
			return null
		} else {
			message = XRegExp.replace(message, XRegExp('(\\b)"[^"]+"(\\b)', 'g'), '$1$2')
		}

		let result = null
		database.genres.forEach(genre => {
			if (this._getXRegExp(genre.trigger).test(message)) {
				if (!result)
					result = []
				result.push(genre)
			}
		})
		return result
	}

	/**
	 * Поиск упоминаний известных типов (Фильм, сериал, ova, ona)
	 * @param  {string} message Сообщение пользователя
	 * @return {?module:libs/database/types~Type[]}        Массив найденных типов
	 */
	getType(message) {
		if (!message || typeof message !== 'string') {
			return null
		} else {
			message = XRegExp.replace(message, XRegExp('(\\b)"[^"]+"(\\b)', 'g'), '$1$2')
		}

		let result = null
		database.types.forEach(type => {
			if (this._getXRegExp(type.trigger).test(message)) {
				if (!result)
					result = []
				result.push(type)
			}
		})
		return result
	}

	/**
	 * Поиск упоминаний известных возрастных ограничений
	 * @param  {string} message Сообщение пользователя
	 * @return {?module:libs/database/ratings~Rating[]}      Массив найденных возрастных ограничений
	 */
	getRating(message) {
		if (!message || typeof message !== 'string') {
			return null
		} else {
			message = XRegExp.replace(message, XRegExp('(\\b)"[^"]+"(\\b)', 'g'), '$1$2')
		}

		let result = null
		database.ratings.forEach(rating => {
			if (this._getXRegExp(rating.trigger).test(message)) {
				if (!result)
					result = []
				result.push(rating)
			}
		})
		return result
	}

	/**
	 * Определяет параметр сортировки
	 * @param  {string} message Сообщение пользователя
	 * @return {?module:libs/database/orders~Order}          Объект порядка
	 */
	getOrder(message) {
		if (!message || typeof message !== 'string') {
			return null
		} else {
			message = XRegExp.replace(message, XRegExp('(\\b)"[^"]+"(\\b)', 'g'), '$1$2')
		}

		let result = null
		database.orders.forEach(order => {
			if (this._getXRegExp(order.trigger).test(message)) {
				result = order
			}
		})
		return result
	}

	/**
	 * Определяет количество возвращаемых результатов. Не больше 50
	 * @param  {string} message Сообщение пользователя
	 * @return {?number}         Лимит возвращаемых результатов
	 */
	getLimit(message) {
		if (!message || typeof message !== 'string') {
			return null
		} else {
			message = XRegExp.replace(message, XRegExp('(\\b)"[^"]+"(\\b)', 'g'), '$1$2')
		}

		let result = XRegExp.match(message, XRegExp('\\b(100|[0-9]{1,2})\\b', 'ng'))
			.filter(n => n.indexOf('+') < 0)
			.map(s => parseInt(s))
			// [0] || null
		if (!result || !result.length) {
			return null
		}

		result = Math.max(...result)

		return result > 50 ? 50 : result
	}

	/**
	 * Поиск года релиза.
	 * @param  {string} message Сообщение пользователя
	 * @return {?string[]}       Массив строк в формате `yyyy` или `yyyy-yyyy`
	 */
	getSeason(message) {
		if (!message || typeof message !== 'string') {
			return null
		} else {
			message = XRegExp.replace(message, XRegExp('(\\b)"[^"]+"(\\b)', 'g'), '$1$2')
		}

		let result = XRegExp
			.match(message, XRegExp('\\b(19|20)[0-9]{2}(-(19|20)[0-9]{2})?\\b', 'nig'))
			.map(s => s.trim().replace('-', '_'))

		if (!result || !result.length) {
			return null
		}

		return result
	}

	/**
	 * Получает название аниме, для которого нужно вернуть похожие
	 * @param  {string} message Сообщение пользователя
	 * @return {?string}        Название для поиска
	 */
	getSimilar(message) {
		if (!message || typeof message !== 'string') {
			return null
		}

		let result = XRegExp.exec(message, XRegExp('\\b(как|похож|схож|по( |-)типу)\\p{Cyrillic}* ?(на|с|как)? "(?<name>[^"]+)"\\b', 'ngi'))

		if (result && result.name) {
			return result.name
		}

		return null
	}

	/**
	 * @typedef {Array} XRegExpData
	 * @property {string}   0 Основа регулярного выражения
	 * @property {?string}  1 Флаги регулярного выражения
	 */
	/**
	 * Создание регулярного выражения
	 * @param  {XRegExpData} data Сообщение пользователя
	 * @return {XRegExp}          Объект [XRegExp]{@link http://xregexp.com/}
	 */
	_getXRegExp(data) {
		if (!data[1]) {
			data[1] = 'ni'
		}
		return XRegExp(...data)
	}


	/**
	 * @param  {string} message Сообщение пользователя
	 * @return {module:libs/SearchQuery~SearchQuery}    Данные для поиска
	 */
	getQuery(message) {
		const similar = this.getSimilar(message)
		if (similar) {
			return new SearchQuery({
				similar,
				limit: this.getLimit(message),
			})
		}
		return new SearchQuery({
			search: this.getSearch(message),
			genre:  this.getGenre(message),
			type:   this.getType(message),
			rating: this.getRating(message),
			order:  this.getOrder(message),
			limit:  this.getLimit(message),
			season: this.getSeason(message),
		})

	}
}

/**
 * @type {SearchQueryFactory}
 */
module.exports = SearchQueryFactory