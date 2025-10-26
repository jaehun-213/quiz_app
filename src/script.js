// IT 기술 퀴즈 앱 - 메인 JavaScript 모듈
// Vanilla JavaScript + Firebase + ES6 모듈

// ===== Firebase 전역 변수 사용 =====
// Firebase는 HTML에서 CDN으로 로드되어 전역 변수로 설정됨
let auth, db;
let createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged;
let collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp;

// Firebase 변수들을 안전하게 가져오는 함수
const getFirebaseVariables = () => {
    console.log('Firebase 변수들 가져오기 시작');
    console.log('window.auth:', window.auth);
    console.log('window.db:', window.db);
    
    auth = window.auth;
    db = window.db;
    createUserWithEmailAndPassword = window.createUserWithEmailAndPassword;
    signInWithEmailAndPassword = window.signInWithEmailAndPassword;
    signOut = window.signOut;
    onAuthStateChanged = window.onAuthStateChanged;
    collection = window.collection;
    addDoc = window.addDoc;
    getDocs = window.getDocs;
    query = window.query;
    orderBy = window.orderBy;
    limit = window.limit;
    serverTimestamp = window.serverTimestamp;
    
    console.log('Firebase 변수들 가져오기 완료');
    console.log('가져온 auth:', auth);
    console.log('가져온 db:', db);
};

// ===== Firebase 설정 검증 함수 =====
const validateFirebaseConfig = () => {
    console.log('Firebase 변수 상태 확인:');
    console.log('- auth:', auth);
    console.log('- db:', db);
    console.log('- createUserWithEmailAndPassword:', createUserWithEmailAndPassword);
    console.log('- signInWithEmailAndPassword:', signInWithEmailAndPassword);
    
    // Firebase 함수들이 존재하는지 확인 (로컬 모드 포함)
    if (!createUserWithEmailAndPassword || !signInWithEmailAndPassword) {
        console.error('Firebase 함수들이 제대로 초기화되지 않았습니다.');
        console.log('createUserWithEmailAndPassword 존재 여부:', !!createUserWithEmailAndPassword);
        console.log('signInWithEmailAndPassword 존재 여부:', !!signInWithEmailAndPassword);
        return false;
    }
    
    console.log('Firebase 설정 검증 성공 (로컬 모드 포함)');
    return true;
};

// ===== DOM 요소 변수 선언 =====

// 뷰 섹션들
const homeView = document.getElementById('home-view');
const loginView = document.getElementById('login-view');
const registerView = document.getElementById('register-view');
const quizView = document.getElementById('quiz-view');
const resultsView = document.getElementById('results-view');
const rankingView = document.getElementById('ranking-view');

// 로딩 및 알림 요소
const loadingOverlay = document.getElementById('loading-overlay');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');
const closeNotification = document.getElementById('close-notification');

// 헤더 요소들
const userInfo = document.getElementById('user-info');
const logoutBtn = document.getElementById('logout-btn');

// 홈 화면 요소들
const homeUserInfo = document.getElementById('home-user-info');
const homeUserName = document.getElementById('home-user-name');
const homeLogoutBtn = document.getElementById('home-logout-btn');
const homeGuestInfo = document.getElementById('home-guest-info');
const startQuizBtn = document.getElementById('start-quiz-btn');
const viewRankingBtn = document.getElementById('view-ranking-btn');
const homeLoginBtn = document.getElementById('home-login-btn');

// 인증 관련 요소들
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');

// 로그인 폼 요소들
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');

// 회원가입 폼 요소들
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const registerConfirm = document.getElementById('register-confirm');

// 퀴즈 관련 요소들
const questionCounter = document.getElementById('question-counter');
const progressFill = document.getElementById('progress-fill');
const currentScore = document.getElementById('current-score');
const questionText = document.getElementById('question-text');
const questionCode = document.getElementById('question-code');
const codeContent = document.getElementById('code-content');

// 답안 관련 요소들
const multipleChoice = document.getElementById('multiple-choice');
const fillInBlank = document.getElementById('fill-in-blank');
const blankInput = document.getElementById('blank-input');

// 퀴즈 액션 버튼들
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');

// 결과 관련 요소들
const finalScore = document.getElementById('final-score');
const correctCount = document.getElementById('correct-count');
const totalQuestions = document.getElementById('total-questions');
const accuracy = document.getElementById('accuracy');
const retryQuiz = document.getElementById('retry-quiz');
const viewRanking = document.getElementById('view-ranking');

// 랭킹 관련 요소들
const refreshRankingBtn = document.getElementById('refresh-ranking');
const lastUpdatedTime = document.getElementById('last-updated-time');
const rankingListContent = document.getElementById('ranking-list-content');
const backToQuiz = document.getElementById('back-to-quiz');
const backToHome = document.getElementById('back-to-home');

// ===== 앱 상태 변수 =====
let currentUser = null;
let currentQuestionIndex = 0;
let userScore = 0;
let quizQuestions = [];
let userAnswers = [];
let quizStartTime = null;


// ===== 초기화 함수 =====
const initializeApp = async () => {
    try {
        console.log('앱 초기화 시작');
        
        // Firebase가 로드될 때까지 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Firebase 변수들 직접 가져오기
        console.log('Firebase 변수들 가져오는 중...');
        auth = window.auth;
        db = window.db;
        createUserWithEmailAndPassword = window.createUserWithEmailAndPassword;
        signInWithEmailAndPassword = window.signInWithEmailAndPassword;
        signOut = window.signOut;
        onAuthStateChanged = window.onAuthStateChanged;
        collection = window.collection;
        addDoc = window.addDoc;
        getDocs = window.getDocs;
        query = window.query;
        orderBy = window.orderBy;
        limit = window.limit;
        serverTimestamp = window.serverTimestamp;
        
        console.log('Firebase 변수들 직접 할당 완료');
        console.log('auth:', auth);
        console.log('db:', db);
        
        // Firebase 설정 검증
        console.log('Firebase 설정 검증 중...');
        if (!validateFirebaseConfig()) {
            console.error('Firebase 설정 검증 실패');
            showNotification('Firebase 설정을 확인해주세요.', 'error');
            return;
        }
        console.log('Firebase 설정 검증 완료');

        // 인증 상태 리스너 설정
        console.log('인증 상태 리스너 설정 중...');
        setupAuthStateListener();
        
        // 이벤트 리스너 설정
        console.log('이벤트 리스너 설정 중...');
        setupEventListeners();
        
        // 실시간 입력 검증 설정
        console.log('실시간 입력 검증 설정 중...');
        setupRealTimeValidation();
        
        // 퀴즈 데이터 로드
        console.log('퀴즈 데이터 로드 중...');
        loadQuizData();
        
        console.log('앱 초기화 완료');
        
        // 홈 화면으로 시작
        showView('home-view');
        
    } catch (error) {
        console.error('앱 초기화 실패:', error);
        showNotification('앱 초기화에 실패했습니다.', 'error');
    }
};

// ===== 유틸리티 함수들 =====

// 알림 표시 함수
const showNotification = (message, type = 'info') => {
    notificationMessage.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    // 3초 후 자동 숨김
    setTimeout(() => {
        hideNotification();
    }, 3000);
};

// 알림 숨김 함수
const hideNotification = () => {
    notification.classList.add('hidden');
};

// 로딩 표시 함수
const showLoading = () => {
    loadingOverlay.classList.remove('hidden');
};

// 로딩 숨김 함수
const hideLoading = () => {
    loadingOverlay.classList.add('hidden');
};

// ===== 뷰 전환 로직 =====

// 뷰 전환 함수
const showView = (viewId) => {
    console.log(`뷰 전환 시도: ${viewId}`);
    
    // 현재 뷰 확인
    const currentView = getCurrentView();
    if (currentView === viewId) {
        console.log(`이미 ${viewId} 뷰가 활성화되어 있습니다.`);
        return;
    }
    
    // 모든 뷰 숨김
    const views = [homeView, loginView, registerView, quizView, resultsView, rankingView];
    console.log('현재 뷰들:', views.map(v => v ? v.id : 'null'));
    
    views.forEach(view => {
        if (view) {
            view.classList.add('hidden');
            console.log(`뷰 숨김: ${view.id}`);
        }
    });
    
    // 선택된 뷰만 표시
    const targetView = document.getElementById(viewId);
    console.log('대상 뷰:', targetView);
    
    if (targetView) {
        targetView.classList.remove('hidden');
        console.log(`뷰 전환 성공: ${viewId}`);
        
        // 특정 뷰로 전환 시 추가 처리
        handleViewTransition(viewId);
    } else {
        console.error(`뷰를 찾을 수 없습니다: ${viewId}`);
        console.log('사용 가능한 뷰들:', {
            'login-view': document.getElementById('login-view'),
            'register-view': document.getElementById('register-view'),
            'quiz-view': document.getElementById('quiz-view'),
            'results-view': document.getElementById('results-view'),
            'ranking-view': document.getElementById('ranking-view')
        });
    }
};

// 뷰 전환 시 추가 처리 함수
const handleViewTransition = (viewId) => {
    switch (viewId) {
        case 'home-view':
            // 홈 뷰로 전환 시 사용자 상태 업데이트
            updateHomeUserStatus();
            break;
            
        case 'login-view':
            // 로그인 뷰로 전환 시 폼 초기화
            resetLoginForm();
            break;
            
        case 'register-view':
            // 회원가입 뷰로 전환 시 폼 초기화
            resetRegisterForm();
            break;
            
        case 'quiz-view':
            // 퀴즈 뷰로 전환 시 퀴즈 초기화
            initializeQuiz();
            break;
            
        case 'results-view':
            // 결과 뷰로 전환 시 결과 표시
            displayResults();
            break;
            
        case 'ranking-view':
            // 랭킹 뷰로 전환 시 랭킹 로드
            loadRanking();
            break;
            
        default:
            console.log(`뷰 전환 처리 없음: ${viewId}`);
    }
};

// 로그인 폼 초기화
const resetLoginForm = () => {
    if (loginForm) {
        loginForm.reset();
    }
    // 에러 메시지 제거
    clearFormErrors('login');
};

// 회원가입 폼 초기화
const resetRegisterForm = () => {
    if (registerForm) {
        registerForm.reset();
    }
    // 에러 메시지 제거
    clearFormErrors('register');
};

// 폼 에러 메시지 제거
const clearFormErrors = (formType) => {
    const form = formType === 'login' ? loginForm : registerForm;
    if (form) {
        const errorElements = form.querySelectorAll('.error-message');
        errorElements.forEach(element => element.remove());
        
        // 입력 필드의 에러 스타일 제거
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('error');
        });
    }
};

// 홈 화면 사용자 상태 업데이트
const updateHomeUserStatus = () => {
    if (currentUser) {
        // 로그인된 사용자
        if (homeUserInfo) homeUserInfo.classList.remove('hidden');
        if (homeGuestInfo) homeGuestInfo.classList.add('hidden');
        if (homeLoginBtn) homeLoginBtn.classList.add('hidden'); // 로그인 버튼 숨기기
        if (homeUserName) {
            const username = currentUser.email.split('@')[0];
            homeUserName.textContent = `안녕하세요, ${username}님`;
            homeUserName.style.color = '#C792EA';
        }
    } else {
        // 게스트 사용자
        if (homeUserInfo) homeUserInfo.classList.add('hidden');
        if (homeGuestInfo) homeGuestInfo.classList.remove('hidden');
        if (homeLoginBtn) homeLoginBtn.classList.remove('hidden'); // 로그인 버튼 보이기
    }
};

// 퀴즈 초기화
// 랜덤 문제 선택 함수
const selectRandomQuestions = (totalQuestions = 10) => {
    console.log(`전체 ${QUIZ_QUESTIONS.length}개 문제에서 ${totalQuestions}개 랜덤 선택`);
    
    // 전체 문제 배열을 복사
    const allQuestions = [...QUIZ_QUESTIONS];
    
    // Fisher-Yates 셔플 알고리즘으로 랜덤 섞기
    for (let i = allQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }
    
    // 상위 10개 선택
    const selectedQuestions = allQuestions.slice(0, totalQuestions);
    
    console.log('선택된 문제들:', selectedQuestions.map(q => q.id));
    return selectedQuestions;
};

const initializeQuiz = () => {
    console.log('퀴즈 초기화');
    
    // 랜덤 문제 선택 (10개)
    const selectedQuestions = selectRandomQuestions(10);
    quizQuestions.length = 0; // 기존 배열 초기화
    quizQuestions.push(...selectedQuestions); // 선택된 문제들로 교체
    
    // 퀴즈 상태 초기화
    currentQuestionIndex = 0;
    userScore = 0;
    userAnswers = [];
    quizStartTime = new Date();
    
    // UI 초기화
    updateQuizProgress();
    updateScoreDisplay();
    
    // 버튼 상태 초기화
    if (submitBtn) {
        submitBtn.textContent = '제출';
        submitBtn.classList.remove('hidden');
        submitBtn.disabled = true;
    }
    
    if (nextBtn) {
        nextBtn.classList.add('hidden');
    }
    
    // 첫 번째 문제 로드
    if (quizQuestions.length > 0) {
        loadCurrentQuestion();
    } else {
        console.error('퀴즈 데이터가 없습니다.');
        showNotification('퀴즈 데이터를 불러올 수 없습니다.', 'error');
    }
};

// ===== 퀴즈 결과 및 점수 저장 =====

// 결과 표시
const displayResults = () => {
    console.log('결과 표시');
    
    // 최종 점수 계산
    const score = userScore;
    const totalQuestionsCount = quizQuestions.length;
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
    const accuracyPercent = totalQuestionsCount > 0 ? Math.round((correctAnswers / totalQuestionsCount) * 100) : 0;
    
    // UI 업데이트
    updateResultsUI(score, correctAnswers, totalQuestionsCount, accuracyPercent);
    
    // 결과 데이터 저장 (로컬)
    const quizResult = {
        finalScore: score,
        correctAnswers,
        totalQuestions: totalQuestionsCount,
        accuracy: accuracyPercent,
        userAnswers,
        quizStartTime,
        quizEndTime: new Date(),
        duration: quizStartTime ? new Date() - quizStartTime : 0
    };
    
    // 전역 변수에 저장 (필요시 사용)
    window.currentQuizResult = quizResult;
    
    console.log('퀴즈 결과:', quizResult);
};

// 결과 UI 업데이트
const updateResultsUI = (score, correctAnswers, totalQuestionsCount, accuracyPercent) => {
    // 최종 점수 표시
    if (finalScore) {
        finalScore.textContent = score;
    }
    
    // 정답 수 표시
    if (correctCount) {
        correctCount.textContent = correctAnswers;
    }
    
    // 전체 문제 수 표시
    if (totalQuestions) {
        totalQuestions.textContent = totalQuestionsCount;
    }
    
    // 정답률 표시
    if (accuracy) {
        accuracy.textContent = accuracyPercent;
    }
};

// 점수를 Firestore에 저장
const saveScoreToFirestore = async () => {
    try {
        showLoading();
        
        // 점수 데이터 준비
        const scoreData = {
            userId: currentUser ? currentUser.uid : 'guest',
            userEmail: currentUser ? currentUser.email : 'guest@example.com',
            score: userScore,
            totalQuestions: quizQuestions.length,
            correctAnswers: userAnswers.filter(answer => answer.isCorrect).length,
            accuracy: quizQuestions.length > 0 ? Math.round((userAnswers.filter(answer => answer.isCorrect).length / quizQuestions.length) * 100) : 0,
            quizStartTime: quizStartTime,
            quizEndTime: new Date(),
            duration: quizStartTime ? new Date() - quizStartTime : 0,
            userAnswers: userAnswers,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        console.log('점수 저장 중:', scoreData);
        
        // 로컬 모드에서는 localStorage에 저장
        if (!db) {
            console.log('로컬 모드: localStorage에 점수 저장');
            const existingScores = JSON.parse(localStorage.getItem('quiz_scores') || '[]');
            existingScores.push(scoreData);
            localStorage.setItem('quiz_scores', JSON.stringify(existingScores));
            
            console.log('점수가 localStorage에 성공적으로 저장되었습니다.');
            showNotification('점수가 저장되었습니다!', 'success');
            
            // 저장된 점수 ID를 결과에 추가
            if (window.currentQuizResult) {
                window.currentQuizResult.scoreId = `local_${Date.now()}`;
            }
            
            return;
        }
        
        // Firebase 모드
        const docRef = await addDoc(collection(db, 'scores'), scoreData);
        
        console.log('점수가 성공적으로 저장되었습니다. 문서 ID:', docRef.id);
        showNotification('점수가 저장되었습니다!', 'success');
        
        // 저장된 점수 ID를 결과에 추가
        if (window.currentQuizResult) {
            window.currentQuizResult.scoreId = docRef.id;
        }
        
    } catch (error) {
        console.error('점수 저장 실패:', error);
        showNotification('점수 저장에 실패했습니다.', 'error');
        
        // 에러 타입별 처리
        if (error.code === 'permission-denied') {
            showNotification('점수 저장 권한이 없습니다.', 'error');
        } else if (error.code === 'unavailable') {
            showNotification('네트워크 연결을 확인해주세요.', 'error');
        } else {
            showNotification('점수 저장 중 오류가 발생했습니다.', 'error');
        }
    } finally {
        hideLoading();
    }
};

// 사용자 최고 점수 조회
const getUserBestScore = async () => {
    if (!currentUser) return null;
    
    try {
        const scoresQuery = query(
            collection(db, 'scores'),
            orderBy('score', 'desc'),
            limit(1)
        );
        
        const querySnapshot = await getDocs(scoresQuery);
        
        if (!querySnapshot.empty) {
            const bestScore = querySnapshot.docs[0].data();
            return bestScore;
        }
        
        return null;
    } catch (error) {
        console.error('최고 점수 조회 실패:', error);
        return null;
    }
};

// 사용자 점수 히스토리 조회
const getUserScoreHistory = async (limitCount = 10) => {
    if (!currentUser) return [];
    
    try {
        const scoresQuery = query(
            collection(db, 'scores'),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );
        
        const querySnapshot = await getDocs(scoresQuery);
        const scores = [];
        
        querySnapshot.forEach((doc) => {
            scores.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return scores;
    } catch (error) {
        console.error('점수 히스토리 조회 실패:', error);
        return [];
    }
};

// 점수 저장 상태 확인
const isScoreSaved = () => {
    return window.currentQuizResult && window.currentQuizResult.scoreId;
};


// 퀴즈 진행률 업데이트
const updateQuizProgress = () => {
    if (questionCounter && progressFill) {
        const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
        questionCounter.textContent = `문제 ${currentQuestionIndex + 1} / ${quizQuestions.length}`;
        progressFill.style.width = `${progress}%`;
    }
};

// 점수 표시 업데이트
const updateScoreDisplay = () => {
    if (currentScore) {
        currentScore.textContent = userScore;
    }
};

// 뷰 전환 애니메이션 (선택사항)
const animateViewTransition = (viewId) => {
    const targetView = document.getElementById(viewId);
    if (targetView) {
        // 페이드 인 애니메이션
        targetView.style.opacity = '0';
        targetView.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            targetView.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            targetView.style.opacity = '1';
            targetView.style.transform = 'translateY(0)';
        }, 50);
    }
};

// 현재 활성 뷰 확인
const getCurrentView = () => {
    const views = [loginView, registerView, quizView, resultsView, rankingView];
    for (let view of views) {
        if (view && !view.classList.contains('hidden')) {
            return view.id;
        }
    }
    return null;
};

// 뷰 전환 가능 여부 확인
const canTransitionTo = (targetViewId) => {
    const currentView = getCurrentView();
    
    // 특정 조건에 따른 뷰 전환 제한 로직
    if (currentView === 'quiz-view' && targetViewId === 'login-view') {
        // 퀴즈 중에는 로그인 뷰로 직접 전환 불가
        return false;
    }
    
    if (targetViewId === 'quiz-view' && !currentUser) {
        // 로그인하지 않은 상태에서는 퀴즈 뷰로 전환 불가
        return false;
    }
    
    return true;
};

// ===== 이벤트 리스너 설정 함수 =====
const setupEventListeners = () => {
    console.log('이벤트 리스너 설정 시작');
    
    // DOM 요소 존재 확인
    console.log('DOM 요소 확인:');
    console.log('- loginForm:', loginForm);
    console.log('- registerForm:', registerForm);
    console.log('- showRegister:', showRegister);
    console.log('- showLogin:', showLogin);
    console.log('- logoutBtn:', logoutBtn);
    
    // 알림 닫기 버튼
    if (closeNotification) {
        closeNotification.addEventListener('click', hideNotification);
    }
    
    // 인증 관련 이벤트
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('로그인 폼 이벤트 리스너 추가됨');
    } else {
        console.error('로그인 폼을 찾을 수 없습니다!');
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        console.log('회원가입 폼 이벤트 리스너 추가됨');
    } else {
        console.error('회원가입 폼을 찾을 수 없습니다!');
    }
    
    if (showRegister) {
        showRegister.addEventListener('click', () => {
            console.log('회원가입 버튼 클릭됨');
            showView('register-view');
        });
    } else {
        console.error('회원가입 버튼을 찾을 수 없습니다!');
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', () => {
            console.log('로그인 버튼 클릭됨');
            showView('login-view');
        });
    } else {
        console.error('로그인 버튼을 찾을 수 없습니다!');
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // 홈 화면 관련 이벤트
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', () => {
            console.log('게임 시작 버튼 클릭됨');
            showView('quiz-view');
        });
    }
    
    if (viewRankingBtn) {
        viewRankingBtn.addEventListener('click', () => {
            console.log('랭킹 보기 버튼 클릭됨');
            showView('ranking-view');
        });
    }
    
    if (homeLoginBtn) {
        homeLoginBtn.addEventListener('click', () => {
            console.log('홈 로그인 버튼 클릭됨');
            showView('login-view');
        });
    }
    
    if (homeLogoutBtn) {
        homeLogoutBtn.addEventListener('click', handleLogout);
    }
    
    // 퀴즈 관련 이벤트
    submitBtn.addEventListener('click', handleSubmitAnswer);
    nextBtn.addEventListener('click', handleNextQuestion);
    
    // 결과 관련 이벤트
    retryQuiz.addEventListener('click', handleRetryQuiz);
    viewRanking.addEventListener('click', () => showView('ranking-view'));
    
    // 랭킹 관련 이벤트
    refreshRankingBtn.addEventListener('click', refreshRanking);
    backToQuiz.addEventListener('click', () => showView('quiz-view'));
    backToHome.addEventListener('click', () => showView('home-view'));
};

// ===== 인증 상태 리스너 설정 =====
const setupAuthStateListener = () => {
    // 로컬 모드에서는 인증 상태 리스너를 비활성화
    if (!auth) {
        console.log('로컬 모드: 인증 상태 리스너 비활성화');
        return;
    }
    
    onAuthStateChanged(auth, (user) => {
        console.log('인증 상태 변경:', user ? '로그인됨' : '로그아웃됨');
        
        // 사용자 상태 업데이트
        currentUser = user;
        
        if (user) {
            // 로그인된 상태 처리
            handleUserLogin(user);
        } else {
            // 로그아웃된 상태 처리
            handleUserLogout();
        }
    });
};

// 사용자 로그인 처리
const handleUserLogin = (user) => {
    try {
        console.log('사용자 로그인 처리:', user.email);
        
        // 사용자 정보 UI 업데이트
        updateUserInfo(user);
        
        // 헤더 UI 업데이트
        updateHeaderForLoggedInUser();
        
        // 홈 화면 사용자 상태 업데이트
        updateHomeUserStatus();
        
        // 퀴즈 상태 초기화 (새 로그인 시)
        if (!quizStartTime) {
            initializeQuizForNewUser();
        }
        
        // 적절한 뷰로 전환 (현재 뷰가 로그인 관련 뷰인 경우에만)
        const currentView = getCurrentView();
        if (shouldRedirectToQuiz(currentView) && (currentView === 'login-view' || currentView === 'register-view')) {
            showView('quiz-view');
        }
        
        // 성공 알림 (새 로그인인 경우에만)
        if (!currentView || currentView === 'login-view' || currentView === 'register-view') {
            showNotification(`환영합니다, ${user.email}님!`, 'success');
        }
        
    } catch (error) {
        console.error('로그인 처리 중 오류:', error);
        showNotification('로그인 처리 중 오류가 발생했습니다.', 'error');
    }
};

// 사용자 로그아웃 처리
const handleUserLogout = () => {
    try {
        console.log('사용자 로그아웃 처리');
        
        // 사용자 정보 UI 초기화
        clearUserInfo();
        
        // 헤더 UI 초기화
        updateHeaderForLoggedOutUser();
        
        // 홈 화면 사용자 상태 업데이트
        updateHomeUserStatus();
        
        // 퀴즈 상태 초기화
        resetQuizState();
        
        // 로그인 뷰로 전환
        showView('login-view');
        
        // 로그아웃 알림
        showNotification('로그아웃되었습니다.', 'info');
        
    } catch (error) {
        console.error('로그아웃 처리 중 오류:', error);
        showNotification('로그아웃 처리 중 오류가 발생했습니다.', 'error');
    }
};

// 사용자 정보 UI 업데이트
const updateUserInfo = (user) => {
    if (userInfo) {
        // 이메일에서 사용자명 추출 (이메일 앞부분)
        const username = user.email.split('@')[0];
        userInfo.textContent = `안녕하세요, ${username}님`;
        userInfo.title = `이메일: ${user.email}`;
    }
};

// 사용자 정보 UI 초기화
const clearUserInfo = () => {
    if (userInfo) {
        userInfo.textContent = '';
        userInfo.title = '';
    }
};

// 로그인된 사용자용 헤더 업데이트
const updateHeaderForLoggedInUser = () => {
    if (userInfo) {
        userInfo.classList.remove('hidden');
    }
    if (logoutBtn) {
        logoutBtn.classList.remove('hidden');
    }
};

// 로그아웃된 사용자용 헤더 업데이트
const updateHeaderForLoggedOutUser = () => {
    if (userInfo) {
        userInfo.classList.add('hidden');
    }
    if (logoutBtn) {
        logoutBtn.classList.add('hidden');
    }
};

// 새 사용자용 퀴즈 초기화
const initializeQuizForNewUser = () => {
    console.log('새 사용자용 퀴즈 초기화');
    
    // 랜덤 문제 선택 (10개)
    const selectedQuestions = selectRandomQuestions(10);
    quizQuestions.length = 0; // 기존 배열 초기화
    quizQuestions.push(...selectedQuestions); // 선택된 문제들로 교체
    
    // 퀴즈 상태 초기화
    currentQuestionIndex = 0;
    userScore = 0;
    userAnswers = [];
    quizStartTime = new Date();
    
    // UI 초기화
    updateQuizProgress();
    updateScoreDisplay();
    
    // 퀴즈 데이터가 있는 경우 첫 번째 문제 로드
    if (quizQuestions.length > 0) {
        loadCurrentQuestion();
    }
};

// 퀴즈로 리다이렉트해야 하는지 확인
const shouldRedirectToQuiz = (currentView) => {
    // 특정 뷰에서는 퀴즈로 리다이렉트하지 않음
    const restrictedViews = ['results-view', 'ranking-view'];
    
    if (restrictedViews.includes(currentView)) {
        return false;
    }
    
    // 기본적으로는 퀴즈로 리다이렉트
    return true;
};

// ===== 퀴즈 엔진 핵심 함수들 =====

// 현재 문제 로드 함수
const loadCurrentQuestion = () => {
    if (quizQuestions.length === 0) {
        console.error('퀴즈 데이터가 없습니다.');
        showNotification('퀴즈 데이터를 불러올 수 없습니다.', 'error');
        return;
    }
    
    if (currentQuestionIndex >= quizQuestions.length) {
        console.log('모든 문제를 완료했습니다.');
        showQuizResults();
        return;
    }
    
    const question = quizQuestions[currentQuestionIndex];
    console.log(`문제 ${currentQuestionIndex + 1} 로드:`, question);
    
    // 문제 로드
    loadQuiz(question);
};

// 퀴즈 문제 로드 및 렌더링
const loadQuiz = (question) => {
    try {
        // 기존 피드백 제거
        clearAnswerFeedback();
        
        // 문제 텍스트 표시
        displayQuestionText(question);
        
        // 코드 블록 처리
        displayCodeBlock(question);
        
        // 답안 컨테이너 초기화
        clearAnswerContainers();
        
        // 문제 타입에 따른 답안 UI 생성
        switch (question.type) {
            case 'multiple-choice':
                createMultipleChoiceUI(question);
                break;
            case 'fill-in-blank':
                createFillInBlankUI(question);
                break;
            default:
                console.error('알 수 없는 문제 타입:', question.type);
                showNotification('알 수 없는 문제 타입입니다.', 'error');
        }
        
        // UI 상태 업데이트
        updateQuizUI(question);
        
        // 진행률 업데이트
        updateQuizProgress();
        
    } catch (error) {
        console.error('퀴즈 로드 중 오류:', error);
        showNotification('문제를 불러오는 중 오류가 발생했습니다.', 'error');
    }
};

// 문제 텍스트 표시
const displayQuestionText = (question) => {
    if (questionText) {
        questionText.textContent = question.question;
    }
};

// 코드 블록 표시
const displayCodeBlock = (question) => {
    if (questionCode && codeContent) {
        // 코드가 포함된 문제인지 확인
        const hasCode = question.question.includes('```') || 
                       (question.modelAnswer && question.modelAnswer.includes('```'));
        
        if (hasCode) {
            // 코드 블록 추출 및 표시
            const codeMatch = question.question.match(/```(\w+)?\n([\s\S]*?)```/);
            if (codeMatch) {
                const language = codeMatch[1] || 'javascript';
                const code = codeMatch[2].trim();
                
                codeContent.textContent = code;
                codeContent.className = `language-${language}`;
                questionCode.classList.remove('hidden');
            } else {
                questionCode.classList.add('hidden');
            }
        } else {
            questionCode.classList.add('hidden');
        }
    }
};

// 답안 컨테이너 초기화
const clearAnswerContainers = () => {
    const containers = [multipleChoice, fillInBlank];
    containers.forEach(container => {
        if (container) {
            container.classList.add('hidden');
            // 기존 내용 제거
            const content = container.querySelector('.options-list, .blank-container');
            if (content) {
                content.innerHTML = '';
            }
        }
    });
};

// 객관식 UI 생성
const createMultipleChoiceUI = (question) => {
    if (!multipleChoice || !question.options) return;
    
    const optionsList = multipleChoice.querySelector('.options-list');
    if (!optionsList) return;
    
    // 기존 옵션 제거
    optionsList.innerHTML = '';
    
    // 옵션 생성
    question.options.forEach((option, index) => {
        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'quiz-option';
        radioInput.id = `option-${index}`;
        radioInput.value = index;
        
        const label = document.createElement('label');
        label.htmlFor = `option-${index}`;
        label.textContent = option;
        
        optionItem.appendChild(radioInput);
        optionItem.appendChild(label);
        optionsList.appendChild(optionItem);
        
        // 옵션 클릭 이벤트
        optionItem.addEventListener('click', () => {
            radioInput.checked = true;
            updateSubmitButton();
        });
    });
    
    multipleChoice.classList.remove('hidden');
};

// 빈칸 채우기 UI 생성
const createFillInBlankUI = (question) => {
    if (!fillInBlank) return;
    
    const blankContainer = fillInBlank.querySelector('.blank-container');
    if (!blankContainer) return;
    
    // 입력 필드가 없으면 생성
    let inputField = blankContainer.querySelector('.blank-input');
    if (!inputField) {
        inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.className = 'blank-input';
        inputField.placeholder = '답을 입력하세요';
        blankContainer.appendChild(inputField);
    }
    
    // 입력 필드 초기화
    inputField.value = '';
    inputField.placeholder = '답을 입력하세요';
    
    // 기존 이벤트 리스너 제거
    inputField.removeEventListener('input', updateSubmitButton);
    inputField.removeEventListener('keypress', handleSubmitAnswer);
    
    // 새로운 이벤트 리스너 추가
    inputField.addEventListener('input', () => {
        updateSubmitButton();
    });
    
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmitAnswer();
        }
    });
    
    fillInBlank.classList.remove('hidden');
    console.log('빈칸 채우기 UI 생성 완료');
};

// 퀴즈 UI 상태 업데이트
const updateQuizUI = (question) => {
    // 버튼 상태 초기화
    if (submitBtn) {
        submitBtn.textContent = '제출';
        submitBtn.classList.remove('hidden');
        submitBtn.disabled = true;
    }
    
    if (nextBtn) {
        nextBtn.classList.add('hidden');
    }
    
    // 제출 버튼 활성화 상태 업데이트
    updateSubmitButton();
};

// 제출 버튼 활성화 상태 업데이트
const updateSubmitButton = () => {
    if (!submitBtn) return;
    
    const question = quizQuestions[currentQuestionIndex];
    if (!question) return;
    
    let hasAnswer = false;
    
    switch (question.type) {
        case 'multiple-choice':
            const selectedOption = document.querySelector('input[name="quiz-option"]:checked');
            hasAnswer = selectedOption !== null;
            break;
            
        case 'fill-in-blank':
            const blankInputField = document.querySelector('.blank-input');
            hasAnswer = blankInputField ? blankInputField.value.trim().length > 0 : false;
            break;
    }
    
    submitBtn.disabled = !hasAnswer;
};

// 사용자 답안 가져오기
const getUserAnswer = () => {
    const question = quizQuestions[currentQuestionIndex];
    if (!question) return null;
    
    switch (question.type) {
        case 'multiple-choice':
            const selectedOption = document.querySelector('input[name="quiz-option"]:checked');
            return selectedOption ? parseInt(selectedOption.value) : null;
            
        case 'fill-in-blank':
            const blankInputField = document.querySelector('.blank-input');
            return blankInputField ? blankInputField.value.trim() : null;
            
        default:
            return null;
    }
};

// 답안 저장
const saveUserAnswer = (answer) => {
    const question = quizQuestions[currentQuestionIndex];
    if (!question) return;
    
    userAnswers[currentQuestionIndex] = {
        questionId: question.id,
        answer: answer,
        isCorrect: checkAnswer(question, answer),
        timestamp: new Date()
    };
    
    console.log('답안 저장:', userAnswers[currentQuestionIndex]);
};


// 퀴즈 결과 표시
const showQuizResults = () => {
    console.log('퀴즈 완료!');
    
    // 최종 점수 계산 및 표시
    displayResults();
    
    // 결과 뷰로 전환
    showView('results-view');
    
    // 점수를 Firestore에 저장
    saveScoreToFirestore();
};

// 인증 상태 확인 함수
const checkAuthState = () => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe(); // 한 번만 실행하고 구독 해제
            resolve(user);
        });
    });
};

// 인증 상태 대기 함수
const waitForAuthState = async () => {
    try {
        const user = await checkAuthState();
        return user;
    } catch (error) {
        console.error('인증 상태 확인 실패:', error);
        return null;
    }
};

// 사용자 인증 상태 확인
const isUserAuthenticated = () => {
    return currentUser !== null;
};

// 사용자 이메일 가져오기
const getUserEmail = () => {
    return currentUser ? currentUser.email : null;
};

// 사용자 UID 가져오기
const getUserUID = () => {
    return currentUser ? currentUser.uid : null;
};

// ===== 퀴즈 데이터 =====
const QUIZ_QUESTIONS = [
    // 코딩 관련 문제들
    {
        id: 1,
        category: '코딩',
        type: 'multiple-choice',
        question: '스택(Stack)의 LIFO 특징에 대한 설명으로 올바른 것은?',
        options: [
            'Last In First Out - 마지막에 들어간 데이터가 먼저 나온다',
            'First In First Out - 먼저 들어간 데이터가 먼저 나온다',
            'Last In Last Out - 마지막에 들어간 데이터가 마지막에 나온다',
            'First In Last Out - 먼저 들어간 데이터가 마지막에 나온다'
        ],
        correctAnswer: 0,
        explanation: '스택은 LIFO(Last In First Out) 구조로, 마지막에 들어간 데이터가 먼저 나오는 자료구조입니다.'
    },
    {
        id: 2,
        category: '코딩',
        type: 'fill-in-blank',
        question: '다음 코드의 출력 결과를 예측해보세요.\n\n```javascript\nlet arr = [1, 2, 3, 4, 5];\nlet result = arr.filter(x => x % 2 === 0).map(x => x * 2);\nconsole.log(result);\n```\n\n출력 결과: [____]',
        correctAnswer: '[4, 8]',
        explanation: 'filter로 짝수만 선택([2, 4])하고, map으로 각 요소에 2를 곱하여 [4, 8]이 됩니다.'
    },
    {
        id: 3,
        category: '코딩',
        type: 'multiple-choice',
        question: '다음 코드에서 발생할 수 있는 문제점은?\n\n```javascript\nfunction divide(a, b) {\n    return a / b;\n}\n\nconsole.log(divide(10, 0));\n```',
        options: [
            '0으로 나누기로 인한 Infinity 반환',
            '메모리 부족 오류',
            '타입 에러 발생',
            '무한 루프 발생'
        ],
        correctAnswer: 0,
        explanation: 'JavaScript에서 0으로 나누면 Infinity를 반환합니다. 적절한 예외 처리가 필요합니다.'
    },
    {
        id: 4,
        category: '코딩',
        type: 'multiple-choice',
        question: '다음 중 시간복잡도가 O(n²)인 정렬 알고리즘은?',
        options: [
            '퀵 정렬 (Quick Sort)',
            '병합 정렬 (Merge Sort)',
            '버블 정렬 (Bubble Sort)',
            '힙 정렬 (Heap Sort)'
        ],
        correctAnswer: 2,
        explanation: '버블 정렬은 최악의 경우 O(n²)의 시간복잡도를 가집니다. 나머지는 모두 O(n log n)입니다.'
    },
    {
        id: 5,
        category: '코딩',
        type: 'fill-in-blank',
        question: '다음은 이진 탐색 트리(BST)의 삽입 연산입니다. 빈칸을 채워주세요.\n\n```javascript\nfunction insertNode(root, value) {\n    if (root === null) {\n        return new Node(value);\n    }\n    \n    if (value < root.value) {\n        root.left = insertNode(root.left, value);\n    } else if (value > root.value) {\n        root.right = insertNode(root.right, value);\n    }\n    \n    return ____;\n}\n```',
        correctAnswer: 'root',
        explanation: '삽입 후에는 루트 노드를 반환해야 합니다.'
    },
    
    // 컴퓨터 구조 관련 문제들
    {
        id: 6,
        category: '컴퓨터 구조',
        type: 'multiple-choice',
        question: 'CPU의 주요 구성 요소가 아닌 것은?',
        options: [
            'ALU (Arithmetic Logic Unit)',
            'CU (Control Unit)',
            'Register',
            'Hard Disk'
        ],
        correctAnswer: 3,
        explanation: '하드 디스크는 저장 장치로 CPU의 구성 요소가 아닙니다. CPU는 ALU, CU, Register 등으로 구성됩니다.'
    },
    {
        id: 7,
        category: '컴퓨터 구조',
        type: 'fill-in-blank',
        question: '메모리 계층 구조에서 가장 빠른 접근 속도를 가진 저장 장치는 ____입니다.',
        correctAnswer: '레지스터',
        explanation: '메모리 계층 구조는 레지스터 > 캐시 > 메인 메모리 > 보조 저장장치 순으로 속도가 느려집니다.'
    },
    {
        id: 8,
        category: '컴퓨터 구조',
        type: 'multiple-choice',
        question: '캐시 메모리에 대한 설명으로 올바른 것은?',
        options: [
            'L1 캐시는 L2 캐시보다 크고 느리다',
            'L3 캐시는 여러 CPU 코어가 공유하는 캐시다',
            '캐시는 메인 메모리보다 느리다',
            'L2 캐시는 CPU 코어 내부에 위치한다'
        ],
        correctAnswer: 1,
        explanation: 'L3 캐시는 여러 CPU 코어가 공유하는 캐시로, 상대적으로 크지만 느립니다. L1 > L2 > L3 순으로 빠르고 작습니다.'
    },
    {
        id: 9,
        category: '컴퓨터 구조',
        type: 'multiple-choice',
        question: '다음 중 폰 노이만 아키텍처의 특징이 아닌 것은?',
        options: [
            '프로그램과 데이터를 같은 메모리에 저장',
            '순차적 명령어 실행',
            '하버드 아키텍처와 동일한 구조',
            '저장된 프로그램 개념'
        ],
        correctAnswer: 2,
        explanation: '하버드 아키텍처는 프로그램과 데이터를 별도 메모리에 저장하는 구조로, 폰 노이만 아키텍처와는 다릅니다.'
    },
    {
        id: 10,
        category: '컴퓨터 구조',
        type: 'fill-in-blank',
        question: '명령어 실행 과정에서 명령어를 메모리에서 가져오는 단계를 ____라고 합니다.',
        correctAnswer: 'Fetch',
        explanation: '명령어 실행 과정은 Fetch(인출) → Decode(해독) → Execute(실행) → Write Back(쓰기) 순서로 진행됩니다.'
    },
    {
        id: 11,
        category: '코딩',
        type: 'multiple-choice',
        question: '다음 JavaScript 코드의 실행 결과는?\n\n```javascript\nlet x = 5;\nlet y = 10;\n[x, y] = [y, x];\nconsole.log(x, y);\n```',
        options: [
            '5 10',
            '10 5',
            'undefined undefined',
            '에러 발생'
        ],
        correctAnswer: 1,
        explanation: '구조 분해 할당을 사용한 변수 교환으로, x와 y의 값이 서로 바뀝니다.'
    },
    {
        id: 12,
        category: '컴퓨터 구조',
        type: 'multiple-choice',
        question: '파이프라인(Pipeline) 처리의 주요 장점은?',
        options: [
            '메모리 사용량 감소',
            '명령어 처리량(Throughput) 증가',
            '전력 소비 감소',
            '하드웨어 복잡도 감소'
        ],
        correctAnswer: 1,
        explanation: '파이프라인은 명령어를 여러 단계로 나누어 병렬 처리하여 전체적인 처리량을 증가시킵니다.'
    },
    
    // 추가 문제들
    {
        id: 13,
        category: '코딩',
        type: 'multiple-choice',
        question: '다음 중 JavaScript의 원시 타입이 아닌 것은?',
        options: [
            'string',
            'number',
            'object',
            'boolean'
        ],
        correctAnswer: 2,
        explanation: 'object는 참조 타입입니다. JavaScript의 원시 타입은 string, number, boolean, undefined, null, symbol이 있습니다.'
    },
    {
        id: 14,
        category: '코딩',
        type: 'fill-in-blank',
        question: '다음 코드의 출력 결과를 예측해보세요.\n\n```javascript\nlet x = 10;\nlet y = x++;\nconsole.log(x, y);\n```\n\n출력 결과: ____ ____',
        correctAnswer: '11 10',
        explanation: '후위 증가 연산자(++)는 값을 반환한 후 증가시킵니다. 따라서 y는 10이고, x는 11이 됩니다.'
    },
    {
        id: 15,
        category: '컴퓨터 구조',
        type: 'multiple-choice',
        question: '다음 중 메모리 관리 기법이 아닌 것은?',
        options: [
            '페이징(Paging)',
            '세그멘테이션(Segmentation)',
            '캐싱(Caching)',
            '가상 메모리(Virtual Memory)'
        ],
        correctAnswer: 2,
        explanation: '캐싱은 메모리 관리 기법이 아니라 성능 향상을 위한 기법입니다. 페이징, 세그멘테이션, 가상 메모리가 메모리 관리 기법입니다.'
    },
    {
        id: 16,
        category: '코딩',
        type: 'fill-in-blank',
        question: '다음은 배열의 최댓값을 찾는 함수입니다. 빈칸을 채워주세요.\n\n```javascript\nfunction findMax(arr) {\n    let max = arr[0];\n    for (let i = 1; i < arr.length; i++) {\n        if (arr[i] > max) {\n            max = ____;\n        }\n    }\n    return max;\n}\n```',
        correctAnswer: 'arr[i]',
        explanation: '현재 요소가 기존 최댓값보다 크면 최댓값을 현재 요소로 업데이트해야 합니다.'
    },
    {
        id: 17,
        category: '컴퓨터 구조',
        type: 'multiple-choice',
        question: '다음 중 운영체제의 주요 기능이 아닌 것은?',
        options: [
            '프로세스 관리',
            '메모리 관리',
            '파일 시스템 관리',
            '하드웨어 제조'
        ],
        correctAnswer: 3,
        explanation: '하드웨어 제조는 운영체제의 기능이 아닙니다. 운영체제는 프로세스 관리, 메모리 관리, 파일 시스템 관리 등의 기능을 담당합니다.'
    },
    {
        id: 18,
        category: '코딩',
        type: 'multiple-choice',
        question: '다음 JavaScript 코드의 실행 결과는?\n\n```javascript\nconsole.log(typeof null);\n```',
        options: [
            'null',
            'undefined',
            'object',
            'string'
        ],
        correctAnswer: 2,
        explanation: 'JavaScript에서 typeof null은 "object"를 반환합니다. 이는 JavaScript의 알려진 버그입니다.'
    },
    {
        id: 19,
        category: '컴퓨터 구조',
        type: 'fill-in-blank',
        question: 'CPU의 명령어 실행 주기에서 명령어를 해석하는 단계를 ____라고 합니다.',
        correctAnswer: 'Decode',
        explanation: '명령어 실행 주기는 Fetch(인출) → Decode(해독) → Execute(실행) → Write Back(쓰기) 순서로 진행됩니다.'
    },
    {
        id: 20,
        category: '코딩',
        type: 'multiple-choice',
        question: '다음 중 비동기 프로그래밍과 관련이 없는 것은?',
        options: [
            'Promise',
            'async/await',
            'Callback',
            'for loop'
        ],
        correctAnswer: 3,
        explanation: 'for loop는 동기적 반복문입니다. Promise, async/await, Callback은 모두 비동기 프로그래밍과 관련이 있습니다.'
    },
    {
        id: 21,
        category: '컴퓨터 구조',
        type: 'multiple-choice',
        question: '다음 중 인터럽트(Interrupt)의 종류가 아닌 것은?',
        options: [
            '하드웨어 인터럽트',
            '소프트웨어 인터럽트',
            '타이머 인터럽트',
            '네트워크 인터럽트'
        ],
        correctAnswer: 3,
        explanation: '네트워크 인터럽트는 별도의 인터럽트 종류가 아닙니다. 하드웨어 인터럽트, 소프트웨어 인터럽트, 타이머 인터럽트가 주요 인터럽트 종류입니다.'
    },
    {
        id: 22,
        category: '코딩',
        type: 'fill-in-blank',
        question: '다음은 재귀 함수로 팩토리얼을 계산하는 코드입니다. 빈칸을 채워주세요.\n\n```javascript\nfunction factorial(n) {\n    if (n <= 1) {\n        return 1;\n    }\n    return n * factorial(____);\n}\n```',
        correctAnswer: 'n - 1',
        explanation: '팩토리얼은 n! = n × (n-1)! 이므로, 재귀 호출 시 n-1을 전달해야 합니다.'
    },
    {
        id: 23,
        category: '컴퓨터 구조',
        type: 'multiple-choice',
        question: '다음 중 캐시 미스(Cache Miss)의 종류가 아닌 것은?',
        options: [
            'Compulsory Miss',
            'Capacity Miss',
            'Conflict Miss',
            'Memory Miss'
        ],
        correctAnswer: 3,
        explanation: 'Memory Miss는 캐시 미스의 종류가 아닙니다. 캐시 미스의 주요 종류는 Compulsory Miss, Capacity Miss, Conflict Miss입니다.'
    },
    {
        id: 24,
        category: '코딩',
        type: 'multiple-choice',
        question: '다음 JavaScript 코드의 실행 결과는?\n\n```javascript\nlet arr = [1, 2, 3];\narr[10] = 10;\nconsole.log(arr.length);\n```',
        options: [
            '3',
            '4',
            '10',
            '11'
        ],
        correctAnswer: 3,
        explanation: 'JavaScript 배열에서 인덱스 10에 값을 할당하면 배열의 길이가 11이 됩니다. 중간의 빈 슬롯들은 undefined로 채워집니다.'
    },
    {
        id: 25,
        category: '컴퓨터 구조',
        type: 'fill-in-blank',
        question: '다음은 이진 트리의 전위 순회 코드입니다. 빈칸을 채워주세요.\n\n```javascript\nfunction preorderTraversal(node) {\n    if (node === null) return;\n    \n    console.log(node.value);\n    preorderTraversal(node.left);\n    preorderTraversal(____);\n}\n```',
        correctAnswer: 'node.right',
        explanation: '전위 순회는 루트 → 왼쪽 서브트리 → 오른쪽 서브트리 순서로 방문하므로 오른쪽 자식 노드를 재귀 호출해야 합니다.'
    }
];

// ===== 퀴즈 데이터 로드 함수 =====
const loadQuizData = () => {
    // 퀴즈 데이터를 전역 배열에 복사
    quizQuestions.length = 0; // 기존 배열 초기화
    quizQuestions.push(...QUIZ_QUESTIONS); // 새 데이터 추가
    
    console.log('퀴즈 데이터 로드 완료:', quizQuestions.length, '개 문제');
    console.log('카테고리별 문제 수:');
    console.log('- 코딩:', quizQuestions.filter(q => q.category === '코딩').length, '개');
    console.log('- 컴퓨터 구조:', quizQuestions.filter(q => q.category === '컴퓨터 구조').length, '개');
    
    // 문제 타입별 통계
    const typeStats = quizQuestions.reduce((acc, q) => {
        acc[q.type] = (acc[q.type] || 0) + 1;
        return acc;
    }, {});
    console.log('문제 타입별 통계:', typeStats);
};

// ===== 인증 관련 함수들 =====

// 로그인 처리 함수
const handleLogin = async (e) => {
    console.log('로그인 함수 호출됨');
    e.preventDefault();
    
    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    
    console.log('로그인 입력값:', { email, password: password.length });
    
    // 입력값 검증
    if (!validateEmail(email)) {
        showFormError('login', 'login-email', '올바른 이메일 형식을 입력해주세요.');
        return;
    }
    
    if (!validatePassword(password)) {
        showFormError('login', 'login-password', '비밀번호는 6자리 이상이어야 합니다.');
        return;
    }
    
    try {
        showLoading();
        clearFormErrors('login');
        
        // Firebase 로그인
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('로그인 성공:', user.email);
        showNotification('로그인에 성공했습니다!', 'success');
        
        // 사용자 상태 업데이트
        currentUser = user;
        
        // 사용자 정보 UI 업데이트
        updateUserInfo(user);
        
        // 헤더 UI 업데이트
        updateHeaderForLoggedInUser();
        
        // 폼 초기화
        loginForm.reset();
        
        // 홈 화면으로 전환
        showView('home-view');
        
    } catch (error) {
        console.error('로그인 실패:', error);
        handleAuthError(error, 'login');
    } finally {
        hideLoading();
    }
};

// 회원가입 처리 함수
const handleRegister = async (e) => {
    console.log('회원가입 함수 호출됨');
    e.preventDefault();
    
    const email = registerEmail.value.trim();
    const password = registerPassword.value;
    const confirmPassword = registerConfirm.value;
    
    console.log('입력값:', { email, password: password.length, confirmPassword: confirmPassword.length });
    
    // 입력값 검증
    if (!validateEmail(email)) {
        showFormError('register', 'register-email', '올바른 이메일 형식을 입력해주세요.');
        return;
    }
    
    if (!validatePassword(password)) {
        showFormError('register', 'register-password', '비밀번호는 6자리 이상이어야 합니다.');
        return;
    }
    
    if (password !== confirmPassword) {
        showFormError('register', 'register-confirm', '비밀번호가 일치하지 않습니다.');
        return;
    }
    
    try {
        showLoading();
        clearFormErrors('register');
        
        // Firebase 회원가입
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('회원가입 성공:', user.email);
        showNotification('회원가입에 성공했습니다!', 'success');
        
        // 사용자 상태 업데이트
        currentUser = user;
        
        // 사용자 정보 UI 업데이트
        updateUserInfo(user);
        
        // 헤더 UI 업데이트
        updateHeaderForLoggedInUser();
        
        // 폼 초기화
        registerForm.reset();
        
        // 홈 화면으로 전환
        showView('home-view');
        
    } catch (error) {
        console.error('회원가입 실패:', error);
        handleAuthError(error, 'register');
    } finally {
        hideLoading();
    }
};

// 로그아웃 처리 함수
const handleLogout = async () => {
    try {
        showLoading();
        
        // Firebase 로그아웃
        await signOut(auth);
        
        console.log('로그아웃 성공');
        
        // 사용자 상태 초기화
        currentUser = null;
        
        // 사용자 정보 UI 초기화
        clearUserInfo();
        
        // 헤더 UI 초기화
        updateHeaderForLoggedOutUser();
        
        // 홈 화면 사용자 상태 업데이트
        updateHomeUserStatus();
        
        // 퀴즈 상태 초기화
        resetQuizState();
        
        // 홈 화면으로 전환
        showView('home-view');
        
        showNotification('로그아웃되었습니다.', 'info');
        
    } catch (error) {
        console.error('로그아웃 실패:', error);
        showNotification('로그아웃에 실패했습니다.', 'error');
    } finally {
        hideLoading();
    }
};

// ===== 인증 유틸리티 함수들 =====

// 이메일 형식 검증
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// 비밀번호 검증 (6자리 이상)
const validatePassword = (password) => {
    return password && password.length >= 6;
};

// 폼 에러 표시
const showFormError = (formType, fieldId, message) => {
    const form = formType === 'login' ? loginForm : registerForm;
    const field = document.getElementById(fieldId);
    
    if (form && field) {
        // 기존 에러 메시지 제거
        const existingError = form.querySelector(`#${fieldId}-error`);
        if (existingError) {
            existingError.remove();
        }
        
        // 에러 스타일 적용
        field.classList.add('error');
        
        // 에러 메시지 생성
        const errorElement = document.createElement('div');
        errorElement.id = `${fieldId}-error`;
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        
        // 필드 다음에 에러 메시지 삽입
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
};

// 인증 에러 처리
const handleAuthError = (error, formType) => {
    let errorMessage = '알 수 없는 오류가 발생했습니다.';
    
    switch (error.code) {
        case 'auth/user-not-found':
            errorMessage = '등록되지 않은 이메일입니다.';
            break;
        case 'auth/wrong-password':
            errorMessage = '잘못된 비밀번호입니다.';
            break;
        case 'auth/email-already-in-use':
            errorMessage = '이미 사용 중인 이메일입니다.';
            break;
        case 'auth/weak-password':
            errorMessage = '비밀번호가 너무 약합니다. 6자리 이상 입력해주세요.';
            break;
        case 'auth/invalid-email':
            errorMessage = '올바른 이메일 형식이 아닙니다.';
            break;
        case 'auth/too-many-requests':
            errorMessage = '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
            break;
        case 'auth/network-request-failed':
            errorMessage = '네트워크 연결을 확인해주세요.';
            break;
        default:
            errorMessage = error.message || errorMessage;
    }
    
    showNotification(errorMessage, 'error');
    
    // 폼 필드에 에러 표시
    if (formType === 'login') {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            showFormError('login', 'login-email', errorMessage);
        }
    } else if (formType === 'register') {
        if (error.code === 'auth/email-already-in-use') {
            showFormError('register', 'register-email', errorMessage);
        } else if (error.code === 'auth/weak-password') {
            showFormError('register', 'register-password', errorMessage);
        }
    }
};

// 퀴즈 상태 초기화
const resetQuizState = () => {
    currentQuestionIndex = 0;
    userScore = 0;
    userAnswers = [];
    quizStartTime = null;
    
    // UI 초기화
    if (questionCounter) questionCounter.textContent = '문제 1 / 0';
    if (progressFill) progressFill.style.width = '0%';
    if (currentScore) currentScore.textContent = '0';
    
    // 답안 컨테이너 숨김
    const answerContainers = [multipleChoice, fillInBlank];
    answerContainers.forEach(container => {
        if (container) container.classList.add('hidden');
    });
    
    // 버튼 상태 초기화
    if (submitBtn) {
        submitBtn.textContent = '제출';
        submitBtn.classList.remove('hidden');
    }
    if (nextBtn) {
        nextBtn.classList.add('hidden');
    }
};

// 실시간 입력 검증
const setupRealTimeValidation = () => {
    // 비밀번호 실시간 검증
    if (registerPassword) {
        registerPassword.addEventListener('input', (e) => {
            const password = e.target.value;
            if (password.length > 0 && password.length < 6) {
                showFormError('register', 'register-password', '비밀번호는 6자리 이상이어야 합니다.');
            } else {
                clearFieldError('register', 'register-password');
            }
        });
    }
    
    // 비밀번호 확인 실시간 검증
    if (registerConfirm) {
        registerConfirm.addEventListener('input', (e) => {
            const password = registerPassword.value;
            const confirmPassword = e.target.value;
            if (confirmPassword.length > 0 && password !== confirmPassword) {
                showFormError('register', 'register-confirm', '비밀번호가 일치하지 않습니다.');
            } else {
                clearFieldError('register', 'register-confirm');
            }
        });
    }
    
    // 이메일 실시간 검증
    [loginEmail, registerEmail].forEach(emailField => {
        if (emailField) {
            emailField.addEventListener('blur', (e) => {
                const email = e.target.value.trim();
                const formType = emailField.id.includes('login') ? 'login' : 'register';
                if (email.length > 0 && !validateEmail(email)) {
                    showFormError(formType, emailField.id, '올바른 이메일 형식을 입력해주세요.');
                } else {
                    clearFieldError(formType, emailField.id);
                }
            });
        }
    });
};

// 개별 필드 에러 제거
const clearFieldError = (formType, fieldId) => {
    const form = formType === 'login' ? loginForm : registerForm;
    const field = document.getElementById(fieldId);
    
    if (form && field) {
        // 에러 메시지 제거
        const errorElement = form.querySelector(`#${fieldId}-error`);
        if (errorElement) {
            errorElement.remove();
        }
        
        // 에러 스타일 제거
        field.classList.remove('error');
    }
};

// ===== 퀴즈 제출 및 채점 로직 =====

// 답안 제출 처리
const handleSubmitAnswer = () => {
    const question = quizQuestions[currentQuestionIndex];
    if (!question) {
        console.error('현재 문제를 찾을 수 없습니다.');
        return;
    }
    
    // 사용자 답안 가져오기
    const userAnswer = getUserAnswer();
    if (userAnswer === null || userAnswer === undefined) {
        showNotification('답을 선택하거나 입력해주세요.', 'warning');
        return;
    }
    
    console.log('답안 제출:', userAnswer);
    
    // 답안 저장
    saveUserAnswer(userAnswer);
    
    // 채점 및 피드백 표시
    const isCorrect = checkAnswer(question, userAnswer);
    showAnswerFeedback(question, userAnswer, isCorrect);
    
    // 점수 업데이트
    updateScore(isCorrect);
    
    // 버튼 상태 변경 (제출 → 다음)
    updateSubmitButtonToNext();
};

// 다음 문제 처리
const handleNextQuestion = () => {
    // 다음 문제로 이동
    currentQuestionIndex++;
    
    // 진행률 업데이트
    updateQuizProgress();
    
    // 다음 문제가 있는지 확인
    if (currentQuestionIndex < quizQuestions.length) {
        // 다음 문제 로드
        loadCurrentQuestion();
    } else {
        // 모든 문제 완료
        showQuizResults();
    }
};

// 답안 피드백 표시
const showAnswerFeedback = (question, userAnswer, isCorrect) => {
    const questionElement = questionText;
    if (!questionElement) return;
    
    // 기존 피드백 제거
    clearAnswerFeedback();
    
    // 피드백 컨테이너 생성
    const feedbackContainer = document.createElement('div');
    feedbackContainer.className = 'answer-feedback';
    feedbackContainer.style.marginTop = '1rem';
    feedbackContainer.style.padding = '1rem';
    feedbackContainer.style.borderRadius = '8px';
    feedbackContainer.style.border = '2px solid';
    
    if (isCorrect) {
        feedbackContainer.classList.add('correct');
        feedbackContainer.style.backgroundColor = '#d4edda';
        feedbackContainer.style.borderColor = '#c3e6cb';
        feedbackContainer.style.color = '#155724';
        
        const correctIcon = document.createElement('span');
        correctIcon.textContent = '✓ ';
        correctIcon.style.fontWeight = 'bold';
        correctIcon.style.fontSize = '1.2em';
        feedbackContainer.appendChild(correctIcon);
        
        const correctText = document.createElement('span');
        correctText.textContent = '정답입니다!';
        correctText.style.fontWeight = 'bold';
        feedbackContainer.appendChild(correctText);
    } else {
        feedbackContainer.classList.add('incorrect');
        feedbackContainer.style.backgroundColor = '#f8d7da';
        feedbackContainer.style.borderColor = '#f5c6cb';
        feedbackContainer.style.color = '#721c24';
        
        const incorrectIcon = document.createElement('span');
        incorrectIcon.textContent = '✗ ';
        incorrectIcon.style.fontWeight = 'bold';
        incorrectIcon.style.fontSize = '1.2em';
        feedbackContainer.appendChild(incorrectIcon);
        
        const incorrectText = document.createElement('span');
        incorrectText.textContent = '틀렸습니다.';
        incorrectText.style.fontWeight = 'bold';
        feedbackContainer.appendChild(incorrectText);
        
        // 정답 표시 (객관식, 빈칸 채우기)
        if (question.type === 'multiple-choice') {
            const correctAnswerText = document.createElement('div');
            correctAnswerText.style.marginTop = '0.5rem';
            correctAnswerText.innerHTML = `<strong>정답:</strong> ${question.options[question.correctAnswer]}`;
            feedbackContainer.appendChild(correctAnswerText);
        } else if (question.type === 'fill-in-blank') {
            const correctAnswerText = document.createElement('div');
            correctAnswerText.style.marginTop = '0.5rem';
            correctAnswerText.innerHTML = `<strong>정답:</strong> ${question.correctAnswer}`;
            feedbackContainer.appendChild(correctAnswerText);
        }
    }
    
    // 해설 표시
    if (question.explanation) {
        const explanationDiv = document.createElement('div');
        explanationDiv.style.marginTop = '0.5rem';
        explanationDiv.style.fontSize = '0.9em';
        explanationDiv.innerHTML = `<strong>해설:</strong> ${question.explanation}`;
        feedbackContainer.appendChild(explanationDiv);
    }
    
    // 문제 텍스트 다음에 피드백 삽입
    questionElement.parentNode.insertBefore(feedbackContainer, questionElement.nextSibling);
    
    // 선택된 옵션 하이라이트 (객관식)
    if (question.type === 'multiple-choice') {
        highlightSelectedOption(userAnswer, isCorrect);
    }
};

// 선택된 옵션 하이라이트
const highlightSelectedOption = (selectedIndex, isCorrect) => {
    const selectedOption = document.querySelector(`input[name="quiz-option"]:checked`);
    if (selectedOption) {
        const optionItem = selectedOption.closest('.option-item');
        if (optionItem) {
            if (isCorrect) {
                optionItem.classList.add('correct');
            } else {
                optionItem.classList.add('incorrect');
            }
        }
    }
};

// 답안 피드백 제거
const clearAnswerFeedback = () => {
    const existingFeedback = document.querySelector('.answer-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    const existingModelAnswer = document.querySelector('.model-answer');
    if (existingModelAnswer) {
        existingModelAnswer.remove();
    }
    
    // 옵션 하이라이트 제거
    const highlightedOptions = document.querySelectorAll('.option-item.correct, .option-item.incorrect');
    highlightedOptions.forEach(option => {
        option.classList.remove('correct', 'incorrect');
    });
};

// 제출 버튼을 다음 버튼으로 변경
const updateSubmitButtonToNext = () => {
    if (submitBtn) {
        submitBtn.classList.add('hidden');
    }
    
    if (nextBtn) {
        nextBtn.classList.remove('hidden');
        nextBtn.disabled = false;
    }
};

// 개선된 답안 채점 로직
const checkAnswer = (question, userAnswer) => {
    if (userAnswer === null || userAnswer === undefined) return false;
    
    switch (question.type) {
        case 'multiple-choice':
            return userAnswer === question.correctAnswer;
            
        case 'fill-in-blank':
            // trim()과 toLowerCase() 적용하여 비교
            const correctAnswer = question.correctAnswer.trim().toLowerCase();
            const userAnswerProcessed = userAnswer.trim().toLowerCase();
            return correctAnswer === userAnswerProcessed;
            
        default:
            return false;
    }
};

// 개선된 점수 업데이트
const updateScore = (isCorrect) => {
    if (isCorrect) {
        userScore += 10; // 문제당 10점
        updateScoreDisplay();
        
        // 정답 알림
        showNotification('정답입니다! +10점', 'success');
    } else {
        // 오답 알림
        showNotification('틀렸습니다. 다음 문제로 넘어가세요.', 'warning');
    }
};

// 퀴즈 재시작 처리
const handleRetryQuiz = () => {
    console.log('퀴즈 재시작');
    
    // 퀴즈 상태 초기화
    currentQuestionIndex = 0;
    userScore = 0;
    userAnswers = [];
    quizStartTime = new Date();
    
    // UI 초기화
    updateQuizProgress();
    updateScoreDisplay();
    
    // 기존 피드백 제거
    clearAnswerFeedback();
    
    // 퀴즈 뷰로 전환
    showView('quiz-view');
    
    // 첫 번째 문제 로드
    if (quizQuestions.length > 0) {
        loadCurrentQuestion();
    }
    
    showNotification('퀴즈를 다시 시작합니다!', 'info');
};

// ===== 랭킹 보드 기능 =====

// 랭킹 로드
const loadRanking = async () => {
    try {
        console.log('랭킹 로드 시작');
        showLoading();
        
        // 랭킹 데이터 가져오기
        const rankings = await getTopRankings(10);
        
        // 랭킹 UI 렌더링
        renderRankingList(rankings);
        
        // 마지막 업데이트 시간 표시
        updateLastUpdatedTime();
        
        console.log('랭킹 로드 완료:', rankings.length, '개');
        
    } catch (error) {
        console.error('랭킹 로드 실패:', error);
        showNotification('랭킹을 불러오는데 실패했습니다.', 'error');
        renderRankingError();
    } finally {
        hideLoading();
    }
};

// 상위 랭킹 조회
const getTopRankings = async (limit = 10) => {
    try {
        // 로컬 모드에서는 localStorage에서 랭킹 데이터 가져오기
        if (!db) {
            console.log('로컬 모드: localStorage에서 랭킹 데이터 조회');
            const localScores = JSON.parse(localStorage.getItem('quiz_scores') || '[]');
            
            // 점수순으로 정렬하고 상위 N개 반환
            const sortedScores = localScores
                .sort((a, b) => {
                    if (b.score !== a.score) return b.score - a.score;
                    return new Date(b.createdAt) - new Date(a.createdAt);
                })
                .slice(0, limit);
            
            return sortedScores.map((score, index) => ({
                id: `local_${index}`,
                rank: index + 1,
                userId: score.userId || 'guest',
                userEmail: score.userEmail || 'guest@example.com',
                score: score.score,
                totalQuestions: score.totalQuestions,
                correctAnswers: score.correctAnswers,
                accuracy: score.accuracy,
                duration: score.duration,
                createdAt: score.createdAt,
                quizEndTime: score.quizEndTime
            }));
        }
        
        // Firebase 모드
        const rankingsQuery = query(
            collection(db, 'scores'),
            orderBy('score', 'desc'),
            orderBy('createdAt', 'desc'), // 같은 점수일 때 최신순
            limit(limit)
        );
        
        const querySnapshot = await getDocs(rankingsQuery);
        const rankings = [];
        
        querySnapshot.forEach((doc, index) => {
            const data = doc.data();
            rankings.push({
                id: doc.id,
                rank: index + 1,
                userId: data.userId,
                userEmail: data.userEmail,
                score: data.score,
                totalQuestions: data.totalQuestions,
                correctAnswers: data.correctAnswers,
                accuracy: data.accuracy,
                duration: data.duration,
                createdAt: data.createdAt,
                quizEndTime: data.quizEndTime
            });
        });
        
        return rankings;
    } catch (error) {
        console.error('랭킹 조회 실패:', error);
        throw error;
    }
};

// 랭킹 리스트 렌더링
const renderRankingList = (rankings) => {
    if (!rankingListContent) {
        console.error('랭킹 리스트 컨테이너를 찾을 수 없습니다.');
        return;
    }
    
    // 기존 내용 제거
    rankingListContent.innerHTML = '';
    
    if (rankings.length === 0) {
        renderEmptyRanking();
        return;
    }
    
    // 랭킹 아이템 생성
    rankings.forEach((ranking, index) => {
        const rankingItem = createRankingItem(ranking, index);
        rankingListContent.appendChild(rankingItem);
    });
    
    // 현재 사용자 하이라이트
    highlightCurrentUser(rankings);
};

// 랭킹 아이템 생성
const createRankingItem = (ranking, index) => {
    const item = document.createElement('div');
    item.className = 'ranking-item';
    item.dataset.userId = ranking.userId;
    
    // 순위에 따른 스타일 적용
    if (index < 3) {
        item.classList.add(`rank-${index + 1}`);
    }
    
    // 사용자명 추출 (이메일에서)
    const username = ranking.userEmail.split('@')[0];
    
    // 시간 포맷팅
    const timeAgo = formatTimeAgo(ranking.quizEndTime);
    
    // 정확도 포맷팅
    const accuracyText = ranking.accuracy ? `${ranking.accuracy}%` : '-';
    
    // 소요 시간 포맷팅
    const durationText = formatDuration(ranking.duration);
    
    item.innerHTML = `
        <span class="rank">${ranking.rank}</span>
        <span class="user">${username}</span>
        <span class="score">${ranking.score}</span>
        <span class="date">${timeAgo}</span>
    `;
    
    // 상세 정보 툴팁
    item.title = `정답: ${ranking.correctAnswers}/${ranking.totalQuestions} (${accuracyText})\n소요시간: ${durationText}`;
    
    return item;
};

// 빈 랭킹 표시
const renderEmptyRanking = () => {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-ranking';
    emptyMessage.style.textAlign = 'center';
    emptyMessage.style.padding = '2rem';
    emptyMessage.style.color = '#666';
    
    emptyMessage.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">🏆</div>
        <h3>아직 랭킹이 없습니다</h3>
        <p>첫 번째로 퀴즈를 완료해보세요!</p>
    `;
    
    rankingListContent.appendChild(emptyMessage);
};

// 랭킹 에러 표시
const renderRankingError = () => {
    if (!rankingListContent) return;
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'ranking-error';
    errorMessage.style.textAlign = 'center';
    errorMessage.style.padding = '2rem';
    errorMessage.style.color = '#dc3545';
    
    errorMessage.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
        <h3>랭킹을 불러올 수 없습니다</h3>
        <p>네트워크 연결을 확인하고 다시 시도해주세요.</p>
        <button onclick="loadRanking()" class="btn btn-primary" style="margin-top: 1rem;">
            다시 시도
        </button>
    `;
    
    rankingListContent.innerHTML = '';
    rankingListContent.appendChild(errorMessage);
};

// 현재 사용자 하이라이트
const highlightCurrentUser = (rankings) => {
    if (!currentUser) return;
    
    const currentUserItem = document.querySelector(`[data-user-id="${currentUser.uid}"]`);
    if (currentUserItem) {
        currentUserItem.classList.add('current-user');
        currentUserItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

// 마지막 업데이트 시간 표시
const updateLastUpdatedTime = () => {
    if (lastUpdatedTime) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        lastUpdatedTime.textContent = timeString;
    }
};

// 시간 포맷팅 (상대적 시간)
const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '-';
    
    const now = new Date();
    const time = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffMs = now - time;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) {
        return '방금 전';
    } else if (diffMinutes < 60) {
        return `${diffMinutes}분 전`;
    } else if (diffHours < 24) {
        return `${diffHours}시간 전`;
    } else if (diffDays < 7) {
        return `${diffDays}일 전`;
    } else {
        return time.toLocaleDateString('ko-KR');
    }
};

// 소요 시간 포맷팅
const formatDuration = (durationMs) => {
    if (!durationMs) return '-';
    
    const minutes = Math.floor(durationMs / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    
    if (minutes > 0) {
        return `${minutes}분 ${seconds}초`;
    } else {
        return `${seconds}초`;
    }
};


// 랭킹 새로고침
const refreshRanking = () => {
    console.log('랭킹 새로고침');
    loadRanking();
    showNotification('랭킹을 새로고침했습니다.', 'info');
};

// 사용자별 랭킹 조회
const getUserRanking = async (userId) => {
    try {
        const allRankings = await getTopRankings(1000); // 충분히 큰 수
        const userRanking = allRankings.find(ranking => ranking.userId === userId);
        
        if (userRanking) {
            return userRanking.rank;
        }
        
        return null;
    } catch (error) {
        console.error('사용자 랭킹 조회 실패:', error);
        return null;
    }
};

// ===== 앱 시작 =====
// 즉시 앱 초기화 시도
console.log('스크립트 로드 완료');

// Firebase 초기화 완료를 기다린 후 앱 초기화
const checkFirebaseAndInit = () => {
    console.log('Firebase 함수 확인 중...');
    console.log('window.createUserWithEmailAndPassword:', window.createUserWithEmailAndPassword);
    console.log('window.signInWithEmailAndPassword:', window.signInWithEmailAndPassword);
    
    // Firebase 함수들이 존재하는지 확인 (로컬 모드 포함)
    if (window.createUserWithEmailAndPassword && window.signInWithEmailAndPassword) {
        console.log('Firebase 함수들이 준비됨 - 앱 초기화 시작');
        initializeApp();
    } else {
        console.log('Firebase 함수들 대기 중... 100ms 후 재시도');
        setTimeout(checkFirebaseAndInit, 100);
    }
};

// 즉시 확인
checkFirebaseAndInit();
