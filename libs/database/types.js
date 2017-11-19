/** @module */
/**
 * @typedef {Object} Type
 * @property {string}      id ID
 * @property {string}      russian Название на русском
 * @property {XRegExpData} trigger Данные для анализа
 */
/**
 * Массив известных типов
 * @type {Type[]}
 */
module.exports = [
	{
		'id':'tv',
		'russian':'Сериал',
		'trigger': ['\\bсериал'],
	}, {
		'id':'movie',
		'russian':'Фильм',
		'trigger': ['\\b(фильм|полнометр)'],
	}, {
		'id':'ova',
		'russian':'OVA',
		'trigger': ['\\b(ova|ов\\p{Cyrillic})'],
	}, {
		'id':'ona',
		'russian':'ONA',
		'trigger': ['\\b(ona|он\\p{Cyrillic})'],
	}, {
		'id':'special',
		'russian':'Спец. выпуск',
		'trigger': ['\\b(special|спешл|cпец)'],
	},
]