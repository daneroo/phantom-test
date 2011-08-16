var page = new WebPage(),
    url, output, size;

if(phantom.args.length === 0 || phantom.args.length > 2) {
  console.log("Simple QUnit test runner for phantom.js");
  console.log('Usage: testrunner.js url_to_test_file.html');
  console.log('Accepts: http://example.com/file.html and file://`pwd`/test.html');
  phantom.exit();
} else {
    url = phantom.args[0];
    //output = phantom.args[1];
    page.viewportSize = { width: 600, height: 600 };
    page.onLoadStarted = function (status) {
        console.log('Start loading...');
        window.myrunnercallback = function(r){
            console.log("runnerCB: "+'Passed: '+r.passed + ', Failed: '+ r.failed + ' Total: '+ r.total+ ' Runtime: '+r.runtime);
        }
    };
    page.onResourceRequested = function (request) {
        console.log('Request ' + JSON.stringify(request.url, undefined, 4));
    };
    page.onResourceReceived = function (resp) {
        //resp = {url:resp.url,stage:resp.stage};
        console.log('Receive ' + JSON.stringify(resp.url+':'+resp.stage, undefined, 4));
        if (resp.stage=='end'){
            page.evaluate(function () {
                console.log('QUnit is '+((typeof(QUnit)!=='undefined')?"defined":"undefined"));                
            });
        }
    };
    page.onLoadFinished = function (status) {
        // not being called
        console.log('Loading finished :: '+status);
    };
    page.onConsoleMessage = function (msg) {
        console.log('page::' + msg);
    };
    page.open(url, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
        } else {
            console.log("Running tests");
            page.evaluate(function () {
                console.log('0-QUnit is '+((typeof(QUnit)!=='undefined')?"defined":"undefined"));                
                //QUnit.done({ failed, passed, total, runtime });
                QUnit.done = function(r){
                    console.log("CB: "+'Passed: '+r.passed + ', Failed: '+ r.failed + ' Total: '+ r.total+ ' Runtime: '+r.runtime);
                    if (myrunnercallback){
                        myrunnercallback(r);
                    }
                };
            });
            window.setTimeout(function () {
                page.evaluate(function () {
                    console.log('1-QUnit is '+((typeof(QUnit)!=='undefined')?"defined":"undefined"));                
                });
                var result = page.evaluate(function () {
                    console.log('2-QUnit is '+((typeof(QUnit)!=='undefined')?"defined":"undefined"));                
                    $('#qunit-tests').each(function(){
                        // passed
                        $(this).find('>.fail').each(function(){
                            console.log('fail  '+$('.fail .test-message',this).text());
                        })
                    });
                    var result_el = document.getElementById('qunit-testresult');
                    if(typeof result_el !== 'undefined') {
                        try {
                            var passed = result_el.getElementsByClassName('passed')[0].innerHTML;
                            var total = result_el.getElementsByClassName('total')[0].innerHTML;
                            var failed = result_el.getElementsByClassName('failed')[0].innerHTML;
                        } catch(e) {
                            // SHHHHHH
                        }
                        //return 'Passed: '+passed + ', Failed: '+ failed + ' Total: '+ total;
                        return {passed:passed,failed:failed,total:total};
                    }
                });
                console.log('Passed: '+result.passed + ', Failed: '+ result.failed + ' Total: '+ result.total);
                var rc = (result.passed>0)?1:0;
                console.log('test script return code: ' + rc);
                phantom.exit(rc);
            }, 200);
        }
    });
}

