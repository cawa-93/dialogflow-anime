/** @module */
/**
 * @typedef {Object} Order
 * @property {string}      id ID
 * @property {string}      russian Название на русском
 * @property {XRegExpData} trigger Данные для анализа
 */
/**
 * Массив известных сортировок
 * @type {Order[]}
 */
module.exports = [
	{
		'id':'ranked',
		'russian':'Лучших',
		'trigger': ['\\b(топ|популяр|лучш|самы|крут)'],
	}, {
		'id':'random',
		'russian':'Случайных',
		'trigger': ['\\b(случай|любые)'],
	},
]