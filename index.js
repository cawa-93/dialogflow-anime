const express = require('express') // Cloud Functions for Firebase library
const app = express()
const bodyParser = require('body-parser')

const actions = {
  SearchQuery: require('./libs/SearchQuery.class.js'),
  SearchQueryMore: require('./libs/SearchQueryMore.class.js'),
  SearchByName: require('./libs/SearchByName.class.js'),
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/webHook', function (request, response) {
  try {
    if (request.body.queryResult) {
      processV2Request(request, response)
    } else {
      console.log('Invalid Request')
      return response.status(400).end('Invalid Webhook Request (expecting v2 webhook request)')
    }
  } catch (e) {
    console.error(e.stack)
  }
})

app.listen(process.env.PORT, () => console.log('WebHook server listening on port 3000!'))

/*
* Function to handle v2 webhook requests from Dialogflow
*/
async function processV2Request (request, response) {
  try {

    console.log()

    let action = (request.body.queryResult.action) ? request.body.queryResult.action : 'default'
    let parameters = request.body.queryResult.parameters || {} // https://dialogflow.com/docs/actions-and-parameters
    let outputContexts = request.body.queryResult.outputContexts // https://dialogflow.com/docs/contexts
    let requestSource = (request.body.originalDetectIntentRequest) ? request.body.originalDetectIntentRequest.payload : {}
    let session = (request.body.session) ? request.body.session : undefined

    if (actions[action]) {
      const answer = new actions[action] ({parameters, outputContexts, requestSource, session})
      response.json(await answer.toJson())
    }
  } catch (e) {
    console.log(e)
    response.json({
      fulfillmentText: 'Упс... Кажется что-то сломалось. Сообщите разработчику: kozackunisoft@gmail.com\n\n'+e.stack
    })
  }

}