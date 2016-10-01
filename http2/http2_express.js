var fs = require('fs');
var spdy = require('spdy');
var app = require('./app');
var options = {
  key: fs.readFileSync('../common/self.key'),
  cert: fs.readFileSync('../common/self.crt')
};

spdy.createServer(options, app).listen(8080);
