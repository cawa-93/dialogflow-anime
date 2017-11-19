/** @module */
/**
 * Парамерты запроса по-умолчанию
 * @type {Object}
 * @property {number} limit Лимит возвращаемых результатов. Default: 1
 * @property {string} type  Тип возвращаемых результатов. Default: 'tv'
 * @property {string} order Порядок возвращаемых результатов. Default: 'random'
 */
module.exports = {
	limit: 1,
	type: 'tv,ova,ona,movie,special',
	order: 'random',
	censored: false,
	score: 2,
}