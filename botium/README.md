# Botium Test Automation

## Getting Started

Botium test automation provides automated testing for the Dialogflow chatbot. It also includes the scripts necessary to run through the conversational use cases with the robot in the `convos` directory.

## Prerequisites

This guide assumes you are self-sufficient in NodeJS, javascript, GCP, and shell scripting. Good luck!

## Installing

* Update the `botium.json` file to match your deployment. Particularly important is the key to your service account -- you will need to generate a key and then copy and paste in the key value into this file.
* Install nodejs and then run a `npm install` to update your packages.
* Copy the contents `botium-connector-dialogflow-cjs_fork.js` into the botium connector dist version of this file. There's an open issue on this that I'm going to fix with a pull request ... eventually.
* Run the application by `./runTests.sh` or `./runLotsOfTests.sh` if you want to continuously generate traffic

## Contributing

Please contact pakmingw@ if you wish to contribute to this demo. I'd love your input!

## Authors

* **Pak-Ming Wan** - *Initial work* - Initial build

## License

This project is licensed under the Apache 2 License - see the [LICENSE.md](LICENSE.md) file for details

