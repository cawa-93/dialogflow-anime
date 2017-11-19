/** @module */

const genres = require('./genres')
const types = require('./types')
const orders = require('./orders')
const ratings = require('./ratings')

/**
 * База всех статических данных
 * @type {Object}
 * @property {module:libs/database/genres}  genres  Массив известных жанров
 * @property {module:libs/database/types}   types   Массив известных типов
 * @property {module:libs/database/orders}  orders  Массив известных сортировок
 * @property {module:libs/database/ratings} ratings Массив известных возрасных ограничений
 * @property {module:libs/database/stickers} stickers объек с массивами стикеров
 */
module.exports = {
	genres,
	types,
	orders,
	ratings,
}