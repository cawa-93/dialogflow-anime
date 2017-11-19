/** @module */
/**
 * @typedef {Object} Rating
 * @property {string}      id ID
 * @property {string}      russian Название на русском
 * @property {XRegExpData} trigger Данные для анализа
 */
/**
 * Массив известных возрасных ограничений
 * @type {Rating[]}
 */
module.exports = [
	{
		'id':'g',
		'russian':'G',
		'trigger': ['(\\bg|0\\+)\\b'],
	}, {
		'id':'pg',
		'russian':'PG',
		'trigger': ['\\b(pg|8\\+)\\b'],
	}, {
		'id':'pg_13',
		'russian':'PG-13',
		'trigger': ['\\b(pg-13|13\\+)\\b'],
	}, {
		'id':'r',
		'russian':'R',
		'trigger': ['\\b(r|16\\+|17\\+)\\b'],
	}, {
		'id':'r_plus',
		'russian':'R+',
		'trigger': ['\\b(r+|18\\+)\\b'],
	}, {
		'id':'rx',
		'russian':'Rx',
		'trigger': ['\\b(rx|21\\+)\\b'],
	},
]