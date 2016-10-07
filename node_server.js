var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 8000;

http.createServer(function(request, response) {
  var browserName = request.headers['user-agent'];
  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);

  if(browserName.indexOf("Chrome/")>0)    console.log("Request from Google Chrome for "+uri);
  else if(browserName.indexOf("Trident/")>0)    console.log("Request from Internet Explorer for "+uri);
  else if(browserName.indexOf("Firefox/")>0)    console.log("Request from Mozilla Firefox for "+uri);
  else if(browserName.indexOf("Version/")>0)    console.log("Request from Safari for "+uri);

  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");      
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }
     
      //if(request.url.toString().indexOf(".css")>0)  response.writeHead(200, {"Content-Type": "text/css"});
      var mimeType=request.headers['accept'].split(',')[0];
      if(mimeType!='*/*')  response.writeHead(200, {"Content-Type": mimeType.toString()});
      else response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10),function(){console.log("Server is listening at "+port);});
