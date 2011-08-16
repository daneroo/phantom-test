var fibs = [0, 1];
var ticker = window.setInterval(function () {
    console.log(fibs[fibs.length - 1]);
    fibs.push(fibs[fibs.length - 1] + fibs[fibs.length - 2]);
    if (fibs.length > 20) {
        window.clearInterval(ticker);
        phantom.exit();
    }
}, 300);