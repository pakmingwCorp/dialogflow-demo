#!/bin/sh
export MAXWAIT=600
while :
do 
	echo "Running tests ..."
	./runTests.sh
	echo "Waiting ..."
	sleep $((RANDOM % MAXWAIT))
done

