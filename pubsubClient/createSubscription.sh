#!/bin/sh
export PUBSUB_TOPIC="chatbaseLogMessageTopic"
gcloud pubsub subscriptions create testSubscription --topic $PUBSUB_TOPIC