# IT 기술 퀴즈 웹 애플리케이션 (Tech Quiz App)

본 프로젝트는 IT 기술 지식을 테스트할 수 있는 반응형 웹 애플리케이션입니다. 사용자는 회원가입 및 로그인을 통해 '코딩(JavaScript/알고리즘)' 및 '컴퓨터 구조'에 관련된 다양한 유형의 퀴즈를 풀고, 실시간으로 랭킹 보드에 점수를 기록할 수 있습니다.

이 프로젝트는 Vanilla JavaScript와 Firebase(BaaS)를 사용하여 SPA(Single Page Application)로 구현되었으며, AI 페어 프로그래밍(Vibe Coding) 방법론을 통해 개발되었습니다.

---

## 주요 기능 소개

1. **사용자 인증 (Firebase Authentication)**
   * **C (Create):** 이메일과 비밀번호(6자리 이상)를 사용한 회원가입 기능.
   * **R (Read):** 기존 사용자를 위한 로그인 기능.
   * **U (Update):** 로그아웃 기능.
   * **R (Read):** `onAuthStateChanged`를 통한 실시간 로그인 상태 감지 및 뷰 자동 전환.

2. **랜덤 퀴즈 엔진**
   * **랜덤 문제 출제:** 전체 25개 문제 중 매번 10개 문제를 Fisher-Yates 셔플 알고리즘으로 랜덤 선택.
   * **다양한 문제 유형:** 객관식(Radio), 빈칸 채우기(Text) 문제를 동적으로 렌더링합니다.
   * **코드 스니펫 지원:** `<pre>` 및 `<code>` 태그를 활용하여 가독성 높은 코드 문제를 출제합니다.
   * **채점 시스템:** 객관식 및 빈칸 채우기(공백/대소문자 무시) 자동 채점 시스템.

3. **실시간 랭킹 보드 (Cloud Firestore)**
   * **C (Create):** 퀴즈 완료 시, 로그인된 사용자의 점수를 Firestore `scores` 컬렉션에 즉시 저장합니다.
   * **R (Read):** 랭킹 페이지에서 모든 사용자의 점수를 내림차순으로 정렬하여 실시간으로 조회합니다.
   * **로컬 모드 지원:** Firebase 연결 없이도 localStorage를 통한 오프라인 랭킹 시스템.

4. **반응형 SPA (Single Page Application)**
   * 단일 `index.html` 파일 내에서 `.hidden` 클래스를 제어하여 홈, 로그인, 퀴즈, 랭킹 뷰를 전환합니다.
   * Flexbox와 Media Query를 사용하여 모바일, 태블릿, 데스크톱 모든 환경을 지원하는 반응형 UI를 구현했습니다.
   * 게스트 모드 지원으로 로그인 없이도 퀴즈 참여 가능.

---

## ⚙️ 설치 및 실행 방법

**1. 로컬에 저장소 복제 (Clone)**

```bash
git clone https://github.com/jaehun-213/quiz_app.git
cd quiz_app
```

**2. Firebase 설정 (선택사항)**

본 프로젝트는 Firebase 연결 없이도 로컬 모드로 작동합니다. Firebase 기능을 사용하려면 다음 단계를 따르세요:

- Firebase 콘솔에서 새 프로젝트를 생성합니다.
- 웹 앱(</>)을 추가하고 firebaseConfig 객체를 복사합니다.
- `src/index.html` 파일의 Firebase 설정 부분에 복사한 설정을 붙여넣습니다.

**3. 로컬 서버로 실행 (필수!)**

본 프로젝트는 ES6 모듈(import/export)을 사용하므로, file:/// 프로토콜에서는 작동하지 않습니다. 반드시 로컬 서버로 실행해야 합니다.

**(추천) VS Code 'Live Server' 확장 프로그램 사용:**
- VS Code에서 Live Server 확장을 설치합니다.
- `src/index.html` 파일을 우클릭한 뒤, [Open with Live Server]를 선택합니다.

**Python 서버 사용:**
```bash
# 프로젝트 루트 폴더에서
python -m http.server 8000
```
이후 브라우저에서 `http://localhost:8000/src/index.html`로 접속합니다.

---

## 기술 스택 (Tech Stack)

**Frontend:**
- HTML5 (시맨틱 태그)
- CSS3 (Flexbox, Grid, Media Query, 글래스모피즘 효과)
- JavaScript (ES6+) (Vanilla JS, DOM 조작, 모듈 시스템)

**Backend (BaaS):**
- Firebase Authentication (사용자 인증)
- Cloud Firestore (랭킹 데이터 저장)

**Development:**
- Git & GitHub (버전 관리)
- Python HTTP Server (로컬 개발 환경)

---

## 스크린샷

### 홈 화면
```
┌─────────────────────────────────────┐
│           IT 기술 퀴즈               │
│     당신의 IT 지식을 테스트해보세요!    │
│                                     │
│  [게임 시작] [랭킹 보기] [로그인]     │
│                                     │
│  📚 다양한 문제    🏆 실시간 랭킹     │
│  ⚡ 빠른 피드백                     │
└─────────────────────────────────────┘
```

### 퀴즈 화면
```
┌─────────────────────────────────────┐
│ 문제 1/10    점수: 0    진행률: 10%   │
│                                     │
│ 다음 코드의 출력 결과를 예측해보세요.  │
│                                     │
│ ○ A. 옵션 1                         │
│ ○ B. 옵션 2                         │
│ ○ C. 옵션 3                         │
│ ○ D. 옵션 4                         │
│                                     │
│        [제출]                       │
└─────────────────────────────────────┘
```

---

## 개발 과정에서의 AI 활용 방법 (Vibe Coding)

본 프로젝트는 '바이브 코딩(Vibe Coding)' 방법론을 채택하여, AI 페어 프로그래머(Cursor IDE 내 Claude 3 Sonnet)와 협업하여 개발되었습니다.

AI는 코드 생성, 디버깅, 리팩토링 및 문서화 과정 전반에 걸쳐 보조 프로그래머의 역할을 수행했습니다.

**활용 방식:**

1. **기능 설계:** 개발자가 HTML의 기본 구조와 CSS 스타일링 같은 큰 틀을 먼저 설계하고 AI에게 지시했습니다.

2. **점진적 코드 생성:** AI에게 "랜덤 문제 선택 기능 추가", "랭킹 보드 로드 함수 작성" 등 명확한 요구사항을 프롬프트로 전달하여 단계적으로 코드를 생성했습니다.

3. **오류 수정 (Debugging):** Firebase 연결 오류, 변수명 충돌, 뷰 전환 무한루프 등 개발 중 발생한 복잡한 문제를 AI에게 질의하고, 제안된 해결책을 적용하여 신속하게 해결했습니다.

4. **문서화:** Git 커밋 메시지 작성 및 본 README.md 파일의 초안 작성을 AI에게 위임하여 개발 문서의 품질을 높였습니다.

5. **문제 데이터베이스 구축:** AI를 활용하여 25개의 다양한 IT 문제(JavaScript, 컴퓨터 구조)를 생성하고 검증했습니다.

**AI 협업 기록:** AI와의 모든 프롬프트 상호작용, 코드 수정 내역, 그리고 그에 따른 Git 커밋 기록은 [DEVELOPMENT_log2314.md](./DEVELOPMENT_log2314.md) 파일에 상세히 기록되어 있습니다.