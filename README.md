# Dialogflow Demo Package

The Dialogflow demo package is an accelerator demonstrator for dialogflow that is adapted for giving customer demos and for training purposes. It contains a various components such as a web front end, a set of existing use cases (based on support ticket creation and modification), chatbase integration, and other nice stuff.

Dialogflow demo Google Cloud Architecture

![alt text](https://github.com/https://github.com/pakmingwCorp/dialogflow-demo/raw/master/images/DialogflowDemo.png "Dialogflow Demo Architecture")

Recommended usage is to clone this repository to local git repo and then fork it for your own purposes. If you do build something nifty and want to contribute back, please go ahead and contact me to create a pull request.

Documentation in this project assumes you have a working knowledge of Google Cloud, NodeJS, Google App Engine and are just pretty resourceful in general.

Support for this package is admittedly pretty minimal given it is a side project. 

Thanks! pakmingw@

## Getting Started

Clone the repository to a local directory. 

Note: `otherDemos` include other demo environments created by other people.

The design document based on `go/bot-draft-worksheet` can be found here: https://docs.google.com/document/d/1LS8ekTZQ3agLUewhQk2L6qTTRK08GBNRDizS8gordhA

### Prerequisites

You will need a development machine with NodeJS 

You also need a billable google cloud account with admin access in order to make things easier for you. My scripts have variables for the project id that you can replace, as well as other key elements such as the JSON keys. As this is a demo, I haven't spent a lot of time on the secret management side of things unfortunately.  Also, where I have been inspired by others code, I have noted their references. Finally, my code quality was focused on productivity not quality, so please excuse any shortcuts I may have taken (but feel free to fix them yourself).

This guide assumes you are self-sufficient in NodeJS, javascript, GCP, and shell scripting. Good luck!

I have not put any of the `node_modules/` code in this repository. You will need to run `npm` to finish the install wherever necessary.

### Installing

This repository allows you to deploy a very minimal Dialogflow demo environment with the following solution architecture:

Minimal installation:

1. Create a dialogflow account and import the dialogflow project from the folder `dialogflowProject`. There's a small cog next to your project that you can use to the import the ZIP. 

2. Look at the conversational scripts in `botium/convos`. You can use these to interact with the bot to get a feeling of how the create ticket and modify ticket intents are implemented.

Installation steps are as follows:

1. Create a dialogflow account and import the dialogflow project from `dialogflowProject`. You just need the ZIP file. Review the intents carefully.

2. Create the pubsub topic and update the pubsub client in `pubsubClient`. This is to allow you to test the fulfillment triggers in Dialogflow.

3. Create a project in chatbase and update the API key in the `index.js` within `dialogflowProject`.  Update the fulfillment Firebase function in Dialogflow to test it.

4. Give your service account api rights to Dialogflow API and then update the API key in `botium` so that you can do some automated testing. Manually patch the dialogflow connector with the forked javascript code in the root directory. This updates the connector to support Dialogflow's V2 API.

5. Deploy the web client in `webClient`, make sure you change the GCP project information before you launch the build and run script. You will also need to create the Google App Engine deployment as well as install the ng cli in order to make the automated deployment scripts to work (i.e. `npm install -g @angular/cli`).

## Running the tests

Automated tests are run out Botium. You can see the conversations within the `convos` directory.

## Deployment

I would strongly recommend against deploying this as is into a production system! You should work with your developement team / architects as this code has been designed as a demonstrator / training environment, not to be production ready.

The front end and fulfillment orchestration is on purpose simple and somewhat generic as it is where ISVs and Partners can add the most value by implemeting specific solutions.

## Built With

* [Dialogflow](https://dialogflow.com/) - Dialogflow
* [Google Cloud](https://cloud.google.com/) - Google Cloud
* [Botium](http://www.botium.at/) - Botium
* [Angular](https://angular.io/) - Angular
* [AngularMaterial](https://material.angular.io/) - Angular Material
* [NodeJS](https://nodejs.org/en/) - NodeJS
* [VSCode](https://code.visualstudio.com/) - VS Code

## Contributing

Please contact pakmingw@ if you wish to contribute or have feedback on this demo. I'd love your input!

## Authors

* **Pak-Ming Wan** - *Initial work* - Initial development of this demo.

## License

This project is licensed under the Apache 2 License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Thanks to the great Dialogflow support team at support@dialogflow.com for their timely help
* Thanks to Google Cloud PSO who gave me some timely advice on how to build certain aspects of this demo
