# Firebase Project

## Getting Started

This Firebase project is actually just a shell project to allow you to have IDE assistance when coding the Fulfillment Firebase Function in Dialogflow. It imports in all the node libraries required for you to do local dev (at least with a little assistance).

## Prerequisites

This guide assumes you are have access to GCP and Dialogflow, and you know a little NodeJS.

## Installing

* Install NodeJS on your computer
* Issue a `npm install` in the functions directory in order to update dependencies
* Open up VSCode or another IDE and you should have auto-completion!
* The code to copy and paste into the Dialogflow Fulfillment function is `index.js`. You cannot run it separately on the command line. Use the Dialogflow IDE to deploy it into Firebase.
* Update the chatbase key in the `index.js` to suit your deployment.
* Update your message sink topic in the `index.js` to suit your deployment.
* Update the user ID with a real user ID in `index.js` if your front end has this information.


## Contributing

Please contact pakmingw@ if you wish to contribute to this demo. I'd love your input!

## Authors

* **Pak-Ming Wan** - *Initial work* - Initial build

## License

This project is licensed under the Apache 2 License - see the [LICENSE.md](LICENSE.md) file for details

