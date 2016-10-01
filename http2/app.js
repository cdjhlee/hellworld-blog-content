var express = require('express');
var fs = require('fs');
var app = express();

app.get('/', function (req, res) {
  var stream = res.push('/main.js', {
    status: 200, // optional
    method: 'GET', // optional
    request: {
      accept: '*/*'
    },
    response: {
      'content-type': 'application/javascript'
    }
  });
  stream.on('error', function() {
  });
  stream.end('document.write("hello from push stream!");');

  res.send('<script src="/main.js"></script>');
});

app.get('/test', function(req, res) {
  fs.readFile('./resources/test.html', {encoding : 'utf-8'}, function(err, data) {
    if(err) {
      return res.send(err);
    }

    var list = getResourcesFromHtml(data);
    list.forEach(function(obj) {
      var stream = res.push('/' + obj.name, {
        status : 200,
        method : 'GET',
        response : {
          'content-type' : obj.mime
        }
      });
      fs.createReadStream(obj.path).pipe(stream);
    });
    
    res.set('Content-Type', 'text/html');
    res.send(data);
  });
});

function getResourcesFromHtml(html) {
  //하드코딩입니다.
  return [
    {mime : 'image/jpeg', path : './resources/nao.jpg', name : 'nao.jpg'},
    {mime : 'application/javascript', path : './resources/test.js', name : 'test.js'}
 ];
}

module.exports = app;
