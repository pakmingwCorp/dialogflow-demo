// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues

// updated by pakmingw@ for demo
// chatbase integration: https://github.com/google/chatbase-node
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues

// pub sub integration
// https://github.com/googleapis/nodejs-pubsub/blob/master/README.md#before-you-begin

// updated by pakmingw@ for demo

'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
// REPLACE YOUR CHATBASE_KEY HERE and Google Pub Sub Message sink
const chatbaseAPIKey = 'CHATBASE_KEY';
const pubsubMessageTopic = 'chatbaseLogMessageTopic';

// Typically, replace user ID with resolved ID from LDAP, if required.
const userId = Math.random().toString(36).substr(2, 8); // random user ID

// set default parameters for chatbase
const chatbase = require('@google/chatbase').setApiKey(chatbaseAPIKey).setUserId(userId).setPlatform('dialogflow').setVersion('1.0'); // the intent of the user message

// Imports the Google Cloud client library
const PubSub = require('@google-cloud/pubsub');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  var agentSource = '';
  if (agent.requestSource === agent.ACTIONS_ON_GOOGLE) {
    agentSource = 'ACTIONS_ON_GOOGLE';
  } else {
    agentSource = 'Dialogflow';
  }
  console.log('Agent Source: ' + agentSource);
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  console.log('UserId: ' + userId);
  console.log('User message: ' + request.body.queryResult.queryText.toString());
  console.log('Bot message: ' + request.body.queryResult.fulfillmentText.toString());
  console.log('intentDetectionConfidence: ' + request.body.queryResult.intentDetectionConfidence.toString());
  console.log('Chatbase: user message sending log call ...');
  const userMessage = request.body.queryResult.queryText.toString();
  const botMessage = request.body.queryResult.fulfillmentText.toString();

  function resetBotToNewTicketIntent() {
    console.log('Fulfillment: Resetting Bot.');
    //console.log('Parameters: ' + JSON.stringify(agent.parameters));
    //console.log('Input Contexts: ' + JSON.stringify(agent.contexts));
    agent.clearOutgoingContexts();
    agent.clearContext('ticket-create');
    // because the above code doesn't work ... we'll use setContext()
    agent.setContext({'name': 'end-chat', 'lifespan': '0'});
    agent.setContext({'name': 'end-chat-yes-followup', 'lifespan': '0'});
    // remove actions
    agent.setContext({'name': 'ticket-create', 'lifespan': '0'});
    agent.setContext({'name': 'ticket-modify', 'lifespan': '0'});
    console.log('Output Contexts: ' + JSON.stringify(agent.contexts));
  }

  function sendChatbaseNotHandledMessage(strIntent) {
    console.log('Fulfillment Chatbase: Sending message on ' + strIntent + ' intent.');
    publishMessageToTopic(pubsubMessageTopic, JSON.stringify(request.body));
    chatbase.newMessage().setAsTypeUser().setAsNotHandled().setTimestamp(Date.now().toString()).setMessage(userMessage).setIntent(strIntent).send().then(msg => console.log(msg.getCreateResponse())).catch(err => console.error(err));
    chatbase.newMessage().setAsTypeAgent().setAsNotHandled().setTimestamp(Date.now().toString()).setMessage(botMessage).setIntent(strIntent).send().then(msg => console.log(msg.getCreateResponse())).catch(err => console.error(err));
  }

  function sendChatbaseHandledMessage(strIntent) {
    console.log('Fulfillment Chatbase: Sending message on ' + strIntent + ' intent.');
    publishMessageToTopic(pubsubMessageTopic, JSON.stringify(request.body));
    chatbase.newMessage().setAsTypeUser().setAsHandled().setTimestamp(Date.now().toString()).setMessage(userMessage).setIntent(strIntent).send().then(msg => console.log(msg.getCreateResponse())).catch(err => console.error(err));
    chatbase.newMessage().setAsTypeAgent().setAsHandled().setTimestamp(Date.now().toString()).setMessage(botMessage).setIntent(strIntent).send().then(msg => console.log(msg.getCreateResponse())).catch(err => console.error(err));
  }

  // pubsub code here to publish data into cloud
  function publishMessageToTopic(topicName, messageData) {
    console.log('Publishing to topic: ' + topicName);
    console.log('Publishing message: ' + messageData);
    // Creates a client
    const pubsubClient = new PubSub();
    // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
    const dataBuffer = Buffer.from(messageData);
    // Add two custom attributes, origin and username, to the message
    const customAttributes = {
      origin: 'nodejs-sample',
      username: 'gcp',
    };
    pubsubClient.topic(topicName).publisher().publish(dataBuffer, customAttributes).then(messageId => {console.log('Pubsub: Message ${messageId} published.');}).catch(err => {console.error('ERROR:', err);});
  }

  // fulfillment handlers are here

  function defaultWelcomeIntentHandler() {
    var tempIntent = 'Default Welcome Intent';
    sendChatbaseHandledMessage(tempIntent);
    resetBotToNewTicketIntent();
  }

  function ticketCreateServiceApplicationIntentHandler() {
    var tempIntent = 'ticket-create-service-application';
    sendChatbaseHandledMessage(tempIntent);
  }

  function defaultFallbackIntentHandler(){
    var tempIntent = 'Default Fallback Intent';
    sendChatbaseNotHandledMessage(tempIntent);
  }

  function ticketCreateHandler() {
    var tempIntent = 'ticket-create';
    sendChatbaseHandledMessage(tempIntent);
  }

  function ticketCreateServiceApplicationHandler() {
    var tempIntent = 'ticket-create-service-application';
    sendChatbaseHandledMessage(tempIntent);
  }

  function contactUserEmailHandler() {
    var tempIntent = 'contact-user-email';
    sendChatbaseHandledMessage(tempIntent);
  }

  function contactUserPhoneHandler() {
    var tempIntent = 'contact-user-phone';
    sendChatbaseHandledMessage(tempIntent);
  }

  function contactUserPhoneNoHandler() {
    var tempIntent = 'contact-user-phone - no';
    sendChatbaseHandledMessage(tempIntent);
  }

  function contactUserPhoneYesHandler() {
    var tempIntent = 'contact-user-phone - yes';
    sendChatbaseHandledMessage(tempIntent);
  }

  function ticketModifyHandler() {
    var tempIntent = 'ticket-modify';
    sendChatbaseHandledMessage(tempIntent);
  }

  function ticketModifySelectTicketHandler() {
    var tempIntent = 'ticket-modify - select ticket';
    sendChatbaseHandledMessage(tempIntent);
  }

  function endChatYesHandler() {
    var tempIntent = 'end-chat-yes';
    sendChatbaseHandledMessage(tempIntent);
  }

  function endChatNoHandler() {
    var tempIntent = 'end-chat-no';
    sendChatbaseHandledMessage(tempIntent);
  }

  function talkToOperatorHandler() {
    var tempIntent = 'talk-to-operator';
    sendChatbaseHandledMessage(tempIntent);
  }

  function talkToOperatorYesHandler() {
    var tempIntent = 'talk-to-operator - yes';
    sendChatbaseHandledMessage(tempIntent);
  }

  function talkToOperatorNoHandler() {
    var tempIntent = 'talk-to-operator - no';
    sendChatbaseHandledMessage(tempIntent);
  }

  
  // end handlers

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', defaultWelcomeIntentHandler);
  intentMap.set('Default Fallback Intent', defaultFallbackIntentHandler);
  intentMap.set('ticket-create', ticketCreateHandler);
  intentMap.set('ticket-create-service-application', ticketCreateServiceApplicationHandler);
  intentMap.set('contact-user-email', contactUserEmailHandler);
  intentMap.set('contact-user-phone', contactUserPhoneHandler);
  intentMap.set('contact-user-phone - no', contactUserPhoneNoHandler);
  intentMap.set('contact-user-phone - yes', contactUserPhoneYesHandler);
  intentMap.set('ticket-modify', ticketModifyHandler);
  intentMap.set('ticket-modify - select ticket', ticketModifySelectTicketHandler);
  intentMap.set('end-chat-yes', endChatYesHandler);
  intentMap.set('end-chat-no', endChatNoHandler);
  intentMap.set('talk-to-operator', talkToOperatorHandler);
  intentMap.set('talk-to-operator - yes', talkToOperatorYesHandler);
  intentMap.set('talk-to-operator - no', talkToOperatorNoHandler);
  agent.handleRequest(intentMap);

});
