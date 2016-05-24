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

function shouldInstall {
  local FILENAME=$PWD/$1
  local HASHFILENAME=$PWD/.$1.md5
  local MD5=0
  if [ -f $HASHFILENAME ]; then
    MD5=$(<$HASHFILENAME)
  fi
  local NEW_MD5=`md5sum ${FILENAME} | awk '{ print $1 }'`
  if $FORCE || [ "$MD5" != "$NEW_MD5" ]; then
    echo "Running '$2'... this might take a while if it's the first time installing."
    bash -c "$2"
    if [ $? -eq 0 ]; then
      echo $NEW_MD5 > $HASHFILENAME
    fi
  fi
}

# TODO(stor): Temporarily not working on Windows for dev, as it needs --no-bin-links
shouldInstall "package.json" "npm install --loglevel info"
shouldInstall "bower.json" "bower install --allow-root"

if $START; then
  grunt dev
fi
