'use strict'
var UAParser = require('ua-parser-js');
var parser = new UAParser();


function result(req){
       var ua = req.headers['user-agent'];      
       
        var ip = req.headers["x-forwarded-for"];       
        var language = req.headers["accept-language"].slice(0,5);
        var vendor = parser.setUA(ua).getDevice().vendor;
        var architecture = parser.setUA(ua).getCPU().architecture;
        var os= parser.setUA(ua).getOS().name + ' ' + parser.setUA(ua).getOS().version;
        var browser = parser.setUA(ua).getBrowser().name;
        if (typeof(vendor) === 'string') {var software =  vendor + ' ' +architecture + ' ' + os + ' '+ browser  }
        else { var software = architecture + ' ' + os + ' '+ browser }
        var ans = {"ipaddress" : ip,
                   "language"  : language,
                   "software": software    
                  }
        console.log(ans);
}
module.exports = result