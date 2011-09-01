## phantomjs under OSX
The OSX dmg unversal installer puts the phantom executable here:

    alias phantomjs='/Applications/phantomjs.app//Contents/MacOS/phantomjs'
    
## phantomjs install Ubuntu 10.04.1 LTS

In 10.04, libqtwebkit-dev not found, and not needed.

    #sudo apt-get install libqt4-dev libqtwebkit-dev qt4-qmake
    sudo apt-get install libqt4-dev qt4-qmake

    git clone https://github.com/ariya/phantomjs.git && cd phantomjs
    git checkout 1.2
    qmake-qt4 && make

    scp -p ./bin/phantomjs /usr/local/bin
    
    #http://code.google.com/p/phantomjs/wiki/XvfbSetup
    apt-get install xvfb
    Xvfb :0 -screen 0 1024x768x24 &
    export DISPLAY=:0
    phantomjs ...
    
    apt-get install imagemagick
    
To remove the following:



    [dix] Could not init font path element /usr/share/fonts/X11/75dpi, removing from list!
    ...

See http://veeraramkumar.blogspot.com/2011_06_01_archive.html

Do the following

    apt-get install xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic

That removes the warnings except for ttcid fonts?

    [dix] Could not init font path element /var/lib/defoma/x-ttcidfont-conf.d/dirs/TrueType, removing from list!
    

## PDF Options
As pdf rendering is a bit broken,... see the [wkhtmltopdf](https://github.com/antialize/wkhtmltopdf) project.
This is what we use in ekomobi for QR-Code generation (pdf).
These are the dependancies for wkhtmltopdf static libs.

    sudo aptitude install openssl build-essential xorg libssl-dev

## Siteify:

    phantomjs siteify.js |tee siteify.log; tail -1 siteify.log >siteify.json

