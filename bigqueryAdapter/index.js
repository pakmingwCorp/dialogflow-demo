/**
 * Background Cloud Function to be triggered by Pub/Sub.
 * This function is exported by index.js, and executed when
 * the trigger topic receives a message.
 *
 * @param {object} data The event payload.
 * @param {object} context The event metadata.
 */

exports.bigQueryAdapter = (data, context) => {
    // refactored from existing adapter into cloud function
    const subscriptionName = 'bigQueryAdapter';
    const projectId = 'PROJECT_ID';
    const datasetId = 'BIGQUERY_DATASET_ID';
    const tableId = 'BIGQUERY_TABLE_ID';
    //const rows = [{name: 'Tom', age: 30}, {name: 'Jane', age: 32}];
    const metadata = {
        sourceFormat: 'NEWLINE_DELIMITED_JSON',
        autodetect: true,
    };
    // Creates a BQ client
    const BigQuery = require('@google-cloud/bigquery');
    const bigquery = new BigQuery({
        projectId: projectId,
    });
    const pubSubMessage = data;
    const name = pubSubMessage.data ? Buffer.from(pubSubMessage.data, 'base64').toString() : 'Empty data.';
    
    console.log('BigQueryAdapter Received message id: ' + JSON.stringify(pubSubMessage.id));
    console.log('BigQueryAdapter Message Attributes: ' + JSON.stringify(pubSubMessage.attributes));
    console.log('BigQueryAdapter Pub Sub message payload: ' + name);
    tempJSON = JSON.parse(name);
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
            }
        );
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
};