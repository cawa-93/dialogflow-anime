const express = require(`express`)
const bodyParser = require(`body-parser`)

const actions = {
	default        : require(`./libs/Action.class.js`),
	SearchQuery    : require(`./libs/SearchQuery.class.js`),
	SearchQueryMore: require(`./libs/SearchQueryMore.class.js`),
	SearchByName   : require(`./libs/SearchByName.class.js`),
}

const app = express()
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

app.post(`/webHook`, async function (request, response) {
	try {
		if (!request.body.queryResult) {
			throw new Error(`Invalid Webhook Request`)
		}

		const action = (request.body.queryResult.action) ? request.body.queryResult.action : undefined
		if (!actions[action]) {
			throw new Error(`Action ${action} is not found`)
		}

		const parameters = request.body.queryResult.parameters || {}
		const outputContexts = request.body.queryResult.outputContexts
		const requestSource = (request.body.originalDetectIntentRequest) ? request.body.originalDetectIntentRequest.payload : {}
		const session = (request.body.session) ? request.body.session : undefined
		const answer = new actions[action] ({parameters, outputContexts, requestSource, session})

		return response.json(await answer.toJson())
	} catch (e) {
		const answer = new actions[`default`]()
		const messages = []

		if (e.response) {
			// eslint-disable-next-line no-console
			console.log(e.response)
			messages.push(
				`Упс... Мне не удалось открыть список аниме`,
				`Спросите ещё раз чуть позже`,
				`И буду благодарна если вы отправите моему создателю (kozackunisoft@gmail.com) эту информацию:`,
				`${e.response.status} ${e.response.statusText}\n\n${JSON.stringify(e.response.data)}`
			)
		} else {
			// eslint-disable-next-line no-console
			console.log(e)
			messages.push(
				`Ой... Кажется я где-то ошиблась`,
				`Буду благодарна если вы отправите моему создателю (kozackunisoft@gmail.com) эту информацию:`,
				`${e.stack}`
			)
		}


		messages.forEach(m => answer.pushMessage({text: {text: [m]}}))
		return response.json(await answer.toJson())
	}
})

// eslint-disable-next-line no-console
app.listen(process.env.PORT, () => console.log(`WebHook server listening on port ${process.env.PORT}!`))
