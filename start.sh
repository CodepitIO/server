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

BOWER_JSON=$PWD/bower.json

BOWER_HASH_FILE=$PWD/.bower.json.md5

# Compiling matchProblems.cpp
bash -c "g++ cpp/matchProblems.cpp -o cpp/matchProblems --std=c++0x"

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

shouldInstall "package.json" "npm install --no-bin-links"
shouldInstall "bower.json" "bower install --allow-root"

if $START; then
  grunt dev
fi

