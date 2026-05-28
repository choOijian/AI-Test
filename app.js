/**
 * Real or Ai? - Redesigned Web Exhibition Controller (Neon Green Editorial UI)
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- STATE ---
  const state = {
    nickname: '',
    expectedAccuracy: 50,
    selections: new Set(),
    currentUserId: null,
    startTime: 0,
    endTime: 0,
    hesitationScore: 0
  };

  // --- INITIAL MOCK DATA (Seeding LocalStorage) ---
  const MOCK_LEADERBOARD = [
    { id: 'mock_1', nickname: 'MINJI', expectedAccuracy: 90, actualAccuracy: 42, aiMistakeRate: 56, humanMistakeRate: 20, resultType: 'AI 친화형', createdAt: Date.now() - 36000000 },
    { id: 'mock_2', nickname: 'JIAN', expectedAccuracy: 80, actualAccuracy: 37, aiMistakeRate: 63, humanMistakeRate: 30, resultType: '분위기 몰입러', createdAt: Date.now() - 28800000 },
    { id: 'mock_3', nickname: 'LEE', expectedAccuracy: 70, actualAccuracy: 75, aiMistakeRate: 30, humanMistakeRate: 15, resultType: '촉 좋은 감별러', createdAt: Date.now() - 21600000 },
    { id: 'mock_4', nickname: 'SOO', expectedAccuracy: 85, actualAccuracy: 50, aiMistakeRate: 67, humanMistakeRate: 40, resultType: '자신감 MAX형', createdAt: Date.now() - 14400000 },
    { id: 'mock_5', nickname: 'YUNA', expectedAccuracy: 75, actualAccuracy: 60, aiMistakeRate: 40, humanMistakeRate: 25, resultType: '일단 찍어형', createdAt: Date.now() - 7200000 }
  ];

  function seedLeaderboard() {
    if (!localStorage.getItem('realOrAiResults')) {
      localStorage.setItem('realOrAiResults', JSON.stringify(MOCK_LEADERBOARD));
    }
  }
  seedLeaderboard();

  // --- ROUTING / SCREEN SYSTEM ---
  const screens = {
    home: document.getElementById('screen-home'),
    pretest: document.getElementById('screen-pretest'),
    imageTest: document.getElementById('screen-image-test'),
    videoTest: document.getElementById('screen-video-test'),
    textTest: document.getElementById('screen-text-test'),
    analysis: document.getElementById('screen-analysis'),
    personalResult: document.getElementById('screen-personal-result'),
    collectiveResult: document.getElementById('screen-collective-result'),
    ending: document.getElementById('screen-ending')
  };

  function showScreen(screenKey) {
    Object.values(screens).forEach(screen => {
      screen.classList.remove('active');
    });
    const activeScreen = screens[screenKey];
    activeScreen.classList.add('active');
  }

  // --- HOME SCREEN EVENTS ---
  document.getElementById('btn-to-pretest').addEventListener('click', () => {
    showScreen('pretest');
  });

  // --- PRE TEST SCREEN EVENTS ---
  const nicknameInput = document.getElementById('input-nickname');
  const expectedSlider = document.getElementById('slider-expected');
  const sliderBubble = document.getElementById('slider-bubble');

  expectedSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    sliderBubble.innerText = `${val}%`;
    state.expectedAccuracy = parseInt(val, 10);
  });

  document.getElementById('btn-start-test').addEventListener('click', () => {
    const name = nicknameInput.value.trim();
    if (!name) {
      alert('닉네임을 입력해 주세요.');
      nicknameInput.focus();
      return;
    }
    state.nickname = name;
    state.startTime = Date.now();
    state.hesitationScore = 0;
    
    renderImageGrid();
    renderVideoGrid();
    renderTextGrid();

    showScreen('imageTest');
  });

  // --- COUNTERS & BUTTON STATES ---
  function updateCounts() {
    let imgCount = 0, vidCount = 0, textCount = 0;
    state.selections.forEach(id => {
      if (id.startsWith('img_')) imgCount++;
      else if (id.startsWith('vid_')) vidCount++;
      else if (id.startsWith('text_')) textCount++;
    });
    
    // Update count display
    if (document.getElementById('img-sel-count')) document.getElementById('img-sel-count').innerText = imgCount;
    if (document.getElementById('vid-sel-count')) document.getElementById('vid-sel-count').innerText = vidCount;
    if (document.getElementById('text-sel-count')) document.getElementById('text-sel-count').innerText = textCount;

    // Toggle button disabled state (active if >= 1 selected)
    const btnImg = document.getElementById('btn-image-next');
    if (btnImg) { if (imgCount > 0) btnImg.classList.remove('disabled'); else btnImg.classList.add('disabled'); }
    
    const btnVid = document.getElementById('btn-video-next');
    if (btnVid) { if (vidCount > 0) btnVid.classList.remove('disabled'); else btnVid.classList.add('disabled'); }
    
    const btnText = document.getElementById('btn-text-next');
    if (btnText) { if (textCount > 0) btnText.classList.remove('disabled'); else btnText.classList.add('disabled'); }
  }

  // --- CARD GENERATOR HELPERS ---
  function renderImageGrid() {
    const grid = document.getElementById('image-grid');
    grid.innerHTML = '';
    
    testData.images.forEach((img, idx) => {
      const card = document.createElement('div');
      card.className = 'gallery-frame';
      card.setAttribute('tabindex', '0');
      card.dataset.id = img.id;
      
      const numStr = String(idx + 1).padStart(2, '0');
      card.innerHTML = `<div class="frame-number">${numStr}</div>`;
      if (img.src) {
        card.style.backgroundImage = `url('${img.src}')`;
        card.style.backgroundSize = 'cover';
        card.style.backgroundPosition = 'center';
      }

      card.addEventListener('click', () => { toggleSelection(card, img.id); updateCounts(); });
      grid.appendChild(card);
    });
  }

  function renderVideoGrid() {
    const grid = document.getElementById('video-grid');
    grid.innerHTML = '';

    testData.videos.forEach((vid, idx) => {
      const card = document.createElement('div');
      card.className = 'gallery-frame video-frame';
      card.setAttribute('tabindex', '0');
      card.dataset.id = vid.id;

      const numStr = String(idx + 1).padStart(2, '0');
      card.innerHTML = `
        <div class="frame-number">${numStr}</div>
        <div class="play-icon"></div>
      `;

      card.addEventListener('click', () => { toggleSelection(card, vid.id); updateCounts(); });
      grid.appendChild(card);
    });
  }

  function renderTextGrid() {
    const container = document.getElementById('text-container-el');
    if (!container) return;
    container.innerHTML = '';

    if (testData.text) {
      testData.text.forEach((textItem, idx) => {
        const card = document.createElement('div');
        card.className = 'text-card';
        card.setAttribute('tabindex', '0');
        card.dataset.id = textItem.id;

        const numStr = String(idx + 1).padStart(2, '0');
        card.innerHTML = `
          <div class="frame-number">${numStr}</div>
          <div class="text-author">${escapeHtml(textItem.author || '')}</div>
          <div class="text-title">${escapeHtml(textItem.title || '')}</div>
          <div class="text-snippet">${escapeHtml(textItem.content || '').substring(0, 100)}...</div>
        `;

        card.addEventListener('click', () => { toggleSelection(card, textItem.id); updateCounts(); });
        container.appendChild(card);
      });
    }
  }

  function toggleSelection(element, id) {
    state.hesitationScore++;
    if (state.selections.has(id)) {
      state.selections.delete(id);
      element.classList.remove('selected');
    } else {
      state.selections.add(id);
      element.classList.add('selected');
    }
  }

  // --- TRANSITIONAL NAVIGATION ---
  document.getElementById('btn-pretest-back').addEventListener('click', () => showScreen('home'));

  // PREV BUTTONS
  const btnImagePrev = document.getElementById('btn-image-prev');
  if (btnImagePrev) btnImagePrev.addEventListener('click', () => showScreen('pretest'));

  const btnVideoPrev = document.getElementById('btn-video-prev');
  if (btnVideoPrev) btnVideoPrev.addEventListener('click', () => showScreen('imageTest'));

  const btnTextPrev = document.getElementById('btn-text-prev');
  if (btnTextPrev) btnTextPrev.addEventListener('click', () => showScreen('videoTest'));

  // NEXT BUTTONS
  document.getElementById('btn-image-next').addEventListener('click', () => showScreen('videoTest'));
  document.getElementById('btn-video-next').addEventListener('click', () => showScreen('textTest'));
  document.getElementById('btn-text-next').addEventListener('click', () => startAnalysis());

  // Global PROJECT button -> Home
  document.querySelectorAll('.screen-header-left').forEach(el => {
    el.addEventListener('click', () => {
      showScreen('home');
    });
  });

  // --- ANALYSIS LOADER ---
  function startAnalysis() {
    state.endTime = Date.now();
    showScreen('analysis');
    const statusBar = document.getElementById('analysis-bar');
    
    // Simulate loading progress
    setTimeout(() => { statusBar.style.width = '55%'; }, 600);
    setTimeout(() => { statusBar.style.width = '80%'; }, 1500);
    setTimeout(() => { statusBar.style.width = '100%'; }, 2400);

    setTimeout(() => {
      calculateAndSaveResults();
      showScreen('personalResult');
    }, 2900);
  }

  // --- TYPE SYSTEM & CALCULATIONS ---
  // --- RESULT TYPE CALCULATION ---
  function getResultType(data) {
    const {
      actualAccuracy,
      expectedAccuracy,
      aiMistakeRate,
      imageMistakeRate,
      averageThinkingTime,
      selectionChanges
    } = data;

    // 1. 자신감 MAX형
    if (expectedAccuracy >= 80 && actualAccuracy <= 50) {
      return "자신감 MAX형";
    }

    // 2. AI 친화형
    if (aiMistakeRate >= 65) {
      return "AI 친화형";
    }

    // 3. 촉 좋은 감별러
    if (actualAccuracy >= 75 && aiMistakeRate <= 25) {
      return "촉 좋은 감별러";
    }

    // 4. 끝까지 의심형
    if (averageThinkingTime >= 6 && selectionChanges >= 5) {
      return "끝까지 의심형";
    }

    // 5. 분위기 몰입러
    if (imageMistakeRate >= 60) {
      return "분위기 몰입러";
    }

    // 6. 일단 찍어형
    return "일단 찍어형";
  }

  function getResultDescription(typeStr) {
    switch(typeStr) {
      case "촉 좋은 감별러": 
        return "생각보다 정확하게 경계를 감지했습니다.\n작은 디테일까지 비교하며 콘텐츠를 판단하는 경향이 있습니다.";
      case "분위기 몰입러": 
        return "분위기와 감정 흐름에 자연스럽게 몰입했습니다.\n시각적인 완성도가 판단에 큰 영향을 주었습니다.";
      case "일단 찍어형": 
        return "빠른 직감과 감각 중심으로 선택했습니다.\n고민보다는 즉각적인 판단을 선호하는 편입니다.";
      case "자신감 MAX형": 
        return "예상보다 AI 콘텐츠에 더 쉽게 속았습니다.\n판단에 대한 자신감과 실제 결과의 차이가 컸습니다.";
      case "AI 친화형": 
        return "AI 콘텐츠를 거부감 없이 자연스럽게 받아들였습니다.\n이미 AI 생성물에 익숙해져 있을 가능성이 높습니다.";
      case "끝까지 의심형": 
        return "쉽게 결론 내리지 않고 여러 가능성을 비교했습니다.\n판단 과정에서 신중함이 강하게 드러났습니다.";
      default: 
        return "빠른 직감과 감각 중심으로 선택했습니다.\n고민보다는 즉각적인 판단을 선호하는 편입니다.";
    }
  }

  // --- SCORING & STORAGE DB LOGIC ---
  let currentResult = null;

  function calculateAndSaveResults() {
    const allItems = [
      ...testData.images,
      ...testData.videos,
      ...(testData.text || [])
    ];

    let tp = 0; let tn = 0; let fp = 0; let fn = 0;
    const totalAI = allItems.filter(i => i.isAi).length;
    const totalHuman = allItems.filter(i => !i.isAi).length;

    allItems.forEach(item => {
      const isSelected = state.selections.has(item.id);
      if (item.isAi) { if (isSelected) tp++; else fn++; }
      else { if (isSelected) fp++; else tn++; }
    });

    const actualAccuracy = Math.round(((tp + tn) / allItems.length) * 100);
    const aiMistakeRate = totalAI ? Math.round((fn / totalAI) * 100) : 0;
    const humanMistakeRate = totalHuman ? Math.round((fp / totalHuman) * 100) : 0;

    const imageMistakes = testData.images.filter(img => {
      const isSelected = state.selections.has(img.id);
      return img.isAi ? !isSelected : isSelected;
    }).length;
    const imageMistakeRate = testData.images.length ? Math.round((imageMistakes / testData.images.length) * 100) : 0;

    const totalTimeMs = state.endTime - state.startTime;
    const averageThinkingTime = (totalTimeMs / 1000) / allItems.length;

    const tempResult = {
      actualAccuracy,
      expectedAccuracy: state.expectedAccuracy,
      aiMistakeRate,
      humanMistakeRate,
      imageMistakeRate,
      averageThinkingTime,
      selectionChanges: state.hesitationScore,
      responseSpeed: totalTimeMs / 1000
    };

    const resultType = getResultType(tempResult);

    state.currentUserId = 'user_' + Date.now();

    currentResult = {
      nickname: state.nickname,
      expectedAccuracy: state.expectedAccuracy,
      actualAccuracy: actualAccuracy,
      aiMistakeRate: aiMistakeRate,
      humanMistakeRate: humanMistakeRate,
      imageMistakeRate: imageMistakeRate,
      averageThinkingTime: averageThinkingTime,
      selectionChanges: state.hesitationScore,
      responseSpeed: tempResult.responseSpeed,
      resultType: resultType,
      createdAt: Date.now(),
      id: state.currentUserId
    };

    updatePersonalResultsUI(currentResult);
  }

  function updatePersonalResultsUI(result) {
    document.getElementById('result-nickname').innerText = result.nickname;
    
    const today = new Date(result.createdAt);
    document.getElementById('result-date').innerText = `테스트 완료일: ${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`;
    
    const valActual = document.getElementById('val-actual');
    animateNumber(valActual, result.actualAccuracy);

    const valExpected = document.getElementById('val-expected');
    animateNumber(valExpected, result.expectedAccuracy);

    document.getElementById('val-ai-mistake').innerText = `${result.aiMistakeRate}%`;
    document.getElementById('val-human-mistake').innerText = `${result.humanMistakeRate}%`;
    
    // Type UI 동적 렌더링
    const typeNameEl = document.getElementById('result-type-name');
    const cardTypeNameEl = document.getElementById('card-type-name');
    const typeDescEl = document.getElementById('result-type-desc');
    
    if (typeNameEl) typeNameEl.innerText = result.resultType;
    if (cardTypeNameEl) cardTypeNameEl.innerText = `'${result.resultType}'`;
    if (typeDescEl) typeDescEl.innerHTML = getResultDescription(result.resultType).replace(/\n/g, '<br>');
  }

  function animateNumber(elementEl, targetVal) {
    let currentVal = 0;
    const duration = 1000;
    const startTime = performance.now();

    function step(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      currentVal = Math.round(easeProgress * targetVal);
      
      elementEl.innerText = `${currentVal}%`;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // --- SAVE LOGIC ---
  function saveCurrentResult() {
    if (!currentResult) return;
    let db = JSON.parse(localStorage.getItem("realOrAiResults")) || [];
    
    const existingIndex = db.findIndex(entry => entry.id === currentResult.id);
    if (existingIndex !== -1) {
      db[existingIndex] = currentResult;
    } else {
      db.push(currentResult);
    }
    localStorage.setItem("realOrAiResults", JSON.stringify(db));

    console.log("저장할 결과:", currentResult);
    console.log("localStorage 결과:", localStorage.getItem("realOrAiResults"));
  }

  // --- COLLECTIVE RENDER LOGIC ---
  function renderCollectiveResults() {
    let results = JSON.parse(localStorage.getItem("realOrAiResults")) || [];
    console.log("렌더링할 결과 배열:", results);

    // 정렬 로직 (실제 정확도 내림차순, 같으면 최신순)
    const sorted = results.sort((a, b) => {
      if (b.actualAccuracy !== a.actualAccuracy) {
        return b.actualAccuracy - a.actualAccuracy;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const tbody = document.getElementById("collective-result-body");
    if (!tbody) {
      console.error("collective-result-body를 찾을 수 없습니다.");
      return;
    }
    
    tbody.innerHTML = "";

    if (sorted.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">아직 참여자 기록이 없습니다.</td></tr>';
      return;
    }
    
    // Auto-compress
    const container = document.getElementById('leaderboard-container');
    if (container) {
      container.classList.remove('compact', 'ultra-compact');
      if (sorted.length >= 13) {
        container.classList.add('ultra-compact');
      } else if (sorted.length >= 8) {
        container.classList.add('compact');
      }
    }

    sorted.forEach((item, index) => {
      const row = document.createElement("tr");

      const dateObj = new Date(item.createdAt);
      const dateStr = isNaN(dateObj) ? item.createdAt : `${dateObj.getFullYear()}.${String(dateObj.getMonth()+1).padStart(2,'0')}.${String(dateObj.getDate()).padStart(2,'0')}`;

      // YOU 표시 등 커스텀 포맷팅
      const isCurrentUser = currentResult && item.id === currentResult.id;
      const nickHtml = isCurrentUser 
        ? `<span class="you-badge">YOU</span>${escapeHtml(item.nickname)}`
        : escapeHtml(item.nickname);

      row.innerHTML = `
        <td>${index + 1}</td>
        <td class="nick-cell">${nickHtml}</td>
        <td class="type-badge-cell"><span class="type-badge">${escapeHtml(item.resultType)}</span></td>
        <td class="val-expected">${item.expectedAccuracy}%</td>
        <td class="actual-highlight">${item.actualAccuracy}%</td>
        <td><span class="ai-mistake-badge">${item.aiMistakeRate}%</span></td>
        <td>${dateStr}</td>
      `;

      if (isCurrentUser) {
        row.classList.add("current-user-row");
      }

      tbody.appendChild(row);

      if (isCurrentUser) {
        setTimeout(() => {
          row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/"/g, '&quot;')
                      .replace(/'/g, '&#039;');
  }

  // --- BUTTON EVENTS ---
  const btnToCollective = document.getElementById("btn-to-collective");
  if (btnToCollective) {
    btnToCollective.addEventListener("click", () => {
      console.log("전체 결과 보기 클릭됨");
      saveCurrentResult();
      renderCollectiveResults();
      showScreen("collectiveResult");
    });
  }

  const btnToEnding = document.getElementById("btn-to-ending");
  if (btnToEnding) {
    btnToEnding.addEventListener("click", () => {
      console.log("인사이트 보기 클릭됨");
      showScreen("ending");
    });
  }

  // --- RESTART ---
  document.getElementById('btn-restart').addEventListener('click', () => {
    state.nickname = '';
    state.expectedAccuracy = 50;
    state.selections.clear();
    state.currentUserId = null;

    nicknameInput.value = '';
    expectedSlider.value = 50;
    sliderBubble.innerText = '50%';
    
    document.querySelectorAll('.gallery-frame, .text-card').forEach(el => {
      el.classList.remove('selected');
    });

    updateCounts();

    showScreen('home');
  });

});
