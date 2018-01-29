const express = require('express'); // Cloud Functions for Firebase library
const app = express();
const bodyParser = require('body-parser');
const Answer = require('./libs/Answer')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/webHook', function (request, response) {
  try {
    // console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
    if (request.body.queryResult) {
      processV2Request(request, response);
    } else {
      console.log('Invalid Request');
      return response.status(400).end('Invalid Webhook Request (expecting v2 webhook request)');
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
  // An action is a string used to identify what needs to be done in fulfillment
  let action = (request.body.queryResult.action) ? request.body.queryResult.action : 'default';
  // Parameters are any entites that Dialogflow has extracted from the request.
  let parameters = request.body.queryResult.parameters || {}; // https://dialogflow.com/docs/actions-and-parameters
  // Contexts are objects used to track and store conversation state
  let inputContexts = request.body.queryResult.contexts; // https://dialogflow.com/docs/contexts
  // Get the request source (Google Assistant, Slack, API, etc)
  let requestSource = (request.body.originalDetectIntentRequest) ? request.body.originalDetectIntentRequest.payload : {};
  // Get the session ID to differentiate calls from different users
  let session = (request.body.session) ? request.body.session : undefined;
  // Run the proper handler function to handle the request from Dialogflow
  const answer = new Answer({action, parameters, inputContexts, request: requestSource, session})
  sendResponse(await answer.toResponse());
  

  // Function to send correctly formatted responses to Dialogflow which are then sent to the user
  function sendResponse (responseToUser) {
    if (!responseToUser) {
      console.log('responseToUser is empty !!')
      console.log(responseToUser)
    }
    // if the response is a string send it as a response to the user
    if (typeof responseToUser === 'string') {
      let responseJson = {fulfillmentText: responseToUser}; // displayed response
      response.json(responseJson); // Send response to Dialogflow
    } else {
      // If the response to the user includes rich responses or contexts send them to Dialogflow
      let responseJson = {};

      // Define the text response
      responseJson.fulfillmentText = responseToUser.fulfillmentText;
      // Optional: add rich messages for integrations (https://dialogflow.com/docs/rich-messages)
      if (responseToUser.fulfillmentMessages) {
        responseJson.fulfillmentMessages = responseToUser.fulfillmentMessages;
      }
      // Optional: add contexts (https://dialogflow.com/docs/contexts)
      if (responseToUser.outputContexts) {
        responseJson.outputContexts = responseToUser.outputContexts;
      }
     // Optional: add contexts (https://dialogflow.com/docs/contexts)
      if (responseToUser.source) {
        responseJson.source = responseToUser.source;
      }

      // Send the response to Dialogflow
      console.log('Response to Dialogflow: ' + JSON.stringify(responseJson));
      response.json(responseJson);
    }
  }
}