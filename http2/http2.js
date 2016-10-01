var fs = require('fs');
var http2 = require('http2');
var options = {
  key: fs.readFileSync('../common/self.key'),
  cert: fs.readFileSync('../common/self.crt')
};

http2.createServer(options, function(request, response) {
  response.end('Hello world!');
}).listen(8080);
