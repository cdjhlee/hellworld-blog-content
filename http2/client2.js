process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var spdy = require('spdy');
var https = require('https');

var agent = spdy.createAgent({
  host: 'localhost',
  port: 8080,
  spdy : {
    plain : false
  }
});

var req = https.get({
  host: 'localhost',
  agent: agent
}, function(response) {
  response.on('data', function(data) {
    console.log('response stream: ' + data.toString('utf-8'));
  });
  response.on('end', function() {
    console.log('response stream end');
  });

  setTimeout(function() {
    agent.close();
  }, 5000); //푸시를 알아보기 위해 5초 뒤에 에이전트를 닫기로 했습니다.
});

req.on('push', function(stream) {
  stream.on('data', function(data) {
    console.log('push stream: '+ data.toString('utf-8'));
  });
  stream.on('end', function() {
    console.log('push stream end');
  });
});
