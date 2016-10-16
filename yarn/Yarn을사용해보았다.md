#\[node.js\]Yarn을 사용해보았다

## Yarn 공식 홈페이지
[Yarn](https://yarnpkg.com/)

## Yarn 소개글
[Outsider님 트위터](https://twitter.com/outsideris?lang=ko) 리스트 쭈욱 내리면 나옵니다
[페이스북 블로그](https://code.facebook.com/posts/1840075619545360) 페이스북 블로그에서 소개하는 글입니다.

## 소개
Yarn은 npm 쓰다가 ~~빡친~~불만을 가진 사람들이 만든 node.js 패키지 매니저입니다. 개발진이 페이스북, 구글 등 짱짱한 회사들 사람이라고 하네요. 하필 YARN이 하둡에서도 쓰이는지라 구글 검색하면 죄다 하다둡 글만 나옵니다. 저도 모르고 있다가 소개글을 다른 분께 듣고 알게 되었습니다. 그리고 한 번 시범삼아 사용해보고 글을 작성해보고자 합니다.

## Yarn의 버전?
현재 [Yarn](https://github.com/yarnpkg/yarn)은 2016년 10월 11일에 0.15.0이 나왔습니다. 첫 버전은 0.2.0으로 2016년 06월 18일에 나왔네요. 그럼에도 불구하고 Star가 13056개(한국시각 10월 14일 기준)입니다. 짧은 시간 내에 어마어마한 인기를 끌었다고 할 수 있겠습니다. 그러면 얘는 무슨 매력이 있길래 이렇게 인기가 있는 지 직접 써보면서 알아보기로 했습니다.

## Yarn을 설치해보자
[Installation | Yarn](https://yarnpkg.com/en/docs/install) 에 정확한 내용이 있습니다.
### 우분투에서 설치하기
데비안/우분투 계열에서는 다음과 같이 패키지 정보를 추가하라고 합니다.
```
sudo apt-key adv --keyserver pgp.mit.edu --recv D101F7899D41F3C3
echo "deb http://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
```
그리고 이렇게 설치하시면 됩니다.
```
sudo apt-get update && sudo apt-get install yarn
```

### 그냥 깔기
root를 쓸 수 없는 환경에서 사용하는 방법이라고 할 수 있겠습니다. 그 중 tarball 파일을 받아서 설치하는 법을 보겠습니다. 위의 Installation 페이지에서 Alternative 탭에 들어가시면 다운로드 받을 수 있습니다. [퀵링크](https://yarnpkg.com/latest.tar.gz) 그 다음 적절한 폴더에 압축을 푸시면 되겠습니다. 홈페이지에선 /opt 에 설치했네요. 압축을 풀면 dist 라는 폴더가 나오는데 얘를 적절하게 **yarn-버전명** 폴더로 바꿔줍시다. 그리고 그 폴더의 bin 폴더에 있는 yarn을 실행해주면 되겠습니다. 이 때엔 PATH 설정 잡아주는 걸 잊지 않으시면 될 것 같습니다.

### npm으로 깔기
난 apt 리스트를 더럽히고 싶지 않다거나 npm이 더 다루기 쉽다고 하면 npm으로 설치하시면 됩니다.
```bash
$ sudo npm install --global yarn
```

## Yarn으로 패키지를 설치해보자
[Usage | Yarn](https://yarnpkg.com/en/docs/usage) 에 정확한 내용이 있습니다.

### 프로젝트 시작하기
```
yarn init
```
이렇게 입력하면 `npm init`과 같은 명령을 물어보고 대답이 끝나면 **package.json** 파일이 생성됩니다. 맨 마지막에 너가 몇 초동안 고민했나 보여주는 Done in XX.XXs. 가 인상깊군요.

### 의존성 추가하기
```
yarn add [package]
yarn add [package]@[version]
yarn add [package]@[tag]
```
`npm install --save` = `yarn add` 이렇게 생각하시면 될 것 같습니다. 뒤에서 말하겠지만 yarn은 npm 저장소와 bower 저장소를 같이 바라보고 있습니다. 그리고 이 명령은 하나만 되는 게 아니라 저 뒤로 줄줄이 소세지로 묶어서 라이브러리들을 입력할 수 있습니다. 한 번 hapi를 추가해보겠습니다. 요즘 개인프로젝트에 hapi를 쓸까 고려중이라서요. `yarn add hapi` 로 설치해봅시다.
※ 여기서 npm과 비교해봅시다. 후술하겠지만 재설치 시에는 yarn이 캐시처리를 하기 때문에 yarn이 압도적으로 라이브러리를 빨리 설치합니다. 그러니 초기 설치로 속도를 비교해보겠습니다. 리눅스에선 `time` 이라는 쓰기 좋은 명령이 있으니 대충 비교해봅시다. 참고로 제가 사용한 npm 버전은 3.10.8 입니다. 결과는 다음과 같이 나왔네요.
```
real	0m3.550s
user	0m1.760s
sys	0m0.124s
```
이제 yarn으로 비교해보겠습니다. 명령은 `yarn add hapi` 입니다.
```
real	0m5.202s
user	0m1.156s
sys	0m0.148s
```
라이브러리 하나 설치하는데는 의외로 yarn이 오래걸리네요. 처음에 의존성 검사를 할 때 정교하게 해서 그런 게 아닐까 싶습니다. 처음에 yarn.lock 파일이 없으면 yarn.lock 파일을 생성하고 이 파일을 참고함을 알 수 있습니다. 캐시만 지우고 yarn.lock을 남기면 1/4 과정이 생략되는 걸 볼 수 있을 것입니다. 하지만 yarn의 진면목은 재설치 or 여러 개 설치에서 나옵니다.

#### 옵션들
[yarn add | Yarn](https://yarnpkg.com/en/docs/cli/add)에 자세히 나와있습니다. 대표적으로 --dev 플래그는 devDependencies에 추가, --peer은 peerDependencies에 추가, --optional은 optionalDependencies에 추가해줍니다.

#### 캐시 지우기
~~역시나 후술하겠지만 yarn은 버전별로 캐시를 하기 때문에 재설치 시 속도가 매우 빠릅니다. 저는 성능 체크를 위해 지우도록 하겠습니다. apt-get으로 까셨다면 `/usr/share/yarn` 에 있을 것이고 npm으로 설치하셨다면 `$HOME/.yarn-cache` 에 있을 것입니다. 전 npm으로 깔았음을 알려드립니다.~~
``` yarn cache clean``` 을 이용하시면 됩니다. 굳이 저 위의 경로에 들어가서 파일들 지울 필요 없습니다.


### 의존성 지우기
```
yarn remove [package]
```
얘는 뭐 설명 안해도 될 거 같으니 넘어가겠습니다.

### 모든 의존성 설치하기
여기서는 React 프로젝트의 의존성 라이브러리들을 설치해보도록 하겠습니다. 저와 package.json의 dependency는 [VELOPORT.LOG](https://velopert.com/814)에서 가져왔음을 알려드립니다.
```json
...
  "dependencies": {
    "react": "^0.14.7",
    "react-dom": "^0.14.7"
  },
  "devDependencies": {
    "babel-core": "^6.7.0",
    "babel-loader": "^6.2.4",
    "babel-preset-es2015": "^6.6.0",
    "babel-preset-react": "^6.5.0",
    "webpack": "^1.12.14",
    "webpack-dev-server": "^1.14.1"
  }
...
```
yarn 명령은 다음과 같습니다.
```
yarn
```
역시나 npm과 yarn의 속도를 비교해보도록 하겠습니다. 먼저 npm의 결과는 다음과 같습니다.
```
real	0m38.299s
user	0m11.236s
sys	0m0.940s
```
yarn을 볼까요?
```
real	0m10.181s
user	0m7.448s
sys	0m1.200s
```
다수의 라이브러리를 설치할 때에 yarn의 진면목이 드러납니다. 거기에 캐싱까지 되기 때문에 차후 중복되는 모듈 설치 시 더 빠른 속도를 보여주게 될 것입니다.

## Yarn의 특징
보통 특징을 먼저 이야기하는데 전 설치부터 글을 써버렸네요. 이제 특징을 알아봅시다. 공식 홈페이지에서는 다음과 같은 특징을 걸고 있습니다.
### Ultra Fast(X나 빠름)
캐싱하고 있어서 빠르다는 겁니다.

### Mega Secure(매우 안전함)
checksum 검사를 한다고 합니다.

### Super Reliable(레알 믿을 수 있음)
자세하지만 간결한 lockfile 포맷과 결정론(deterministic, 어떻게 해석하죠..) 알고리즘을 프로그램 설치에 사용합니다.

### Offline Mode
역시 캐싱을 해서 그런지 기존에 설치한 패키지를 다시 설치할 때 인터넷을 쓰지 않아도 된다는 의미입니다.

### Deterministic
같은 패키지를 설치할 때에 어떤 환경에서도 같은 방법으로 설치한다는 의미입니다.

### Network Performance
효과적인 메시지 큐잉과 request waterfall을 피해서 최고의 효율을 낸다고 합니다.

### Multiple Registries
npm과 bower를 같이 사용한다고 합니다.

### Network Resilience
요청이 실패해도 다시 시도합니다.

### Flat Mode
npm이 3으로 올라가면서 갖는 가장 큰 특징이 여기에도 적용되어있습니다. 모든 라이브러리의 의존성을 검사해서 중복 설치를 피합니다.

이렇게 소개글을 날로 먹었습니다! Yarn이 어떻게 돌아가고 등등 자세한 내용은 [Documentation | Yarn](https://yarnpkg.com/en/docs/)을 참고하시기 바랍니다.

## 결론
Yarn은 위에서 이야기 하였듯이 4개월이 되기 전에 npm의 star를 돌파하는 무시무시한 주목을 받은 프로젝트입니다. npm보다 빠른 속도로 의존성 라이브러리들을 설치하고 싶으시다면 이 프로젝트를 사용해보시면 좋을 것 같습니다.

## 기타 - yarn why
yarn엔 굉장히 독특한 명령이 하나 있습니다. why인데요. 얘를 이용하면 왜 이 라이브러리가 쓰였는 지 알 수 있다고 합니다. 라이브러리의 용량, 의존성 등을 설명해줍니다. yarn.lock를 보거나 node_modules 폴더를 봤을 때 이녀석이 왜 깔려있는 지 궁금할 때 사용하시면 유용할 것 같습니다. 특정 라이브러리의 버전이 업데이트 되면서 충돌나는 현상 등에 대해 유용하게 대처할 수 있을 것으로 보입니다.

## 같이 찾아볼 문서
[Yarn: A new package manager for Javascript](https://code.facebook.com/posts/1840075619545360) <- 이 패키지를 소개하는 페이스북 개발 블로그입니다.