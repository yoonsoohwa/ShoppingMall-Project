# [Re: birth](http://kdt-sw-6-team02.elicecoding.com/)

안녕하세요! 저희 엘리스 2팀의 **Re: birth**는 낡고 버려진 물건들을 되살리는 업사이클링 쇼핑몰입니다.  
업사이클링의 매력과 가치를 **Re: birth**에서 경험해보세요!  
더 나은 환경과 지속 가능한 미래에 대한 생각에서 출발한 **Re: birth**는 오늘의 불필요한 것들이 내일의 보물이 될 수 있다는 생각과 함께 업사이클링을 통해 새로운 가치를 창조합니다.  
지속 가능한 소비와 창조, 새로운 미래를 위한 시작을 **Re: birth**에서 함꼐해보세요.

![QR](./QR_code.png)

## 목차

- [기술 스택](#기술-스택)
- [구현 기능](#기능)
- [트러블 슈팅](#트러블-슈팅)

## 기술 스택

- Html, Css, Javscript
- Node.js, Express.js, MongoDB

## 기능

- 유저 인증 및 계정 관리 (로그인, 회원가입)
- 이메일 인증을 통한 회원가입
- 쿠키와 JWT 토큰을 사용한 RBAC
- 상품과 주문 관리를 위한 관리자 페이지
- 카테고리별 상품 조회
- 장바구니를 이용한 주문
- 배송 관리 및 배송 정보
- 최신순, 추천순의 상품 필터링

## 트러블 슈팅

### **CORS** 에러

- **원인**: `app.js` 파일에 `app.use(cors())` 를 넣어놓은 상태였음에도 발생한 **CORS 에러**가 발생했다.  
  client 쪽에서 불러오는 리소스가 **'local' address space**가 아닌 더 **'private'** 한 곳에 있어야 한다는 내용이었다.  
  구글링을 해보니 **origin보다 더 낮은 수준의 네트워크로 요청**을 보내는 경우 이 에러가 발생한다고 했고 우리의 경우 **Private Address(vm의 ip주소)** 에서 **Local Address(localhost)** 요청을 보내고 있었다.  
   (`fetch` 함수가 `http://localhost:5001/api/v1/...`의 URL로 요청을 보내고 있었음)
- **해결**: 프론트 분들께도 이 사실을 알려드리고 `fetch` 인자를 모두 `/api/v1/...`의 URI 형식으로 바꾸어 해결하였다.
- 참조: [관련 블로그](https://velog.io/@tjdals9638/The-request-client-is-not-a-secure-context-and-the-resource-is-in-more-private-address-space)  
  ![CORS](https://velog.velcdn.com/images/limelimejiwon/post/4d4888e7-63d3-4a5b-9ccb-46a560be9fad/image.png)  
  출처: https://velog.io/@limelimejiwon/CORS-%EC%97%90%EB%9F%AC-%EC%82%BD%EC%A7%88-%EC%8B%9C%EC%9E%91
