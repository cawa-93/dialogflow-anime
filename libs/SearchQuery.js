/** @module */
// const qs = require('qs')
const database = require('./database')

class SearchQuery {
	/**
	 * @param  {Object}  query Папаметры поискового запроса
	 * @property {?string} search Фраза в скобках, либо текст просле "про ..."
	 * @property {?module:libs/database/genres~Genre[]} genre Массив найденных жанров
	 * @property {?module:libs/database/types~Type[]} type Массив найденных типов
	 * @property {?module:libs/database/ratings~Rating[]} rating Массив найденных возрастных ограничений
	 * @property {?module:libs/database/orders~Order} order Объект порядка
	 * @property {?number} limit Лимит возвращаемых результатов
	 * @property {?string[]} season Массив строк в формате `yyyy` или `yyyy-yyyy`
	 * @property {?string} similar Строка для поиска похожих аниме
	 * @property {?number} page Параметр пагинации
	 */
	constructor(options) {
		Object.keys(options).forEach(k => {
			if (!options[k] || (Array.isArray(options[k]) && !options[k].length))
				return
			else {
				this[k] = options[k]
			}
			if (this.genre && this.genre.length && this.genre.indexOf('all') !== -1) {
				delete this.genre
			}
		})
	}

	/**
	 * Приводит данные в формат подходящий для HTTP GET запроса
	 * @return {Object} Данные для запроса
	 */
	toApi() {
		const result = {}
		Object.keys(this).forEach(k => {
			if (this[k] == null)
				return
			if (k === 'genre' || k === 'type') {
				result.genre = this[k].map(r => database[k][r]).join(',')
			} else {
				result[k] = Array.isArray(this[k]) ? this[k].join(',') : this[k]
			}
		})
		return result
	}

	// getGenres() {
	// 	if (!Array.isArray(this.genre))
	// 		return ''
	// 	return this.genre.map(id => database.genres.find(g => g.id == id))
	// }

	// static parse(string) {
	// 	return qs.parse(string)
	// }
}

module.exports = SearchQuery