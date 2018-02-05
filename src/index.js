const express = require(`express`)
const bodyParser = require(`body-parser`)

const actions = {
	SearchQuery    : require(`./libs/SearchQuery.class.js`),
	SearchQueryMore: require(`./libs/SearchQueryMore.class.js`),
	SearchByName   : require(`./libs/SearchByName.class.js`),
}

/*
* Function to handle v2 webhook requests from Dialogflow
*/
async function processV2Request (request, response) {
	try {
		const action = (request.body.queryResult.action) ? request.body.queryResult.action : undefined
		const parameters = request.body.queryResult.parameters || {}
		const outputContexts = request.body.queryResult.outputContexts
		const requestSource = (request.body.originalDetectIntentRequest) ? request.body.originalDetectIntentRequest.payload : {}
		const session = (request.body.session) ? request.body.session : undefined

		if (actions[action]) {
			const answer = new actions[action] ({parameters, outputContexts, requestSource, session})
			response.json(await answer.toJson())
		} else {
			throw new Error(`Undefined action ${action}`)
		}
	} catch (e) {
		// eslint-disable-next-line no-console
		console.log(e)
		response.json({
			fulfillmentText: `Упс... Кажется что-то сломалось. Сообщите разработчику: kozackunisoft@gmail.com\n\n${e.stack}`,
		})
	}
}

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post(`/webHook`, function (request, response) {
	try {
		if (request.body.queryResult) {
			processV2Request(request, response)
		} else {
			// eslint-disable-next-line no-console
			console.log(`Invalid Request`)
			return response.status(400).end(`Invalid Webhook Request (expecting v2 webhook request)`)
		}
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error(e.stack)
	}
})

// eslint-disable-next-line no-console
app.listen(process.env.PORT, () => console.log(`WebHook server listening on port 3000!`))
