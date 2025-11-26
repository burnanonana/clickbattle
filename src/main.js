// --- 고양이 데이터 설정 (파일 이름은 ID로 사용하기 위해 확장자(.png)를 제거합니다.) ---
// ⭐ 목표 클릭 수를 설정합니다. (클릭 유도 핵심)
const CAT_STAGES = {
    1: { name: "원시 고양이", fileId: "c1", targetClicks: 20 }, 
    2: [
        { name: "신사 고양이", fileId: "c2-1", targetClicks: 40 },
        { name: "K 고양이", fileId: "c2-2", targetClicks: 40 }
    ],
    3: [
        { name: "아이돌 고양이", fileId: "c3-1", targetClicks: 60 },
        { name: "외계 고양이", fileId: "c3-2", targetClicks: 60 }
    ],
    4: [ // 4단계는 엔딩이므로 targetClicks가 없습니다.
        { name: "??? 고양이", fileId: "c4-1" },
        { name: "고숭이", fileId: "c4-2" }
    ]
};

// --- DOM 요소 참조 ---
const allCatImages = document.querySelectorAll('.cat-image'); // 모든 이미지 요소
const currentStageEl = document.getElementById('current-stage');
const catNameEl = document.getElementById('cat-name');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const feedButton = document.getElementById('feed-button');
const resetButton = document.getElementById('reset-button');

// --- 상태 변수 ---
let currentStage = 1;
let currentClicks = 0;
let currentCatData = null; 

// --- 함수 정의 ---

// 현재 단계에 맞는 고양이 데이터와 클릭 목표를 가져오는 함수
function getStageData(stage) {
    const stageData = CAT_STAGES[stage];
    if (Array.isArray(stageData)) {
        // 2, 3, 4단계: 랜덤으로 하나 선택
        return stageData[Math.floor(Math.random() * stageData.length)];
    }
    return stageData;
}

// 화면을 업데이트하고 고양이 이미지를 변경하는 함수
function updateUI() {
    const data = currentCatData;
    
    // 1. ⭐ 이미지 변경 로직 ⭐
    allCatImages.forEach(img => {
        img.classList.remove('active');
    });

    const activeImage = document.getElementById(data.fileId);
    if (activeImage) {
        activeImage.classList.add('active');
    }

    // 2. 텍스트 업데이트
    currentStageEl.textContent = `${currentStage}단계`;
    catNameEl.textContent = data.name;

    // 3. 게이지 및 버튼 처리
    if (currentStage < 4) {
        // 1~3단계: 게이지 표시, 버튼 활성화
        progressContainer.classList.remove('hidden');
        feedButton.classList.remove('hidden');
        resetButton.classList.add('hidden');

        const percentage = (currentClicks / data.targetClicks) * 100;
        progressBar.style.width = `${Math.min(100, percentage)}%`; 
    } else {
        // 4단계 (엔딩): 게이지 숨김, 리셋 버튼 표시
        progressContainer.classList.add('hidden');
        feedButton.classList.add('hidden');
        resetButton.classList.remove('hidden');
    }
}

function evolveCat() {
    if (currentStage >= 4) return;
    
    currentStage += 1;
    currentClicks = 0; // 클릭 수 리셋
    currentCatData = getStageData(currentStage); // 새 단계의 고양이 랜덤 선택

    // 팝업 (alert) 대신, 시각적 변화만 적용
    
    // ⭐ 시각적 변화를 강조하기 위한 코드 ⭐
    const catDisplay = document.querySelector('.cat-display');
    
    // 1. 고양이 이미지 영역에 잠시 '진화 중' 효과를 줍니다. (CSS에 추가 효과를 줄 수 있음)
    catDisplay.style.boxShadow = '0 0 20px 5px #5c6fff'; 
    
    // 2. 잠시 후 효과 제거 및 UI 업데이트 (새 고양이 이미지를 보여줌)
    setTimeout(() => {
        catDisplay.style.boxShadow = 'none'; 
        updateUI(); 
        
        // 3. 엔딩이 아닐 경우, 버튼에 "다음 목표" 메시지를 잠시 표시 (선택 사항)
        if (currentStage < 4) {
            feedButton.textContent = `진화 완료! (${currentCatData.targetClicks}회 목표)`;
            setTimeout(() => {
                feedButton.textContent = '고양이 밥주기!';
            }, 1500); // 1.5초 후 원래 텍스트로 복귀
        }
    }, 500); // 0.5초 동안 진화 효과 유지

    // 이전의 alert() 코드는 완전히 제거되었습니다.
    // alert(`${currentCatData.name}으로 진화했습니다!`); 
}

// 밥주기 버튼 클릭 이벤트 핸들러 (클릭 유도)
function handleFeed() {
    if (currentStage >= 4) return; 

    currentClicks += 1;
    const data = currentCatData;

    if (currentClicks >= data.targetClicks) {
        evolveCat();
    } else {
        updateUI(); 
    }
}

// 리셋 버튼 이벤트 핸들러도 수정합니다.
function handleReset() {
    currentStage = 1;
    currentClicks = 0;
    currentCatData = getStageData(1);
    
    // 이전의 alert() 코드는 완전히 제거되었습니다.
    // alert("새로운 고양이를 키우기 시작합니다!");
    
    // 팝업 대신 UI만 업데이트합니다.
    updateUI(); 
}

// --- 이벤트 리스너 등록 ---
feedButton.addEventListener('click', handleFeed);
resetButton.addEventListener('click', handleReset);

// --- 초기 실행 ---
// 1단계 고양이로 초기 설정 및 UI 업데이트
currentCatData = getStageData(1);
updateUI();