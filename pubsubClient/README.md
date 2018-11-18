# Pub Sub Client

## Getting Started

This is a Cloud Pub Sub client to allow you to consume messages published by the Dialogflow Fulfillment code.

## Prerequisites

This guide assumes you are have access to GCP and Dialogflow.

## Installing

* Import the Dialogflow project ZIP into your instance
* Create the Pub Sub topic using `createSubscription` https://cloud.google.com/pubsub/docs/admin
* Enable the fulfillment code. Review the code and make sure it fits the topic(s) that you have just defined.
* Install NodeJS and run `npm install` to update dependencies
* Run the client with `node index.js`

## Contributing

Please contact pakmingw@ if you wish to contribute to this demo. I'd love your input!

## Authors

* **Pak-Ming Wan** - *Initial work* - Initial build

## License

This project is licensed under the Apache 2 License - see the [LICENSE.md](LICENSE.md) file for details

