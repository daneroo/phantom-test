#!/bin/bash

BASE="file://`pwd`/ekothumb.html"
phantomjs='/Applications/phantomjs.app//Contents/MacOS/phantomjs'
# under vagrant
#phantomjs='/usr/local/bin/phantomjs'
echo "making thumbs"
for t in default valencia; do
    echo "theme $t";
    for v in none a b c d e; do
        echo "  theme $t : variant: $v";
        # {"name":"valencia","swatch":"c"}
        WPARAM="$BASE?{\"name\":\"$t\",\"swatch\":\"$v\"}"
        echo phantomjs thumbify.js $WPARAM thumb-$t-$v.png
        $phantomjs thumbify.js $WPARAM tmp.png
        sips --resampleWidth 140 tmp.png --out thumb-$t-$v.png
        # under vagrant
        # convert tmp.png -resize 140 thumb-$t-$v.png
        rm tmp.png
    done
done