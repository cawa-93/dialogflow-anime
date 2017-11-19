const Joi = require('joi')

module.exports = [
	{
		text: 'Для вас {{name}}',
	}, {
		text: 'Вам понравится: {{name}}',
	}, {
		text: '{{name}} - это просто уморительная комедия',
		rule: Joi.object({genre: Joi.array().items(Joi.valid('4').required(), Joi.string()).required()}),
	},
]