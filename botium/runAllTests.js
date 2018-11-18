const BotDriver = require('botium-core').BotDriver;

const driver = new BotDriver();

driver.BuildFluent()
  .ReadScripts('convos')
  .Start()
  .RunScripts()
  .Exec().then(() => {
    console.log('READY')
  })
  .catch((err) => {
    console.log('ERROR: ', err)
  });

  // need to update botium connector dialogflow cjs.js
  //          var botMsg$1 = { sender: 'bot', sourceData: response.queryResult, messageText: response.queryResult.fulfillmentMessages[0].text.text[0] };
