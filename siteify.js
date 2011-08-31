// alias phantomjs=/Applications/phantomjs.app//Contents/MacOS/phantomjs
// phantomjs thumbify.js file://`pwd`/ekothumb.html
// phantomjs thumbify.js http://test.ekomobi.dev.axialdev.net/ coco.png
// sips --resampleWidth 120 coco.png --out small-coco.png
var page, address, output, size;

var allSites = ['axialdev'];
var sitesFetched=false;
var globalPart;

if (phantom.args.length > 0) {
    console.log('Usage: thumbify.js URL output(.png)');
    phantom.exit();
} else {
    address = phantom.args[0];
    output = phantom.args[1];
    function render(status) {
        if (status !== 'success') {
            console.log('Unable to load the address:'+status);
            console.log('Page address is ' + page.evaluate(function(){return ''+window.location;}));
            //eatParts();
        } else {
            console.log('  got: '+page.evaluate(function(){return ''+window.location;}));
            //document.write('<script type="text/javascript" src="http://code.jquery.com/mobile/1.0b1/jquery.mobile-1.0b1.min.js"><\/script>');
            window.setTimeout(function () {
                page.render(output+'-'+globalPart+'.png');
                console.log('  rendered '+output+'-'+globalPart+'.png');
                if (globalPart=='home'){
                    var pages = page.evaluate(function(){ 
                        var pgs=[]; 
                        $('div[data-role=page]').each(function(){
                            pgs.push($(this).attr('id') )
                        }); 
                        return pgs;
                     });
                    pages = pages.filter(function(val){ return (val!='photozoom' && val!='home');});
                    parts = parts.concat(pages);
                    
                    if (!sitesFetched){
                        var sites = page.evaluate(function(){ 
                            var sites=[]; 
                            var o = $.ajax({  
                              url: '/api/site', 
                              dataType: 'json',  
                              async: false,  
                              success: function(otherSites){
                                  otherSites.forEach(function(site){
                                     sites.push(site.name); 
                                  });
                              }
                            });
                            sites = sites.filter(function(val){ return (val!='axialdev');});
                            return sites; 
                        });
                        allSites = allSites.concat(sites);
                        sitesFetched = true;
                    }
                }
                eatParts();
            }, 500);
        }
    }

    function eatParts(){
        console.log('* Remaining pages '+JSON.stringify(parts));
        if (parts.length>0){
            globalPart = parts.shift();
            var url = address+'#'+globalPart;
            console.log('  fetch: '+url);
            
            page = new WebPage();
            page.onConsoleMessage = function (msg) {
                console.log(msg);
            };
            page.viewportSize = { width: 320, height: 480 };
            page.open(url, render );
        } else {
            console.log('we are done for the site: '+address);
            eatSite();
        }
    }    
    function eatSite(){
        console.log('\n*** Remaining sites '+JSON.stringify(allSites)+'\n');
        if (allSites.length>0){
            address = allSites.shift();
            output='img/'+address;
            address = 'http://'+address+'.ekomobi.com/';
            parts=['home'];
            eatParts();
        } else {
            console.log('we are done done: ');
            phantom.exit();
        }
    }
    eatSite();
}