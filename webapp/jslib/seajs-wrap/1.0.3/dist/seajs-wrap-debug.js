(function(){
/**
 * The Sea.js plugin for loading CommonJS file
 */

var global = window
var wrapExec = {}

seajs.on("resolve", function(data) {
  var id = data.id
  if (!id) return ""

  // avoid seajs-css plugin conflict
  if (/\.css\.js$/.test(id)) {
    return;
  }

  var m = id.match(/[^?]+?(\.\w+)?(\?.*)?$/)
  // not parse those types
  var WhiteListReg = /\.(tpl|html|json|handlebars|css)/i

  if (m && (!WhiteListReg.test(m[1]) || !m[1])) {
    var uri = seajs.resolve(id, data.refUri)
    // avoid seajs-css plugin conflict
    if (/\.css\.js$/.test(uri)) {
      return;
    }
    var query = m[2] || '';
    wrapExec[uri] = function(uri, content) {
      var wrappedContent;
      var CMD_REG = /define\(.*function\s*\(\s*require\s*(.*)?\)\s*\{/;
      if (CMD_REG.test(content) ||
          query.indexOf('nowrap') > 0) {
        wrappedContent= content;
      } else {
        wrappedContent = 'define(function(require, exports, module) {\n' +
                        content + '\n})';
      }
      wrappedContent = wrappedContent + '//# sourceURL=' + uri;
      globalEval(wrappedContent, uri);
    }
    data.uri = uri
  }
})

seajs.on("request", function(data) {
  var exec = wrapExec[data.uri]

  if (exec) {
    xhr(data.requestUri, function(content) {
      exec(data.uri, content)
      data.onRequest()
    })

    data.requested = true
  }
})


// Helpers

function xhr(url, callback) {
  var r = global.ActiveXObject ?
      new global.ActiveXObject("Microsoft.XMLHTTP") :
      new global.XMLHttpRequest()

  r.open("GET", url, true)

  r.onreadystatechange = function() {
    if (r.readyState === 4) {
      // Support local file
      if (r.status > 399 && r.status < 600) {
        throw new Error("Could not load: " + url + ", status = " + r.status)
      }
      else {
        callback(r.responseText)
      }
    }
  }

  return r.send(null)
}

function globalEval(content, uri) {
  if (content && /\S/.test(content)) {
      var fun = global.execScript || function(content) {
      try {
        (global.eval || eval).call(global, content)
      } catch(ex) {
        ex.fileName = uri;
        console.error(ex);
      }
    };
      try{
      fun(content);
      }catch(ex){
          alert(ex['message']+"\n "+uri+"\n IE error see https://www.ascadnetworks.com/Guides-and-Tips/IE-error-%2522Could-not-complete-the-operation-due-to-error-80020101%2522"+"\n or google IE 80020101");
      }
  }
}

define("seajs/seajs-wrap/1.0.2/seajs-wrap-debug", [], {});
})();
