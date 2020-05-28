var pport = null;
var mport = [];
var wt = [];

var b64chars 
    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var b64tab = function(bin){
    var t = {};
    for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
    return t;
}(b64chars);

var sub_toBase64 = function(m){
	var n = (m.charCodeAt(0) << 16)
	| (m.charCodeAt(1) <<  8)
	| (m.charCodeAt(2)      );
	return b64chars.charAt( n >>> 18)
	+ b64chars.charAt((n >>> 12) & 63)
	+ b64chars.charAt((n >>>  6) & 63)
	+ b64chars.charAt( n         & 63);
};

var toBase64 = function(bin){
    if (bin.match(/[^\x00-\xFF]/)) throw 'unsupported character found' ;
    var padlen = 0;
    while(bin.length % 3) {
        bin += '\0';
        padlen++;
    };
    var b64 = bin.replace(/[\x00-\xFF]{3}/g, sub_toBase64);
    if (!padlen) return b64;
    b64 = b64.substr(0, b64.length - padlen);
    while(padlen--) b64 += '=';
    return b64;
};

var sub_fromBase64 = function(m){
        var n = (b64tab[ m.charAt(0) ] << 18)
            |   (b64tab[ m.charAt(1) ] << 12)
            |   (b64tab[ m.charAt(2) ] <<  6)
            |   (b64tab[ m.charAt(3) ]);
    return String.fromCharCode(  n >> 16 )
        +  String.fromCharCode( (n >>  8) & 0xff )
        +  String.fromCharCode(  n        & 0xff );
};

var fromBase64 = function(b64){
    b64 = b64.replace(/[^A-Za-z0-9\+\/]/g, '');
    var padlen = 0;
    while(b64.length % 4){
        b64 += 'A';
        padlen++;
    }
    var bin = b64.replace(/[A-Za-z0-9\+\/]{4}/g, sub_fromBase64);
    if (padlen >= 2)
        bin = bin.substring(0, bin.length - [0,0,2,1][padlen]);
    return bin;
};

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "priport");
  if (mport.indexOf(port) < 0) {
    mport.push(port);
    port.onDisconnect.addListener(onPDisconnected);
  }
  //mport = port;  

  port.onMessage.addListener(function(msg) {
    if (pport == null)
        connect();     

    if (msg[10] == '0' || msg[10] == '4') {
    /*                
        chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
            function(tabs){
                var url = tabs[0].url;
                var u = 0;
                u = tabs[0].url.indexOf('?');
                if (u > 0)
                    url = tabs[0].url.substring(0, u);
                if (msg[10] == '4')
                    pport.postMessage(msg + "FROMURL=" + toBase64(url));
                else if (wt.indexOf(url) >=0)
                    pport.postMessage(msg);                
            }
        );   
        */

        var url = msg.indexOf("@!@");
        var mg = msg;
        if (url > 0)
            mg = msg.substr(0, url);
        var surl = '';
        if (url > 0)
            surl = msg.substr(url + 3);
        var u = 0;
        u = surl.indexOf('?');
        if (u > 0)
            surl = surl.substring(0, u);
        else if (surl.indexOf("#", surl.length - 1) >= 0)
            surl = surl.substring(0, surl.length - 1);
        if (msg[10] == '4')
            pport.postMessage(mg + "FROMURL=" + toBase64(surl));
        else if (wt.indexOf(surl) >=0)
            pport.postMessage(mg);                
    }
    else
        pport.postMessage(msg);
    //pport.postMessage(msg);    
  });
});

function connect() {
  var hostName = "com.eshbel.priority";  
  pport = chrome.runtime.connectNative(hostName);
  pport.onMessage.addListener(onNativeMessage);
  pport.onDisconnect.addListener(onDisconnected);  
}

function onDisconnected() {  
  pport = null;
}

function onNativeMessage(message) {
  var ms = JSON.stringify(message);
  if (ms != null && ms.length > 23 && ms[19] == '4') {
    var u = fromBase64(ms.substr(23));
    if (u.length > 0 && u[u.length - 1] == '\0')
		u = u.substr(0, u.length - 1);
    if (u[0] == '1' && wt.indexOf(u.substr(1)) < 0)    
        wt.push(u.substr(1));
  }
  var i = 0;
  if (mport != null) {
      if (ms != null && ms.length > 23 && ms[19] == '5' && ms.substr(9, 10) == "BBBBBBBBBB") {
        ms = "BBBBBBBBBB" + fromBase64(ms.substr(23));
      } 
      while (i < mport.length) {        
        mport[i].postMessage({question: ms});
        i++;        
    }
  }  
}

function onPDisconnected(port) {  
  if (mport != null) {
    var ind = mport.indexOf(port);
    if (ind >= 0)
        mport.splice(ind, 1);
    }
}