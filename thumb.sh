#!/bin/bash

BASE="file://`pwd`/ekothumb.html"
if [ "Linux" == `uname` ]; then
  echo "Linux"
  phantomjs='/usr/local/bin/phantomjs'
  resizeImg () {
    convert $1 -resize 140 $2
  }
  xDisplay=:42
  Xvfb $xDisplay -screen 0 1024x768x24 &
  xPID=$!
  echo spawned Xvfb PID $xPID
elif [ "Darwin" == `uname` ]; then
  echo "OSX"
  phantomjs='/Applications/phantomjs.app/Contents/MacOS/phantomjs'
  resizeImg () {
    echo sips --resampleWidth 140 $1 --out $2
    sips --resampleWidth 140 $1 --out $2
  }
  xPID=0
else
  echo "Why aren't you running Linux or OSX ?"
  exit -1
fi

echo "making thumbs"
mkdir -p img
for t in default valencia; do
    echo "##  theme $t";
    for v in none a b c d e; do
        echo "###  theme $t : variant: $v";
        WPARAM="$BASE?{\"name\":\"$t\",\"swatch\":\"$v\"}"
        echo $WPARAM
        $phantomjs thumbify.js $WPARAM tmp.png
        resizeImg tmp.png img/thumb-$t-$v.png
        rm tmp.png
    done
done

echo testing PID $xPID
if [ $xPID -gt 0 ]; then
  echo killing PID $xPID
  # test if still runnin g?
  kill -15 $xPID
fi  