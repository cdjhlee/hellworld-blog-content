# Node.js에서 HTTP2 이용하기

## HTTP의 버전들, 그리고 HTTP2
※ 제가 어설프게 알아서 실제와는 다를수도 있으니 양해바랍니다.

HTTP 프로토콜은 우리들에게 매우 익숙한 프로토콜입니다. 그래서 이 HTTP 자체에 대한 이야기는 하지 않겠습니다. ~~괜히 뇌피셜 믿고 혼자 뻘소리 하다가 팩트폭력 당하면 좀 거시기하니까요 ㅋㅋ~~
그러나 여기서 끝내면 이 포스팅의 의미가 없으니 HTTP 버전에 대해 이야기를 하고자 합니다. HTTP는 1991년 0.9버전으로 처음 세상에 등장했다고 합니다. 이후 계속 보정되다가 1996년 1.0이 세상에 처음으로 등장합니다. 이후 HTTP는 승승장구 하였으나 이후 웹이 발달함에 따라 기존의 프로토콜로는 성능이 딸리다 판단하여 1999년 1.1로 버전업을 합니다.

### HTTP 1.0과 HTTP 1.1의 차이점?
다른 문서에 좋은 자료들이 많으니 여기선 간략하게만 이야기하겠습니다. 한 마디로 말하면 비연결 프로토콜(Connectionless Protocol)의 단점을 극복하고자 하려는 것입니다. 비연결 프로토콜은 간단하게 말하면 명령을 1회 수행하고 연결을 끊어버리는 방법입니다. 그러다보니 요새 페이지 하나에 파일들 겁나 많은데 그거 다 불러오려면 연결/끊기 무한반복 이하생략... 그래서 한 번 맺은 커넥션을 오래 유지하자는 컨셉으로 1.1이 나온 것입니다.

### SPDY의 등장
HTTP 1.1 버전 업으로 일단 문제점을 틀어막는 데 성공은 했는데 역시나 웹의 발달은 끝이 없기에 HTTP1도 삐걱거리기에 이릅니다. 지금 2016년입니다. 아무튼 그러다보니 ~~제대로 빡친~~ Google이 SPDY라는 프로토콜을 2012년에 내놓습니다. 이 프로토콜은 큰 반향을 불러일으킵니다. 그리고...

### HTTP2의 등장
그리고 HTTP는 ~~어멋! SPDY 멋져!~~ SPDY를 적극 수용하여 2015년에 [RFC 7540](https://tools.ietf.org/html/rfc7540), 즉 HTTP 2.0을 출시합니다. 그러다보니 SPDY와 HTTP2는 거의 같다고 생각하시면 됩니다.

## Node.js에서 http2를 사용해보자
이제 HTTP2가 어쩌다 나왔는 지 대충 훑어봤으니 써봅시다. 그런데 HTTP1 + HTTP1.1 + HTTP2 이거 RFC문서 언제 다 읽습니까? ㅠㅠ 거기다가 HTTP2는 갑자기 바이너리로 넘어가면서 골치아파졌습니다. ~~물론 node.js에 [HTTP2](https://github.com/molnarg/node-http2) 모듈이 나오면서 RFC문서를 ~~읽지 않아도 적당히 읽어도 구현할 수 있게 되었습니다. 이 모듈은 2013년 6월에 첫 릴리즈가 나왔었네요. 한창 SPDY -> HTTP2로 넘어가는 기간이었던 것 같습니다. 현재는 3.3.6입니다.~~
express와 http2 모듈의 호환이 되지 않는 상태라 구관이 명관이라고 다른 라이브러리를 사용하도록 하겠습니다. 바로 [node-spdy](https://github.com/indutny/node-spdy)입니다. 이 모듈은 2011년 6월 24일에 0.1.0이 처음으로 나왔습니다. 위의 모듈보다 더 ~~스타도 많고~~연구가 많이 된 모듈이고, 최근 업데이트로 HTTP2도 지원하는 지라 이를 사용하면 될 것 같습니다.

### 설치 전 주의사항
SPDY 관련 문서들을 읽어보셨다면 아시겠지만 HTTP2는 TLS 위에서 돌아가는 프로토콜입니다. 즉, 인증서가 필수라는 이야기입니다. 인증서를 만드는 법은 다양합니다만 여기서는 맛보기이므로 Self-Signed 인증서를 사용할 예정입니다. 참고로 전 우분투 16.04를 사용합니다.

```bash
$ openssl req -x509 -newkey rsa:4096 -keyout self.key -out self.crt -nodes
```
여기서 self.key는 비밀키, self.crt는 공개키입니다. 이름은 알아서 정하시면 될 것 같습니다. -nodes 플래그를 넣으면 passphrase를 입력하지 않겠다는 의미입니다.

### 간단한 HTTP2 서버 만들기
#### 모듈 설치
```bash
$ npm install spdy
```

#### 간단한 서버 예제
일단 간단한 예제는 공식 github의 예제를 실행 가능하도록 약간 수정하였음을 알려드립니다.
```javascript
var fs = require('fs');
var spdy = require('spdy');
var options = {
  key: fs.readFileSync('/path/to/keyfile'),
  cert: fs.readFileSync('/path/to/certfile')
  //protocols: [ 'h2', 'spdy/3.1', ..., 'http/1.1' ] //HTTP2부터 HTTP1.1 까지 다양합니다.
};

spdy.createServer(options, function(request, response) {
  response.end('Hello world!');
}).listen(8080);
```

#### 확인
HTTP2를 웹 브라우저에서 확인하기 위해선 url scheme를 https로 하면 됩니다.
위의 서버는 다음과 같이 들어갈 수 있습니다.
`https://localhost:8080`
들어가면 다음과 같이 나타납니다.
![웹브라우저로 열어본 페이지](https://cdn.rawgit.com/cdjhlee/hellworld-blog-content/master/http2/resources/http2_web_browser1.png)
※ HTTP2를 지원하지 않는 웹 브라우저는 HTTPS(HTTP 1.1 + TLS)를 사용합니다.
※ 느낌표 표시는 self-signed 인증서를 사용하기 때문에 발생하는 것으로 저건 알아서 하시기 바랍니다.

### 이 사이트는 HTTP2를 지원할까?
1. 사이트 이용하기
[HTTP/2 Test](https://tools.keycdn.com/http2-test) 이 사이트를 이용하여 테스트를 할 수 있습니다. public을 체크할 경우 누가 어딜 체크했는 지 메인페이지에 보입니다.
2. 플러그인 이용하기
Chrome을 사용하신다면 다음 플러그인을 이용하여 확인하실 수 있습니다.
사용법: [Tools for debugging, testing and using HTTP/2](https://blog.cloudflare.com/tools-for-debugging-testing-and-using-http-2/)
플러그인 주소: [HTTP/2 and SPDY indicator](https://chrome.google.com/webstore/detail/http2-and-spdy-indicator/mpbpobfflnpcgagjijhmgnchggcjblin)
이 플러그인을 이용하면 번개모양이 옆에 생기는데요. 번개 색깔에 따라 뭘 쓰는 지 알 수 있습니다.
- 빨간색: QUIC <- 구글에서 요새 만들고 있는 UDP 기반의 HTTP 프로토콜입니다.
- 파란색: HTTP/2
- 초록색: SPDY
- 기타: 미사용

### express랑 spdy랑 같이 써보자
express가 node.js에서 가장 유명한 웹 프레임워크인 건 누구든 아실겁니다. 그러니 설명은 패스하고 어떻게 돌릴 수 있나부터 봅시다.

#### app.js 코드
이 코드는 [Express "Hello World" example](http://expressjs.com/en/starter/hello-world.html)을 약간 수정하였습니다.
```javascript
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

module.exports = app;
```

#### 시작용 코드
```javascript
var fs = require('fs');
var spdy = require('spdy');
var app = require('./app');
var options = {
  key: fs.readFileSync('../common/self.key'),
  cert: fs.readFileSync('../common/self.crt')
};

spdy.createServer(options, app).listen(8080);
```

잠깐 소개했던 node-http2 모듈에서는
```
_stream_readable.js:511
    dest.end();
         ^

TypeError: dest.end is not a function
    at Stream.onend (_stream_readable.js:511:10)
    at Stream.g (events.js:291:16)
    at emitNone (events.js:91:20)
    at Stream.emit (events.js:185:7)
    at endReadableNT (_stream_readable.js:974:12)
    at _combinedTickCallback (internal/process/next_tick.js:74:11)
    at process._tickCallback (internal/process/next_tick.js:98:9)
```
API 요청 시 위의 에러가 발생하는 이슈가 있으므로 대신 [node-spdy](https://github.com/indutny/node-spdy) 모듈을 사용하시면 될 것 같습니다.

## Client를 사용해보자
node.js에는 [request](https://github.com/request/request) 라는 걸출한 http 클라이언트 라이브러리가 있습니다만 ~~Promise도 지원하지 않고~~ HTTP2를 지원하지 않습니다. http2를 사용해서 하는 법을 아시는 분은 제보 부탁드립니다.

### spdy client를 이용하여 구글에 요청해보자
제일 만만한 게 구글이죠. 구글에 요청하는 코드를 만들어보겠습니다. 이 코드는 node-spdy 저장소의 예제를 약간 변형하였음을 알려드립니다.
```javascript
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //self-signed인 로컬 서버에 요청하는 것이므로 이 설정을 걸어줍시다

var spdy = require('spdy');
var https = require('https');

var agent = spdy.createAgent({
  host: 'localhost',
  port: 8080,
  spdy : {
    plain : false	//secure를 사용하므로 false를 해줍시다.
  }
});

https.get({
  host: 'localhost',
  agent: agent
}, function(response) {
  //response는 stream입니다.
  //다 끝났으면 agent를 닫아주세요
  agent.close();
}).end();
```

여기까지 뭔가 맹~ 하다 싶은 면이 있을겁니다. 이 놈이 http2로 붙은건지 http1.1로 붙은 건지도 모르겠고 내가 제대로 한 거 맞나? 이런 심정이 들 겁니다. 그래서 조금 더 실감하기 좋은 server push를 사용해보기로 하였습니다.

## Server Push 기능 사용하기
### Server push?
http2의 가장 강력한 특징 중 하나는 server push입니다. 서버에서 파일을 클라이언트에게 바로 밀어넣는 무시무시한 기능입니다. http가 request -> response 라는 개념이 박살나버린 것이죠. 이 정체불명의 기능을 한 번 맛보기로 실험해보기로 하였습니다.

### app.js를 수정해보자
아까 만들었던 app.js를 수정해보도록 하겠습니다. 역시나 공식 홈페이지의 예제를 적당히 수정한 것입니다.
```javascript
var express = require('express');
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

module.exports = app;
```
다시 실행해봅시다. 이젠 무슨 일이 일어났는 지 감도 안옵니다. 네트워크를 보면 난 분명히 / 만 때렸는데 뜬금없이 main.js가 같이 옵니다. 웹 브라우저로 확인해 본 결과 다음과 같습니다.
![server push를 사용한 가벼운 결과](https://cdn.rawgit.com/cdjhlee/hellworld-blog-content/master/http2/resources/http2_web_browser2.png)

### 클라이언트 코드로 보자
어떤 느낌인 지 좀 더 raw하게 알아보기 위해 client 코드를 약간 수정해봅시다. 역시나 이 코드 또한 공식 예제의 코드를 조금 실행 가능하도록 바꾼 것입니다.
```javascript
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
  }, 5000); //푸시가 작동함을 확인하기 위해 5초 뒤에 닫아보겠습니다.
});

req.on('push', function(stream) {
  stream.on('data', function(data) {
    console.log('push stream: '+ data.toString('utf-8'));
  });
  stream.on('end', function() {
    console.log('push stream end');
  });
});
```

결과는 다음과 같습니다.
```
response stream: <script src="/main.js"></script>
push stream: document.write("hello from push stream!");
response stream end
push stream end
```
보시면 알겠지만 response 스트림과 push 스트림이 따로 놀고 있습니다. 즉, 방금 요청은 순차 처리가 아닌, 푸시에 의한 별도 요청임을 알 수 있습니다.

### 초간단 응용 - 리소스 요청 없이 server push를 사용하여 html 파일 빠르게 불러오기
주의. 이 코드는 검증이 되지 않았으므로 사용하다 발생한 상황에 대해 책임지지 않음을 알려드립니다.

한 번 대충 서버푸시를 써보도록 하겠습니다. 누가 나중에 래핑해서 쓰기 쉽게 내놨으면 좋겠습니다. 아니면 알고 있으시다면 제보 부탁드립니다.

#### 리소스 파일 만들기
1. test.html
```html
<DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    <h1>테스트용 html 파일입니다</h1>
    <img id="img" src="nao.jpg">
    <script src="test.js"></script>
  </body>
</html>
```

2. test.js
```javascript
document.getElementById('img').onload = function() {
  alert('으헿');
};
```

3. app.js

```javascript
...
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
...
```
급하게 짜느라 너무 무식하게 나왔습니다.

#### 실행 결과
![실행 결과](https://cdn.rawgit.com/cdjhlee/hellworld-blog-content/master/http2/resources/http2_web_browser3.png)


## 글을 마치며
여기까지 node.js를 이용하여 간단하게 http2를 써봤습니다. node-spdy 라이브러리를 이용하여 간단하게 서버, 클라이언트를 작성하고 express와 연동도 해봤고, 서버 푸시 기능도 간략하게 사용해 보았습니다. 이미 다른 분들께서는 실무에서 모든 기능을 잘 사용하고 계시겠지만 혹시나 http2를 처음 사용하시는 분들이 계시다면 이 글이 조그마한 보탬이 되었으면 좋겠습니다. 이상 글을 마치겠습니다. 고맙습니다.

## 다음에 더 진도를 나간다면?
~~그럴 일은 없겠지만~~ 만약 더 알아본다고 하면 nginx와 한 번 붙여볼 생각입니다. 잘 될런지는 모르겠습니다만...

## 참고 문헌
[HTTP:Brief History of HTTP](https://hpbn.co/brief-history-of-http/)
[SPDY는 무엇인가? in naver D2](http://d2.naver.com/helloworld/140351)
[HTTP/2 in Wikipedia](https://en.wikipedia.org/wiki/HTTP/2)
[indutrny/node-spdy in Github](https://github.com/indutny/node-spdy) - SPDY라고 당황하지 마세요. http2도 지원합니다.
[molnarg/node-http2 in Github](https://github.com/molnarg/node-http2) - Express 관련 이슈가 있어서 보류하시는 게 좋을 것 같습니다.
[How to create a self-signed certificate with openssl? in stackoverflow](http://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl)
[HTTP/2 Test](https://tools.keycdn.com/http2-test)
[Tools for debugging, testing and using HTTP/2](https://blog.cloudflare.com/tools-for-debugging-testing-and-using-http-2/)
[HTTP/2 and SPDY indicator](https://chrome.google.com/webstore/detail/http2-and-spdy-indicator/mpbpobfflnpcgagjijhmgnchggcjblin)