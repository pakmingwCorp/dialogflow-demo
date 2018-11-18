// Imports the Google Cloud client library
const PubSub = require('@google-cloud/pubsub');
const BigQuery = require('@google-cloud/bigquery');

// Creates a client
const pubsub = new PubSub();

/** pubsub subscription
 * TODO(developer): Uncomment the following lines to run the sample.
 */
const subscriptionName = 'bigQueryAdapter';
const timeout = 3600 * 8; // that should last a while

/*
** Big query insertion
 * TODO(developer): Uncomment the following lines before running the sample.
 * Also, if you are using this the first time, make sure you set up BQ in GCP console!
 * UPDATE THESE THREE TABLES HERE
 */
const projectId = 'PROJECT_ID';
const datasetId = 'DATASET_ID';
const tableId = 'TABLE_ID';
//const rows = [{name: 'Tom', age: 30}, {name: 'Jane', age: 32}];
const metadata = {
    sourceFormat: 'NEWLINE_DELIMITED_JSON',
    autodetect: true,
};

// References an existing subscription
const subscription = pubsub.subscription(subscriptionName);

// Creates a BQ client
const bigquery = new BigQuery({
    projectId: projectId,
});

// Create an event handler to handle messages
let messageCount = 0;

const messageHandler = message => {
    console.log('Received message' + JSON.stringify(message.id));
    console.log(`\tData: ${message.data}`);
    console.log('\tAttributes: ' + JSON.stringify(message.attributes));

    var tempJSON = JSON.parse(message.data);
    var tempBotResponse = null;
    var tempDateTime = new Date(Date.now());

    if (tempJSON.queryResult) {
        // need to extract text for Dialogflow V2 API
        tempJSON.queryResult.fulfillmentMessages.forEach(
            function(element) {
            console.debug('Iterating: ' + JSON.stringify(element));
            if (element.text) {
                console.debug('Text object: ' + JSON.stringify(element.text));
                tempBotResponse = element.text.text[0];
            }
            });
    }
    // format row
    var row = {
        timestamp: tempDateTime.toISOString(),
        userUtterance: tempJSON.queryResult.queryText.toString(),
        chatbotResponse: tempBotResponse.toString(),
        detectionConfidence: tempJSON.queryResult.intentDetectionConfidence
    };
    console.debug('Row to insert: ' + JSON.stringify(row));

    // Inserts data into a table
    bigquery
        .dataset(datasetId)
        .table(tableId)
        .insert(row)
        .then(() => {
            console.log(`Inserted ${row.length} row(s)`);
        })
        .catch(err => {
            if (err && err.name === 'PartialFailureError') {
                if (err.errors && err.errors.length > 0) {
                    console.log('Insert errors:');
                    err.errors.forEach(err => console.error(err));
                }
            } else {
                console.error('ERROR:', err);
            }
        });
    // 'Ack' (acknowledge receipt of) the message
    messageCount += 1;
    message.ack();
};





// Listen for new messages until timeout is hit
subscription.on('message', messageHandler);
setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log('${messageCount} message(s) received.');
}, timeout * 1000);