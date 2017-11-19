const express = require('express'); // Cloud Functions for Firebase library
const app = express();
var bodyParser = require('body-parser');
const SearchQuery = require('./libs/SearchQuery')
const AnswerFactory = require('./libs/AnswerFactory')
const shikimori = require('./libs/shikimori').getShikimoriApi({
	nickname: process.env.NICKNAME,
	password: process.env.PASSWORD,
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/webHook', function (request, response) {
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  if (request.body && request.body.result) {
    processV1Request(request, response);
  } else {
    console.log('Invalid Request');
    return response.status(400).end('Invalid Webhook Request (expecting v1 webhook request)');
  }
})

app.listen(process.env.PORT, () => console.log('WebHook server listening on port 3000!'))

function processV1Request (request, response) {
  let action = request.body.result.action; // https://dialogflow.com/docs/actions-and-parameters
  let parameters = request.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters
  let inputContexts = request.body.result.contexts; // https://dialogflow.com/docs/contexts
  let requestSource = (request.body.originalRequest) ? request.body.originalRequest.source : undefined;

  // Create handlers for Dialogflow actions as well as a 'default' handler
  const actionHandlers = {
    // The default welcome intent has been matched, welcome the user (https://dialogflow.com/docs/events#default_welcome_intent)
    'SearchQuery': async function () {
      var q = new SearchQuery(parameters)
      const animes = await getAnimes(q.toApi())
      // console.log(inputContexts)
      sendResponse({
        data: {
          telegram: {
            text: AnswerFactory.getAnswer(q, animes).text,
            parse_mode: 'HTML',
          }
        }
      })
    },
    'SearchQuery.more': async function () {
      var q = new SearchQuery(parameters)
      let params = q.toApi()
      params.page = (params.page || 0) + 1
      const animes = await getAnimes(params)
      sendResponse({
        data: {
          telegram: {
            text: AnswerFactory.getAnswer(q, animes).text,
            parse_mode: 'HTML',
          },
        },
        contextOut: [{
          name: 'searchquery',
          lifespan: '5',
          parameters: params,
        }],
      })
    },
  };

  // console.log(action, parameters)
  // If undefined or unknown action use the default handler
  if (actionHandlers[action]) {
    actionHandlers[action]();
  }

  // Run the proper handler function to handle the request from Dialogflow

  // Function to send correctly formatted responses to Dialogflow which are then sent to the user
  function sendResponse (responseToUser) {
    // if the response is a string send it as a response to the user
    if (typeof responseToUser === 'string') {
      let responseJson = {};
      responseJson.speech = responseToUser; // spoken response
      responseJson.displayText = responseToUser; // displayed response
      // responseJson.data = {
      //   telegram: {
      //     parse_mode: 'HTML'
      //   }
      // };
      response.json(responseJson); // Send response to Dialogflow
    } else {
      // If the response to the user includes rich responses or contexts send them to Dialogflow
      let responseJson = {};
      // If speech or displayText is defined, use it to respond (if one isn't defined use the other's value)
      // responseJson.speech = responseToUser.speech || responseToUser.displayText;
      // responseJson.displayText = responseToUser.displayText || responseToUser.speech;
      // Optional: add rich messages for integrations (https://dialogflow.com/docs/rich-messages)
      responseJson.data = responseToUser.data /* || {
        telegram: {
          parse_mode: 'HTML'
        }
      };*/
      // Optional: add contexts (https://dialogflow.com/docs/contexts)
      responseJson.contextOut = responseToUser.contextOut;

      
      response.json(responseJson); // Send response to Dialogflow
    }
  }

  async function getAnimes(params) {
    	const API = await shikimori
  		const resp = await API.get('/animes', { params })
      return Promise.all(resp.data.map(a => API.get('/animes/' + a.id).then(resp => resp.data)))
  }
}
