# Big Query Adapter

## Getting Started

The Bigquery Adapter listens in on a Cloud Pub Sub topic to stream events from Dialogflow into Bigquery. Use this to build your own custom BI instances.

## Prerequisites

This guide assumes you are self-sufficient in NodeJS, javascript, GCP, and shell scripting. Good luck!

## Installing

* Set up Bigquery and the table target format
* Install nodejs and then run a `npm install` to update your packages.
* Update the `projectId`, `datasetId`, `tableId`, to match your project in index.js.
* Edit the code in `index.js` to map to your Bigquery row format, particularly the `row` variable.
* Update the sql in bigqueryCode.sql to match your table provisioned in Bigquery.

Run the application by `node index.js`. Good luck!

## Contributing

Please contact pakmingw@ if you wish to contribute to this demo. I'd love your input!

## Authors

* **Pak-Ming Wan** - *Initial work* - Initial build

## License

This project is licensed under the Apache 2 License - see the [LICENSE.md](LICENSE.md) file for details

