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