#!/bin/sh
echo "Removing old build..."
rm -rf dist/
mkdir dist
mkdir dist/chatbotApp
echo "Starting ng build ..."
ng build
echo "Copying Google App Engine app.yaml to deployment location"
cp app.yaml dist/chatbotApp/
echo "Deploying to Google App Engine"
# setup gcloud parameters
export PROJECT_ID="PROJECT_ID"
export GCP_REGION="GCP_REGION"
# gcloud config list project
gcloud config set project $PROJECT_ID
gcloud config set compute/zone $GCP_REGION
gcloud app deploy dist/chatbotApp/app.yaml --promote