# 매우 짧은 팁
## 업데이트 내역
2016-10-22 첫 문장 작성

## 1. webpack 돌렸더니 generator(async/await)가 작동하지 않는다면?
1. `babel-polyfill` 을 설치한다.
```bash
$ npm install --save-dev babel-polyfill
or
$ yarn add --dev babel-polyfill
```
2. `webpack.config.js`의 entry에 `babel-polyfill`을 추가한다.
```javascript
...
  entry: ['babel-polyfill', ... ],
...
```

## 2. koa-router를 분명 제대로 사용하였는데 app.use() requires a generator function이 나를 괴롭힐 때
1. node.js <= 6, koa <= 1 일 때
koa-router의 버전을 5.x로 낮춘다.
```
$ npm install koa-router@^5
or
$ yarn add koa-router@^5
```

2. node.js >= 7, koa >= 일 때
[https://github.com/alexmingoia/koa-router/tree/master/](https://github.com/alexmingoia/koa-router/tree/master/)
[https://github.com/koajs/koa/tree/2.0.0-alpha.3](https://github.com/koajs/koa/tree/2.0.0-alpha.3)
위 링크들을 참고하여 koa2에 맞춰서 migration을 한다

