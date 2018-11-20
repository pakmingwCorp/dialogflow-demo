#!/bin/sh
export TOPIC_NAME=chatbaseLogMessageTopic
gcloud functions deploy bigQueryAdapter --runtime nodejs8 --trigger-resource $TOPIC_NAME --trigger-event google.pubsub.topic.publish
