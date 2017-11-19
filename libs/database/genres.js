/** @module */
/**
 * @typedef {Object} Genre
 * @property {number}      id ID
 * @property {string}      name Название на английском
 * @property {string}      russian Название на русском
 * @property {XRegExpData} trigger Данные для анализа
 */
/**
 * Массив известных жанров
 * @type {Genre[]}
 */
module.exports = {
	'Comedy': '4',
	'Drama': '8',
	'Horror': '14'
}
// module.exports = [
// 	{
// 		'id': '8',
// 		'name': 'Drama',
// 		'russian': 'Драма',
// 		'trigger': ['\\bдрам'],
// 	}, {
// 		'id': '11',
// 		'name': 'Game',
// 		'russian': 'Игры',
// 		'trigger': ['\\bигр'],
// 	}, {
// 		'id': '40',
// 		'name': 'Psychological',
// 		'russian': 'Психологическое',
// 		'trigger': ['\\bпсихологическ'],
// 	}, {
// 		'id': '2',
// 		'name': 'Adventure',
// 		'russian': 'Приключения',
// 		'trigger': ['\\bприключен'],
// 	}, {
// 		'id': '19',
// 		'name': 'Music',
// 		'russian': 'Музыка',
// 		'trigger': ['\\bмузык'],
// 	}, {
// 		'id': '1',
// 		'name': 'Action',
// 		'russian': 'Экшен',
// 		'trigger': ['\\bэкшен'],
// 	}, {
// 		'id': '4',
// 		'name': 'Comedy',
// 		'russian': 'Комедия',
// 		'trigger': ['\\bкомеди'],
// 	}, {
// 		'id': '6',
// 		'name': 'Demons',
// 		'russian': 'Демоны',
// 		'trigger': ['\\bдемон'],
// 	}, {
// 		'id': '39',
// 		'name': 'Police',
// 		'russian': 'Полиция',
// 		'trigger': ['\\bполиц'],
// 	}, {
// 		'id': '29',
// 		'name': 'Space',
// 		'russian': 'Космос',
// 		'trigger': ['\\bкосм'],
// 	}, {
// 		'id': '9',
// 		'name': 'Ecchi',
// 		'russian': 'Этти',
// 		'trigger': ['\\bэтти\\b'],
// 	}, {
// 		'id': '10',
// 		'name': 'Fantasy',
// 		'russian': 'Фэнтези',
// 		'trigger': ['\\bфэнтез'],
// 	}, {
// 		'id': '12',
// 		'name': 'Hentai',
// 		'russian': 'Хентай',
// 		'trigger': ['\\bхентай\\b'],
// 	}, {
// 		'id': '13',
// 		'name': 'Historical',
// 		'russian': 'Исторический',
// 		'trigger': ['\\bистори'],
// 	}, {
// 		'id': '14',
// 		'name': 'Horror',
// 		'russian': 'Ужасы',
// 		'trigger': ['\\bужас'],
// 	}, {
// 		'id': '16',
// 		'name': 'Magic',
// 		'russian': 'Магия',
// 		'trigger': ['\\bмаг'],
// 	}, {
// 		'id': '18',
// 		'name': 'Mecha',
// 		'russian': 'Меха',
// 		'trigger': ['\\bмеха'],
// 	}, {
// 		'id': '20',
// 		'name': 'Parody',
// 		'russian': 'Пародия',
// 		'trigger': ['\\bпароди'],
// 	}, {
// 		'id': '21',
// 		'name': 'Samurai',
// 		'russian': 'Самураи',
// 		'trigger': ['\\bсамур'],
// 	}, {
// 		'id': '22',
// 		'name': 'Romance',
// 		'russian': 'Романтика',
// 		'trigger': ['\\bроман'],
// 	}, {
// 		'id': '23',
// 		'name': 'School',
// 		'russian': 'Школа',
// 		'trigger': ['\\bшкол'],
// 	}, {
// 		'id': '27',
// 		'name': 'Shounen',
// 		'russian': 'Сёнен',
// 		'trigger': ['\\b(сёнен|сенен)\\b'],
// 	}, {
// 		'id': '28',
// 		'name': 'Shounen Ai',
// 		'russian': 'Сёнен Ай',
// 		'trigger': ['\\b(сёнен|сенен)-?ай\\b'],
// 	}, {
// 		'id': '30',
// 		'name': 'Sports',
// 		'russian': 'Спорт',
// 		'trigger': ['\\bспорт'],
// 	}, {
// 		'id': '32',
// 		'name': 'Vampire',
// 		'russian': 'Вампиры',
// 		'trigger': ['\\bвампир'],
// 	}, {
// 		'id': '33',
// 		'name': 'Yaoi',
// 		'russian': 'Яой',
// 		'trigger': ['\\bяой'],
// 	}, {
// 		'id': '34',
// 		'name': 'Yuri',
// 		'russian': 'Юри',
// 		'trigger': ['\\bюри\\b'],
// 	}, {
// 		'id': '35',
// 		'name': 'Harem',
// 		'russian': 'Гарем',
// 		'trigger': ['\\bгарем'],
// 	}, {
// 		'id': '36',
// 		'name': 'Slice of Life',
// 		'russian': 'Повседневность',
// 		'trigger': ['\\bповседневность'],
// 	}, {
// 		'id': '42',
// 		'name': 'Seinen',
// 		'russian': 'Сейнен',
// 		'trigger': ['\\bсейнен'],
// 	}, {
// 		'id': '43',
// 		'name': 'Josei',
// 		'russian': 'Дзёсей',
// 		'trigger': ['\\b(дзёсей|дзесей)'],
// 	}, {
// 		'id': '37',
// 		'name': 'Supernatural',
// 		'russian': 'Сверхъестественное',
// 		'trigger': ['\\bсверхъестественн'],
// 	}, {
// 		'id': '41',
// 		'name': 'Thriller',
// 		'russian': 'Триллер',
// 		'trigger': ['\\bтриллер'],
// 	}, {
// 		'id': '25',
// 		'name': 'Shoujo',
// 		'russian': 'Сёдзе',
// 		'trigger': ['\\b(сёдзе|седзе)\\b'],
// 	}, {
// 		'id': '26',
// 		'name': 'Shoujo Ai',
// 		'russian': 'Сёдзе Ай',
// 		'trigger': ['\\b(сёдзе|седзе)-?ай\\b'],
// 	}, {
// 		'id': '24',
// 		'name': 'Sci-Fi',
// 		'russian': 'Фантастика',
// 		'trigger': ['\\bфантаст'],
// 	}, {
// 		'id': '31',
// 		'name': 'Super Power',
// 		'russian': 'Супер сила',
// 		'trigger': ['\\bсупер сил'],
// 	}, {
// 		'id': '38',
// 		'name': 'Military',
// 		'russian': 'Военное',
// 		'trigger': ['\\b(воен|войн)'],
// 	}, {
// 		'id': '7',
// 		'name': 'Mystery',
// 		'russian': 'Детектив',
// 		'trigger': ['\\bдетектив'],
// 	}, {
// 		'id': '15',
// 		'name': 'Kids',
// 		'russian': 'Детское',
// 		'trigger': ['\\bдет(ей\\b|c)'],
// 	}, {
// 		'id': '3',
// 		'name': 'Cars',
// 		'russian': 'Машины',
// 		'trigger': ['\\bмашин'],
// 	}, {
// 		'id': '17',
// 		'name': 'Martial Arts',
// 		'russian': 'Боевые искусства',
// 		'trigger': ['\\bбоевы\\p{Cyrillic}+ искусст\\p{Cyrillic}+'],
// 	}, {
// 		'id': '5',
// 		'name': 'Dementia',
// 		'russian': 'Безумие',
// 		'trigger': ['\\bбезум'],
// 	},
// ]