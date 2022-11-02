#! /bin/bash

#find oldest revved css file in src directory, if it exists, and remove said file
cd src/css/rev
numberOfSrcFiles=$(ls | wc -l)
if [ "$numberOfSrcFiles" -gt 1 ]
  then
    oldestSrcFileName=$(ls -t | tail -1)
    rm "$oldestSrcFileName"
fi
cd ../../../
if [ -d dist/css ]
  then
    cd dist/css
    numberOfDistFiles=$(ls | wc -l)
    if [ "$numberOfDistFiles" -gt 1 ]
    then
      oldestDistFileName=$(ls -t | tail -1)
      rm "$oldestDistFileName"
    fi
fi
