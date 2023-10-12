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

- 이메일 인증을 통한 회원가입과 이메일 로그인
- 회원 정보 조회, 수정, 탈퇴, 로그아웃
- 쿠키와 JWT 토큰을 이용한 유저 인증과 유저와 관리자를 구분하는 RBAC
- 관리자 계정만 접근 가능한 상품과 주문 관리를 위한 관리자 페이지
- 전체 상품 조회, 카테고리별 상품 조회, 상품 등록 및 수정, 삭제
- 전체 주문 조회, 배송 상태 관리 및 주문 삭제
- 장바구니 관리(등록, 수정, 삭제)
- 상품 상세 페이지에서 장바구니 추가 및 주문하기
- 최신순, 상품 등록순, 가격 높은순, 낮은순으로 상품 정렬 및 페이지네이션
- 비회원 주문, 주문 조회
- 주소 찾기 (결제 페이지)

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
