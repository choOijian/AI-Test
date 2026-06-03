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
    imageTest2: document.getElementById('screen-image-test-2'),
    imageTest3: document.getElementById('screen-image-test-3'),
    imageTest4: document.getElementById('screen-image-test-4'),
    imageTest5: document.getElementById('screen-image-test-5'),
    webtoonTest: document.getElementById('screen-webtoon-test'),
    paintingTest: document.getElementById('screen-painting-test'),
    paintingTest2: document.getElementById('screen-painting-test-2'),
    textTest: document.getElementById('screen-text-test'),
    analysis: document.getElementById('screen-analysis'),
    personalResult: document.getElementById('screen-personal-result'),
    answerStats: document.getElementById('screen-answer-stats'),
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
    renderImageGrid2();
    renderImageGrid3();
    renderImageGrid4();
    renderImageGrid5();
    renderWebtoonGrid();
    renderPaintingGrid();
    renderPaintingGrid2();
    renderTextGrid();

    showScreen('imageTest');
  });

  // --- COUNTERS & BUTTON STATES ---
  function updateCounts() {
    let imgCount = 0, img2Count = 0, img3Count = 0, img4Count = 0, img5Count = 0, webtoonCount = 0, paintingCount = 0, painting2Count = 0, textCount = 0;
    state.selections.forEach(id => {
      if (id.startsWith('img_')) imgCount++;
      else if (id.startsWith('img2_')) img2Count++;
      else if (id.startsWith('img3_')) img3Count++;
      else if (id.startsWith('img4_')) img4Count++;
      else if (id.startsWith('img5_')) img5Count++;
      else if (id.startsWith('webtoon_')) webtoonCount++;
      else if (id.startsWith('painting_')) paintingCount++;
      else if (id.startsWith('painting2_')) painting2Count++;
      else if (id.startsWith('text_')) textCount++;
    });
    
    // Update count display (if any exist)
    if (document.getElementById('img-sel-count')) document.getElementById('img-sel-count').innerText = imgCount;
    if (document.getElementById('vid-sel-count')) document.getElementById('vid-sel-count').innerText = img2Count;
    if (document.getElementById('text-sel-count')) document.getElementById('text-sel-count').innerText = textCount;

    // Toggle button disabled state (active if >= 1 selected)
    const btnImg = document.getElementById('btn-image-next');
    if (btnImg) { if (imgCount > 0) btnImg.classList.remove('disabled'); else btnImg.classList.add('disabled'); }
    
    const btnImg2 = document.getElementById('btn-image2-next');
    if (btnImg2) { if (img2Count > 0) btnImg2.classList.remove('disabled'); else btnImg2.classList.add('disabled'); }

    const btnImg3 = document.getElementById('btn-image3-next');
    if (btnImg3) { if (img3Count > 0) btnImg3.classList.remove('disabled'); else btnImg3.classList.add('disabled'); }

    const btnImg4 = document.getElementById('btn-image4-next');
    if (btnImg4) { if (img4Count > 0) btnImg4.classList.remove('disabled'); else btnImg4.classList.add('disabled'); }

    const btnImg5 = document.getElementById('btn-image5-next');
    if (btnImg5) { if (img5Count > 0) btnImg5.classList.remove('disabled'); else btnImg5.classList.add('disabled'); }

    const btnWebtoon = document.getElementById('btn-webtoon-next');
    if (btnWebtoon) { if (webtoonCount > 0) btnWebtoon.classList.remove('disabled'); else btnWebtoon.classList.add('disabled'); }

    const btnPainting = document.getElementById('btn-painting-next');
    if (btnPainting) { if (paintingCount > 0) btnPainting.classList.remove('disabled'); else btnPainting.classList.add('disabled'); }

    const btnPainting2 = document.getElementById('btn-painting2-next');
    if (btnPainting2) { if (painting2Count > 0) btnPainting2.classList.remove('disabled'); else btnPainting2.classList.add('disabled'); }
    
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

  function renderImageGrid2() {
    const grid = document.getElementById('image-grid-2');
    grid.innerHTML = '';

    testData.images2.forEach((img, idx) => {
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

  function renderImageGrid3() {
    const grid = document.getElementById('image-grid-3');
    grid.innerHTML = '';

    testData.images3.forEach((img, idx) => {
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

  function renderImageGrid4() {
    const grid = document.getElementById('image-grid-4');
    grid.innerHTML = '';

    testData.images4.forEach((img, idx) => {
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

  function renderImageGrid5() {
    const grid = document.getElementById('image-grid-5');
    grid.innerHTML = '';

    testData.images5.forEach((img, idx) => {
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

  function renderWebtoonGrid() {
    const grid = document.getElementById('webtoon-grid');
    grid.innerHTML = '';

    testData.webtoons.forEach((img, idx) => {
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

  function renderPaintingGrid() {
    const grid = document.getElementById('painting-grid');
    grid.innerHTML = '';

    testData.paintings.forEach((img, idx) => {
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

  function renderPaintingGrid2() {
    const grid = document.getElementById('painting-grid-2');
    if (!grid) return;
    grid.innerHTML = '';

    testData.paintings2.forEach((img, idx) => {
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

      card.addEventListener('click', () => { toggleSelection(card, img.id, true); updateCounts(); });
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
          <h3 class="text-title headline-only">${escapeHtml(textItem.title || '')}</h3>
        `;

        card.addEventListener('click', () => { toggleSelection(card, textItem.id); updateCounts(); });
        container.appendChild(card);
      });
    }
  }

  function toggleSelection(element, id, isSingle = false) {
    state.hesitationScore++;
    if (state.selections.has(id)) {
      state.selections.delete(id);
      element.classList.remove('selected');
    } else {
      if (isSingle) {
        const prefix = id.split('_')[0];
        state.selections.forEach(selId => {
          if (selId.startsWith(prefix + '_')) {
            state.selections.delete(selId);
            const el = document.querySelector(`[data-id="${selId}"]`);
            if (el) el.classList.remove('selected');
          }
        });
      }
      state.selections.add(id);
      element.classList.add('selected');
    }
  }

  // --- TRANSITIONAL NAVIGATION ---
  document.getElementById('btn-pretest-back').addEventListener('click', () => showScreen('home'));

  // PREV BUTTONS
  const btnImagePrev = document.getElementById('btn-image-prev');
  if (btnImagePrev) btnImagePrev.addEventListener('click', () => showScreen('pretest'));

  const btnImage2Prev = document.getElementById('btn-image2-prev');
  if (btnImage2Prev) btnImage2Prev.addEventListener('click', () => showScreen('imageTest'));

  const btnImage3Prev = document.getElementById('btn-image3-prev');
  if (btnImage3Prev) btnImage3Prev.addEventListener('click', () => showScreen('imageTest2'));

  const btnImage4Prev = document.getElementById('btn-image4-prev');
  if (btnImage4Prev) btnImage4Prev.addEventListener('click', () => showScreen('imageTest3'));

  const btnImage5Prev = document.getElementById('btn-image5-prev');
  if (btnImage5Prev) btnImage5Prev.addEventListener('click', () => showScreen('imageTest4'));

  const btnWebtoonPrev = document.getElementById('btn-webtoon-prev');
  if (btnWebtoonPrev) btnWebtoonPrev.addEventListener('click', () => showScreen('imageTest5'));

  const btnPaintingPrev = document.getElementById('btn-painting-prev');
  if (btnPaintingPrev) btnPaintingPrev.addEventListener('click', () => showScreen('webtoonTest'));

  const btnPainting2Prev = document.getElementById('btn-painting2-prev');
  if (btnPainting2Prev) btnPainting2Prev.addEventListener('click', () => showScreen('paintingTest'));

  const btnTextPrev = document.getElementById('btn-text-prev');
  if (btnTextPrev) btnTextPrev.addEventListener('click', () => showScreen('paintingTest2'));

  // NEXT BUTTONS
  document.getElementById('btn-image-next').addEventListener('click', () => showScreen('imageTest2'));
  document.getElementById('btn-image2-next').addEventListener('click', () => showScreen('imageTest3'));
  document.getElementById('btn-image3-next').addEventListener('click', () => showScreen('imageTest4'));
  document.getElementById('btn-image4-next').addEventListener('click', () => showScreen('imageTest5'));
  document.getElementById('btn-image5-next').addEventListener('click', () => showScreen('webtoonTest'));
  document.getElementById('btn-webtoon-next').addEventListener('click', () => showScreen('paintingTest'));
  document.getElementById('btn-painting-next').addEventListener('click', () => showScreen('paintingTest2'));
  const btnPainting2Next = document.getElementById('btn-painting2-next');
  if (btnPainting2Next) btnPainting2Next.addEventListener('click', () => showScreen('textTest'));
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

  // --- RESULT TYPE CALCULATION (새 5단계 기준) ---
  function getResultType(data) {
    const { actualAccuracy, expectedAccuracy } = data;

    // 1순위: AI 마스터 (만점)
    if (actualAccuracy === 100) {
      return 'AI 마스터';
    }
    // 2순위: 촉 좋은 감별러
    if (actualAccuracy >= 80) {
      return '촉 좋은 감별러';
    }
    // 3순위: 자신감 MAX형 (예상 - 실제 >= 20)
    if (expectedAccuracy - actualAccuracy >= 20) {
      return '자신감 MAX형';
    }
    // 4순위: 숨은 고수 (실제 - 예상 >= 20)
    if (actualAccuracy - expectedAccuracy >= 20) {
      return '숨은 고수';
    }
    // 5순위: AI 절친 (정답률 50% 미만)
    if (actualAccuracy < 50) {
      return 'AI 절친';
    }
    // 6순위: 균형형 (나머지)
    return '균형형';
  }

  function getResultDescription(typeStr) {
    switch (typeStr) {
      case 'AI 마스터':
        return '당신은 모든 문제를 정확하게 맞혔습니다. 이미지, 일러스트, 기사 헤드라인까지 AI와 인간의 차이를 완벽하게 구별해냈습니다. 현재 테스트 기준으로 가장 높은 판별 능력을 가진 유형입니다. AI가 아무리 정교해져도 쉽게 속지 않을 가능성이 높습니다.';
      case '촉 좋은 감별러':
        return '당신은 AI와 인간의 차이를 정확하게 포착하는 감별러입니다. 이미지의 디테일, 문장의 흐름, 표현의 미묘한 어색함까지 놓치지 않는 관찰력을 가지고 있습니다. AI가 점점 정교해지는 시대에도 쉽게 속지 않는 편입니다.';
      case '자신감 MAX형':
        return '이 정도는 바로 알 수 있다고 생각했지만, AI는 예상보다 더 교묘했습니다. AI를 구별할 수 있다는 자신감은 높았지만 실제 결과는 기대에 미치지 못했습니다.';
      case '숨은 고수':
        return '스스로를 과소평가했지만 실제로는 높은 판별력을 보여주었습니다. 조심스럽게 관찰하고 판단하는 습관이 좋은 결과로 이어졌습니다.';
      case 'AI 절친':
        return '당신은 AI 콘텐츠를 매우 자연스럽게 받아들이는 편입니다. AI가 만든 결과물도 인간의 창작물처럼 느껴지는 경우가 많습니다. 어쩌면 미래의 콘텐츠 소비자와 가장 가까운 유형일지도 모릅니다.';
      case '균형형':
        return 'AI 생성물과 인간 창작물을 비교적 균형 있게 판단하는 유형입니다. 쉽게 속지도 않고 지나치게 의심하지도 않습니다. 감각과 분석을 적절히 활용하며 안정적으로 판단하는 편입니다.';
      default:
        return 'AI 생성물과 인간 창작물을 비교적 균형 있게 판단하는 유형입니다. 감각과 분석을 적절히 활용하며 안정적으로 판단하는 편입니다.';
    }
  }

  // --- SCORING & STORAGE DB LOGIC ---
  let currentResult = null;

  function calculateAndSaveResults() {
    const allItems = [
      ...testData.images,
      ...testData.images2,
      ...testData.images3,
      ...testData.images4,
      ...testData.images5,
      ...testData.webtoons,
      ...testData.paintings,
      ...(testData.paintings2 || []),
      ...(testData.text || [])
    ];

    let tp = 0; let tn = 0; let fp = 0; let fn = 0;
    const totalAI = allItems.filter(i => i.isAi).length;
    const totalHuman = allItems.filter(i => !i.isAi).length;

    allItems.forEach(item => {
      const isSelected = state.selections.has(item.id);
      let identifiedAsAi = item.invertSelection ? !isSelected : isSelected;
      if (item.isAi) { if (identifiedAsAi) tp++; else fn++; }
      else { if (identifiedAsAi) fp++; else tn++; }
    });

    const actualAccuracy = Math.round(((tp + tn) / allItems.length) * 100);
    const aiMistakeRate = totalAI ? Math.round((fn / totalAI) * 100) : 0;
    const humanMistakeRate = totalHuman ? Math.round((fp / totalHuman) * 100) : 0;

    const allImages = [...testData.images, ...testData.images2, ...testData.images3, ...testData.images4, ...testData.images5, ...testData.webtoons, ...testData.paintings, ...(testData.paintings2 || [])];
    const imageMistakes = allImages.filter(img => {
      const isSelected = state.selections.has(img.id);
      const identifiedAsAi = img.invertSelection ? !isSelected : isSelected;
      return img.isAi ? !identifiedAsAi : identifiedAsAi;
    }).length;
    const imageMistakeRate = allImages.length ? Math.round((imageMistakes / allImages.length) * 100) : 0;

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
    // 닉네임 (비어있으면 USER)
    const nickname = (result.nickname && result.nickname.trim()) ? result.nickname.trim() : 'USER';
    document.getElementById('result-nickname').innerText = nickname;
    
    // 날짜
    const today = new Date(result.createdAt);
    document.getElementById('result-date').innerText = `테스트 완료일: ${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`;
    
    // 실제 정답률 애니메이션
    const valActual = document.getElementById('val-actual');
    if (valActual) animateNumber(valActual, result.actualAccuracy);

    // 예상 정답률 애니메이션
    const valExpected = document.getElementById('val-expected');
    if (valExpected) animateNumber(valExpected, result.expectedAccuracy);

    const valAiMistake = document.getElementById('val-ai-mistake');
    if (valAiMistake) valAiMistake.innerText = `${result.aiMistakeRate}%`;
    const valHumanMistake = document.getElementById('val-human-mistake');
    if (valHumanMistake) valHumanMistake.innerText = `${result.humanMistakeRate}%`;
    
    // 판단 유형 & 설명 (새 기준으로 재계산)
    const typeName = getResultType(result);
    const typeDesc = getResultDescription(typeName);
    const isMaster = (typeName === 'AI 마스터');

    const typeNameEl = document.getElementById('result-type-name');
    if (typeNameEl) {
      typeNameEl.textContent = typeName;
      // AI 마스터 특별 배지 처리
      typeNameEl.classList.toggle('type-master', isMaster);
    }

    // 결과 hero 영역에 AI 마스터 배지 삽입/제거
    const resultHero = document.querySelector('#screen-personal-result .result-hero');
    const existingBadge = document.getElementById('master-badge');
    if (existingBadge) existingBadge.remove();
    if (isMaster && resultHero) {
      const badge = document.createElement('div');
      badge.id = 'master-badge';
      badge.className = 'master-badge';
      badge.innerHTML = '<span class="master-crown">👑</span><span class="master-badge-text">최고 등급 달성</span>';
      resultHero.insertBefore(badge, resultHero.firstChild);
    }

    const typeDescEl = document.getElementById('result-type-desc');
    if (typeDescEl) typeDescEl.textContent = typeDesc;

    const cardTypeNameEl = document.getElementById('card-type-name');
    if (cardTypeNameEl) cardTypeNameEl.textContent = `'${typeName}'`;

    // 결과 해석 카드 본문도 동일 설명으로 동기화
    const interpretP = document.querySelector('#screen-personal-result .result-interpret-card p');
    if (interpretP) interpretP.textContent = typeDesc;

    // 결과 해석 카드 아이콘 변경
    const interpretIcon = document.querySelector('#screen-personal-result .interpret-icon');
    if (interpretIcon) interpretIcon.textContent = isMaster ? '👑' : '💡';
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

  // --- ANSWER STATS 사용자 선택 변환 ---
  // state.selections의 ID를 문항별 보기 번호 배열로 변환
  function buildUserAnswers() {
    const map = {};
    // 각 QUESTION_STATS의 id prefix로 그룹핑
    QUESTION_STATS.forEach(q => { map[q.id] = []; });

    state.selections.forEach(selId => {
      // selId 예시: "img_1", "img2_3", "webtoon_2", "painting2_1", "text_3"
      // 마지막 _ 이후가 인덱스 번호
      const lastUnderscore = selId.lastIndexOf('_');
      const prefix = selId.substring(0, lastUnderscore); // e.g. "img", "img2", "webtoon"
      const num = parseInt(selId.substring(lastUnderscore + 1), 10); // 1~4

      if (map.hasOwnProperty(prefix)) {
        map[prefix].push(num);
      }
    });

    // 각 배열 정렬
    Object.keys(map).forEach(k => map[k].sort((a, b) => a - b));
    return map;
  }

  // --- ANSWER STATS 렌더링 ---
  function renderAnswerStats() {
    const list = document.getElementById('answer-stats-list');
    if (!list) return;
    list.innerHTML = '';

    const userAnswers = buildUserAnswers();

    QUESTION_STATS.forEach((q, qIdx) => {
      const userSelected = userAnswers[q.id] || [];
      const verdict = compareAnswers(userSelected, q.answer);
      const accuracy = Math.round((q.correctCount / q.totalParticipants) * 100);
      const maxSelection = Math.max(...Object.values(q.optionSelections));

      // verdict 배지 스타일
      const verdictClass = verdict === '정답' ? 'verdict-correct'
                         : verdict === '부분 정답' ? 'verdict-partial'
                         : 'verdict-wrong';

      // 사용자가 선택한 보기 텍스트
      const myChoiceText = userSelected.length > 0
        ? userSelected.map(n => `${n}번`).join(', ')
        : '선택 없음';

      const card = document.createElement('div');
      card.className = 'answer-stat-card';

      // 보기별 막대 그래프 HTML 생성
      const barsHtml = [1, 2, 3, 4].map(optNum => {
        const count = q.optionSelections[optNum] || 0;
        const rate = Math.round((count / q.totalParticipants) * 100);
        const isCorrect = q.answer.includes(optNum);
        const isMine = userSelected.includes(optNum);
        const isMost = count === maxSelection;

        const badges = [];
        if (isCorrect) badges.push('<span class="stat-badge badge-correct">정답</span>');
        if (isMine) badges.push('<span class="stat-badge badge-mine">내 선택</span>');
        if (isMost && !isCorrect && !isMine) badges.push('<span class="stat-badge badge-most">최다 선택</span>');

        const barClass = isCorrect ? 'bar-correct' : isMine ? 'bar-mine' : 'bar-default';

        return `
          <div class="stat-bar-row">
            <div class="stat-bar-label">${optNum}번</div>
            <div class="stat-bar-track">
              <div class="stat-bar-fill ${barClass}" data-target="${rate}%"></div>
            </div>
            <div class="stat-bar-rate">${rate}%</div>
            <div class="stat-bar-badges">${badges.join('')}</div>
          </div>
        `;
      }).join('');

      card.innerHTML = `
        <div class="stat-card-left">
          <div class="stat-card-meta">
            <div class="stat-card-title-row" style="width: 100%;">
              <span class="stat-question-num">문항 ${qIdx + 1} / ${QUESTION_STATS.length}</span>
              <button class="preview-question-btn btn-review" data-question-id="${q.id}">다시 보기</button>
            </div>
          </div>
          <h3 class="stat-card-title">${escapeHtml(q.title)}</h3>
          <div class="stat-info-rows">
            <div class="stat-info-row">
              <span class="stat-info-label">정 답</span>
              <span class="stat-info-value correct-text">${q.answer.map(n => n + '번').join(', ')}</span>
            </div>
            <div class="stat-info-row">
              <span class="stat-info-label">내 선택</span>
              <span class="stat-info-value">${escapeHtml(myChoiceText)}</span>
            </div>
            <div class="stat-info-row">
              <span class="stat-info-label">결 과</span>
              <span class="stat-verdict-badge ${verdictClass}">${verdict}</span>
            </div>
          </div>
          <div class="stat-accuracy-row">
            <span class="stat-accuracy-label">전체 정답률</span>
            <span class="stat-accuracy-value">${accuracy}%</span>
          </div>
        </div>
        <div class="stat-card-right">
          <div class="stat-bars-title">보기별 선택률</div>
          <div class="stat-bars">${barsHtml}</div>
        </div>
      `;

      list.appendChild(card);
    });

    // 팝업 열기 이벤트 바인딩
    list.querySelectorAll('.preview-question-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        openQuestionPreview(e.target.dataset.questionId);
      });
    });

    // 막대 그래프 애니메이션을 위한 IntersectionObserver 설정
    setupBarAnimations();
  }

  function setupBarAnimations() {
    const bars = document.querySelectorAll('.stat-bar-fill');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            bar.style.width = bar.dataset.target;
            observer.unobserve(bar); // 한 번만 실행
          }
        });
      }, { threshold: 0.1 });

      bars.forEach(bar => observer.observe(bar));
    } else {
      // Fallback
      bars.forEach(bar => { bar.style.width = bar.dataset.target; });
    }
  }

  // --- MODAL LOGIC ---
  function openQuestionPreview(questionId) {
    const previewData = PREVIEW_QUESTIONS.find(q => q.id === questionId);
    const statsData = QUESTION_STATS.find(q => q.id === questionId);

    if (!previewData) {
      console.warn('미리보기 데이터를 찾을 수 없습니다:', questionId);
      alert('이 문항의 미리보기 데이터를 찾을 수 없습니다.');
      return;
    }

    renderQuestionModal(previewData, statsData);
  }

  function renderQuestionModal(previewData, statsData) {
    const modal = document.getElementById('question-preview-modal');
    const title = document.getElementById('question-modal-title');
    const content = document.getElementById('question-modal-content');

    title.textContent = previewData.title;
    content.innerHTML = '';

    if (previewData.type === 'headline' || previewData.type === 'text') {
      content.className = 'question-modal-content text-preview-grid';

      previewData.options.forEach(option => {
        const item = document.createElement('div');
        item.className = 'preview-text-option';
        item.innerHTML = `
          <div class="preview-option-number">${option.number}번</div>
          <p>${option.text}</p>
        `;
        content.appendChild(item);
      });
    } else {
      content.className = 'question-modal-content image-preview-grid';

      previewData.options.forEach(option => {
        const item = document.createElement('div');
        item.className = 'preview-image-option';
        item.innerHTML = `
          <div class="preview-option-number">${option.number}번</div>
          <img src="${option.src}" alt="${previewData.title} ${option.number}번">
        `;
        content.appendChild(item);
      });
    }

    modal.classList.remove('hidden');
    modal.classList.add('active');
  }

  function closeQuestionPreview() {
    const modal = document.getElementById('question-preview-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.classList.add('hidden');
    }
  }

  document.querySelector('.question-modal-close')?.addEventListener('click', closeQuestionPreview);
  document.querySelector('.question-modal-backdrop')?.addEventListener('click', closeQuestionPreview);

  // --- BUTTON EVENTS ---
  const btnToAnswerStats = document.getElementById('btn-to-answer-stats');
  if (btnToAnswerStats) {
    btnToAnswerStats.addEventListener('click', () => {
      saveCurrentResult();
      renderAnswerStats();
      showScreen('answerStats');
    });
  }

  const btnToCollective = document.getElementById("btn-to-collective");
  if (btnToCollective) {
    btnToCollective.addEventListener("click", () => {
      console.log("전체 결과 순위 클릭됨");
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
