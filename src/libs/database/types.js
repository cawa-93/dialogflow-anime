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
module.exports = {
	Сериал        : `tv`,
	Фильм         : `movie`,
	OVA           : `ova`,
	ONA           : `ona`,
	'Спец. выпуск': `special`,
}
