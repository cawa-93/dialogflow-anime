const TelegramBot = require('node-telegram-bot-api')
const TOKEN = process.env.TELEGRAM_TOKEN
const mode = process.env.MODE || 'polling'

let options = {
	polling: {
		autoStart: false,
	},
}

if (mode === 'webHook') {
	options.webHook = {
		port: process.env.PORT,
		autoOpen: false,
	}
}

const bot = new TelegramBot(TOKEN, options)

if (mode === 'webHook') {
	bot.setWebHook(`${process.env.APP_URL}/bot${TOKEN}`)
}

module.exports = {
	tg: bot,
	mode,
}