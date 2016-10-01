var fs = require('fs');
var spdy = require('spdy');
var options = {
  key: fs.readFileSync('../common/self.key'),
  cert: fs.readFileSync('../common/self.crt')
};

spdy.createServer(options, function(request, response) {
  response.end('Hello world!');
}).listen(8080);
