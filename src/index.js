const express = require(`express`)
const bodyParser = require(`body-parser`)

const actions = {
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
			throw new Error(`Undefined action ${action}`)
		}

		const parameters = request.body.queryResult.parameters || {}
		const outputContexts = request.body.queryResult.outputContexts
		const requestSource = (request.body.originalDetectIntentRequest) ? request.body.originalDetectIntentRequest.payload : {}
		const session = (request.body.session) ? request.body.session : undefined
		const answer = new actions[action] ({parameters, outputContexts, requestSource, session})

		return response.json(await answer.toJson())
	} catch (e) {
		// eslint-disable-next-line no-console
		console.log(e)
		response.json({
			fulfillmentText: `Упс... Кажется что-то сломалось. Сообщите разработчику: kozackunisoft@gmail.com\n\n${e.stack}`,
		})
	}
})

// eslint-disable-next-line no-console
app.listen(process.env.PORT, () => console.log(`WebHook server listening on port ${process.env.PORT}!`))
