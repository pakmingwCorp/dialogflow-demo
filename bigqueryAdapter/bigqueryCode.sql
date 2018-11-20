/* 
NOTE: Update the table name to match your table.
*/
SELECT date(timestamp), chatbotResponse, count(*) FROM `dialogflow-demo.dialogflow_test.chatbot_interactions`
group by date(timestamp), chatbotResponse
