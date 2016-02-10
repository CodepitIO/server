#!/bin/bash

FORCE=false
START=true

while [[ $# > 0 ]]
do
  key="$1"
  case $key in
    -f|--force)
      FORCE=true
      ;;
    -n|--nostart)
      START=false
      ;;
    *)
      ;;
  esac
  shift
done

function bootstrap {
  bash -c "npm install && bower install --allow-root && grunt dev"
}

FILENAME=$PWD/.last_boot
LASTTIME=0

echo $FILENAME
if [ -f $FILENAME ]; then
  LASTTIME=$(<$FILENAME)
fi

THRESHOLDMILLIS=$((3*24*60*60))
TODAYMILLIS=$(date +%s)
COMPTIMEMILLIS=$(($TODAYMILLIS-$THRESHOLDMILLIS))

if $FORCE || (($LASTTIME < $COMPTIMEMILLIS));
then
  bootstrap
  if [ $? -eq 0 ]
  then
    echo $TODAYMILLIS > $FILENAME
  fi
fi

if $START; then
  nodemon server
fi

