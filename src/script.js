// IT 기술 퀴즈 앱 - 메인 JavaScript 모듈
// Vanilla JavaScript + Firebase + ES6 모듈

// ===== Firebase 모듈 Import =====
import { 
    auth, 
    db, 
    validateFirebaseConfig, 
    checkFirebaseConnection 
} from './firebase-config.js';

import {
    // Authentication 관련
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    
    // Firestore 관련
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit,
    serverTimestamp
} from 'firebase/firestore';

// ===== DOM 요소 변수 선언 =====

// 뷰 섹션들
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
const shortAnswer = document.getElementById('short-answer');
const blankInput = document.getElementById('blank-input');
const answerTextarea = document.getElementById('answer-textarea');

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
const refreshRanking = document.getElementById('refresh-ranking');
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
        // Firebase 설정 검증
        if (!validateFirebaseConfig()) {
            showNotification('Firebase 설정을 확인해주세요.', 'error');
            return;
        }

        // Firebase 연결 확인
        const isConnected = await checkFirebaseConnection();
        if (!isConnected) {
            showNotification('Firebase 연결에 실패했습니다.', 'error');
            return;
        }

        // 인증 상태 리스너 설정
        setupAuthStateListener();
        
        // 이벤트 리스너 설정
        setupEventListeners();
        
        // 퀴즈 데이터 로드
        loadQuizData();
        
        console.log('앱 초기화 완료');
        
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
    // 모든 뷰 숨김
    const views = [loginView, registerView, quizView, resultsView, rankingView];
    views.forEach(view => {
        if (view) {
            view.classList.add('hidden');
        }
    });
    
    // 선택된 뷰만 표시
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.remove('hidden');
        console.log(`뷰 전환: ${viewId}`);
        
        // 특정 뷰로 전환 시 추가 처리
        handleViewTransition(viewId);
    } else {
        console.error(`뷰를 찾을 수 없습니다: ${viewId}`);
    }
};

// 뷰 전환 시 추가 처리 함수
const handleViewTransition = (viewId) => {
    switch (viewId) {
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

// 퀴즈 초기화 (다음 단계에서 구현)
const initializeQuiz = () => {
    console.log('퀴즈 초기화 (구현 예정)');
    // 퀴즈 상태 초기화
    currentQuestionIndex = 0;
    userScore = 0;
    userAnswers = [];
    quizStartTime = new Date();
    
    // UI 초기화
    updateQuizProgress();
    updateScoreDisplay();
};

// 결과 표시 (다음 단계에서 구현)
const displayResults = () => {
    console.log('결과 표시 (구현 예정)');
    // 최종 점수 및 통계 표시
};

// 랭킹 로드 (다음 단계에서 구현)
const loadRanking = () => {
    console.log('랭킹 로드 (구현 예정)');
    // Firestore에서 랭킹 데이터 로드
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
    // 알림 닫기 버튼
    closeNotification.addEventListener('click', hideNotification);
    
    // 인증 관련 이벤트
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    showRegister.addEventListener('click', () => showView('register-view'));
    showLogin.addEventListener('click', () => showView('login-view'));
    logoutBtn.addEventListener('click', handleLogout);
    
    // 퀴즈 관련 이벤트
    submitBtn.addEventListener('click', handleSubmitAnswer);
    nextBtn.addEventListener('click', handleNextQuestion);
    
    // 결과 관련 이벤트
    retryQuiz.addEventListener('click', handleRetryQuiz);
    viewRanking.addEventListener('click', () => showView('ranking-view'));
    
    // 랭킹 관련 이벤트
    refreshRanking.addEventListener('click', loadRanking);
    backToQuiz.addEventListener('click', () => showView('quiz-view'));
    backToHome.addEventListener('click', () => showView('login-view'));
};

// ===== 인증 상태 리스너 설정 =====
const setupAuthStateListener = () => {
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        
        if (user) {
            // 로그인된 상태
            userInfo.textContent = `안녕하세요, ${user.email}님`;
            userInfo.classList.remove('hidden');
            logoutBtn.classList.remove('hidden');
            showView('quiz-view');
        } else {
            // 로그아웃된 상태
            userInfo.classList.add('hidden');
            logoutBtn.classList.add('hidden');
            showView('login-view');
        }
    });
};

// ===== 퀴즈 데이터 로드 함수 =====
const loadQuizData = () => {
    // 하드코딩된 퀴즈 데이터 (나중에 확장 가능)
    quizQuestions = [
        // 퀴즈 데이터는 다음 단계에서 추가
    ];
    
    console.log('퀴즈 데이터 로드 완료:', quizQuestions.length, '개 문제');
};

// ===== 이벤트 핸들러 함수들 (다음 단계에서 구현) =====
const handleLogin = (e) => {
    e.preventDefault();
    console.log('로그인 처리 (구현 예정)');
};

const handleRegister = (e) => {
    e.preventDefault();
    console.log('회원가입 처리 (구현 예정)');
};

const handleLogout = () => {
    console.log('로그아웃 처리 (구현 예정)');
};

const handleSubmitAnswer = () => {
    console.log('답안 제출 처리 (구현 예정)');
};

const handleNextQuestion = () => {
    console.log('다음 문제 처리 (구현 예정)');
};

const handleRetryQuiz = () => {
    console.log('퀴즈 재시작 처리 (구현 예정)');
};

const loadRanking = () => {
    console.log('랭킹 로드 처리 (구현 예정)');
};

// ===== 앱 시작 =====
document.addEventListener('DOMContentLoaded', initializeApp);
