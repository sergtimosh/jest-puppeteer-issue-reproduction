var port = null;

if (port == null)
    pconnect();
port.postMessage("BBBBBBBBBB5999TESTTESTTEST");
port.postMessage("BBBBBBBBBB5999TESTTESTTEST");
port.postMessage("BBBBBBBBBB5999TESTTESTTEST");
var injected = false;
var isInstalledNode2 = document.createElement('div');
isInstalledNode2.id = 'priority-extension-is-installed-pre';
document.body.appendChild(isInstalledNode2);

window.addEventListener("message", function(event) {
  if (event.source.parent != window)
    return;

  if (event.data.type && (event.data.type == "FROM_PRIORITY")) {
    if (port == null)
        pconnect();
    var msg = event.data.text;
    if (msg.length > 10 && (msg[10] == '0' || msg[10] == '4'))
        msg = msg + "@!@" + window.location.href;
    port.postMessage(msg);
  }
}, false);

function pconnect() {
  port = chrome.runtime.connect({name: "priport"});
  port.onMessage.addListener(function(msg) {
    if (!injected) {    
        if (msg.question != "BBBBBBBBBB!!!15\t\t!!!NoOlsync") {
            var isInstalledNode = document.createElement('div');
            isInstalledNode.id = 'priority-extension-is-installed';
            document.body.appendChild(isInstalledNode);
            injected = true;
        }
    }
    window.postMessage({ type: "TO_PRIORITY", text: msg.question }, "*");   
  });
  port.onDisconnect.addListener(onPDisconnected);  
}
function onPDisconnected() {  
  port = null;  
}
