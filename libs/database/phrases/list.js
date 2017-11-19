const Joi = require('joi')
module.exports = [
	{
		text: 'Вот что нашлось:\n{{list}}',
	}, {
		text: 'То что искали:\n{{list}}',
	}, {
		text: 'Вот:\n{{list}}\nЭто самые высоко оцененные комедии',
		rule: Joi.object({
			genre: Joi.array().items(Joi.valid('4').required(), Joi.string()).required(),
			order: 'ranked',
		}),
	}, {
		text: 'На {{similar}} похоже вот это:\n{{list}}',
		rule: Joi.object({
			similar: Joi.object({
				name: Joi.string().required(),
			}).required(),
		}),
	},
]