// alias phantomjs=/Applications/phantomjs.app//Contents/MacOS/phantomjs
// phantomjs thumbify.js file://`pwd`/ekothumb.html
// phantomjs thumbify.js http://test.ekomobi.dev.axialdev.net/ coco.png
// sips --resampleWidth 120 coco.png --out small-coco.png
var page = new WebPage(),
    address, output, size;

if (phantom.args.length < 2 || phantom.args.length > 3) {
    console.log('Usage: thumbify.js URL output(.png)');
    phantom.exit();
} else {
    address = phantom.args[0];
    output = phantom.args[1];
    page.onConsoleMessage = function (msg) {
        console.log(msg);
    };
    page.viewportSize = { width: 320, height: 480 };
    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
        } else {
            console.log('open callback');
            //document.write('<script type="text/javascript" src="http://code.jquery.com/mobile/1.0b1/jquery.mobile-1.0b1.min.js"><\/script>');
            window.setTimeout(function () {
                page.render(output);
                phantom.exit();
            }, 500);
        }
    });
}