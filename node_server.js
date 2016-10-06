var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 8000;

http.createServer(function(request, response) {
console.log(request.headers['user-agent']);
  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
    //console.log("Requested url : "+request.url.toString());
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
     
      if(request.url.toString().indexOf(".css")>0)  response.writeHead(200, {"Content-Type": "text/css"});
      else response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10),function(){console.log("Server is listening at "+port);});
