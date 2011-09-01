// alias phantomjs=/Applications/phantomjs.app//Contents/MacOS/phantomjs
// phantomjs siteify.js |tee siteify.log; tail -1 siteify.log >siteify.json
// var page, address, output, size;

var allSites = ['axialdev'];
//var allSites = ['axialdev','sebastien', 'estrimont', 'lepresident'];
var sitesFetched=false;
var renderedSites=[];

if (phantom.args.length > 0) {
    console.log('Usage: siteify.js');
    phantom.exit();
} else {
    
    function render(status) {
        if (status !== 'success') {
            console.log('Unable to load the address:'+status);
            console.log('Page address is ' + page.evaluate(function(){return ''+window.location;}));
            //eatParts();
        } else {
            console.log('  got: '+page.evaluate(function(){return ''+window.location;}));
            window.setTimeout(function () {
                page.evaluate(function(){
                    window.pagesLeft=[]; 
                    $('div[data-role=page]').each(function(){
                        pagesLeft.push($(this).attr('id') )
                    });
                    pagesLeft = pagesLeft.filter(function(val){ return (val!='photozoom' && val!='splash');});
                });

                var renderingSite = renderedSites[renderedSites.length-1];
                renderingSite.pages=[];
                while (true) {
                    renderedPgId = page.evaluate(function(){
                        if (pagesLeft.length==0) return '';

                        $.mobile.defaultPageTransition='none';
                        var pgId = pagesLeft.shift();
                        $.mobile.changePage('#'+pgId);
                        return pgId;
                    });
                    if (renderedPgId==='' || renderedPgId==null ) break;
                    imageName = output+'-'+renderedPgId+'.png';
                    console.log('  rendering '+imageName);
                    page.render(imageName);
                    renderingSite.pages.push(imageName);
                }

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

                eatSite();

            }, 500);
        }
    }

    function eatSite(){
        console.log('\n*** Remaining sites '+JSON.stringify(allSites)+'\n');
        if (allSites.length>0){
            address = allSites.shift();
            renderedSites.push({name:address});
            output='img/'+address;
            //address = 'http://'+address+'.ekomobi.com/';
            address = 'http://ekomobi.dev.axialdev.net/mobile.html?site='+address;
            var url = address;
            console.log('  fetch: '+url);
            
            page = new WebPage();
            page.onConsoleMessage = function (msg) {
                console.log(msg);
            };
            page.viewportSize = { width: 320, height: 480 };
            page.open(url, render );

        } else {
            console.log('we are done done: ');
            console.log(JSON.stringify(renderedSites));
            phantom.exit();
        }
    }
    eatSite();
    
}