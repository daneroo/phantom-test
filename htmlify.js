var page = new WebPage(),
    address, output, size;

if (phantom.args.length < 1 || phantom.args.length > 2) {
    console.log('Usage: rasterize.js URL >filename.html');
    phantom.exit();
} else {
    address = phantom.args[0];
    output = phantom.args[1];
    page.viewportSize = { width: 600, height: 600 };
    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
        } else {
            window.setTimeout(function () {
                console.log(page.content);
                phantom.exit();
            }, 200);
        }
    });
}