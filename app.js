/**
 * Real or Ai? - Redesigned Web Exhibition Controller (Neon Green Editorial UI)
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- IMAGE PRELOADING ---
  function preloadAllImages() {
    try {
      const imageList = [];
      if (typeof testData !== 'undefined') {
        const categories = ['images', 'images1_5', 'images2', 'images3', 'images4', 'images5', 'webtoons', 'paintings', 'paintings2'];
        categories.forEach(cat => {
          if (testData[cat] && Array.isArray(testData[cat])) {
            testData[cat].forEach(item => {
              if (item.src) {
                imageList.push(item.src);
              }
            });
          }
        });
      }
      const uniqueImages = [...new Set(imageList)];
      uniqueImages.forEach(src => {
        const img = new Image();
        img.src = src;
      });
      console.log(`[Optimization] Preloading started for ${uniqueImages.length} images.`);
    } catch (e) {
      console.error("[Optimization] Preloading images failed safely:", e);
    }
  }
  preloadAllImages();
  
  // Split hero title into individual characters for bounce animation
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const text = heroTitle.textContent.trim();
    heroTitle.innerHTML = text.split('').map((char, index) => {
      if (char === ' ') return '<span style="display: inline-block;">&nbsp;</span>';
      return `<span class="bounce-char" style="animation-delay: ${index * 0.08}s">${char}</span>`;
    }).join('');
  }
  
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

  // Insert hero background element dynamically with Magenta placeholder
  const homeScreen = document.getElementById('screen-home');
  if (homeScreen) {
    const heroBg = document.createElement('div');
    heroBg.className = 'hero-bg';
    
    // Create and append placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'hero-video-placeholder';
    heroBg.appendChild(placeholder);
    
    // Create and append iframe
    const iframe = document.createElement('iframe');
    iframe.src = "https://player.vimeo.com/video/1200036379?autoplay=1&loop=1&muted=1&background=1";
    iframe.frameBorder = "0";
    iframe.setAttribute('allow', 'autoplay; fullscreen');
    iframe.setAttribute('allowfullscreen', 'true');
    heroBg.appendChild(iframe);
    
    homeScreen.insertBefore(heroBg, homeScreen.firstChild);

    // Remove placeholder when video starts playing or timeout occurs
    let placeholderRemoved = false;
    const removePlaceholder = () => {
      if (placeholderRemoved) return;
      placeholderRemoved = true;
      placeholder.classList.add('fade-out');
      setTimeout(() => {
        placeholder.remove();
      }, 1000);
    };

    // 1. Basic fallback: iframe onload + slight delay (gives video time to initialize a bit)
    iframe.onload = () => {
      setTimeout(removePlaceholder, 1000);
    };

    // 2. Strong fallback: Safety timer of 3.5 seconds
    setTimeout(removePlaceholder, 3500);

    // 3. Optimal transition: Vimeo SDK Player play event detection with retries if SDK loads asynchronously
    function initVimeoPlayer() {
      try {
        if (window.Vimeo && window.Vimeo.Player) {
          const player = new Vimeo.Player(iframe);
          player.on('play', () => {
            removePlaceholder();
          });
        } else {
          // Polling retry for asynchronously loaded script
          let retries = 0;
          const interval = setInterval(() => {
            retries++;
            try {
              if (window.Vimeo && window.Vimeo.Player) {
                const player = new Vimeo.Player(iframe);
                player.on('play', () => {
                  removePlaceholder();
                });
                clearInterval(interval);
              }
            } catch (innerErr) {
              console.error("[Optimization] Vimeo SDK polling initialization failed safely:", innerErr);
              clearInterval(interval);
            }
            if (retries > 15 || placeholderRemoved) {
              clearInterval(interval);
            }
          }, 150);
        }
      } catch (e) {
        console.error("[Optimization] Vimeo SDK initialization failed safely:", e);
      }
    }
    initVimeoPlayer();
    
    homeScreen.addEventListener('scroll', () => {
      const scrollTop = homeScreen.scrollTop;
      const vh = window.innerHeight;
      const progress = Math.min(Math.max(scrollTop / vh, 0), 1);
      
      const hBg = homeScreen.querySelector('.hero-bg');
      const hTitle = homeScreen.querySelector('.hero-title');
      const hContent = homeScreen.querySelector('.hero-content');
      
      // 1. Zoom background slowly (scale 1.0 to 1.15) and translate down
      if (hBg) {
        const bgScale = 1 + progress * 0.15;
        const bgTranslate = progress * 60;
        hBg.style.transform = `scale(${bgScale}) translate3d(0, ${bgTranslate}px, 0)`;
      }
      
      // 2. Zoom title rapidly from screen center and fade out (scale 1.0 to 8.5)
      if (hTitle) {
        const titleScale = 1 + progress * 7.5;
        const titleOpacity = Math.max(0, 1 - progress * 1.35);
        hTitle.style.transform = `scale(${titleScale}) translate3d(0, 0, 0)`;
        hTitle.style.transformOrigin = 'center center';
        hTitle.style.opacity = titleOpacity;
      }
      
      // 3. Fade and translate other hero contents (desc, button) faster
      if (hContent) {
        const desc = hContent.querySelector('.hero-desc');
        const startBtn = hContent.querySelector('.btn-hero-start');
        const scrollHint = homeScreen.querySelector('.hero-scroll');
        const othersOpacity = Math.max(0, 1 - progress * 2.8);
        const othersTranslate = progress * -40;
        
        if (desc) {
          desc.style.opacity = othersOpacity;
          desc.style.transform = `translate3d(0, ${othersTranslate}px, 0)`;
        }
        if (startBtn) {
          startBtn.style.opacity = othersOpacity;
          startBtn.style.transform = `translate3d(0, ${othersTranslate}px, 0)`;
          startBtn.style.pointerEvents = othersOpacity === 0 ? 'none' : 'auto';
        }
        if (scrollHint) {
          scrollHint.style.opacity = othersOpacity;
        }
      }
      
      // 4. Parallax effect for About intro section text
      const introInner = homeScreen.querySelector('.home-intro-inner');
      if (introInner) {
        const introSection = homeScreen.querySelector('.home-intro');
        if (introSection) {
          const introRect = introSection.getBoundingClientRect();
          const screenHeight = window.innerHeight;
          if (introRect.top < screenHeight) {
            const introScrollOffset = screenHeight - introRect.top;
            const translateVal = introScrollOffset * -0.05;
            introInner.style.transform = `translate3d(0, ${translateVal}px, 0)`;
          } else {
            introInner.style.transform = 'translate3d(0, 0, 0)';
          }
        }
      }
    });

    // Trigger scroll listener once at start to sync initial styles and z-index stacking
    try {
      homeScreen.dispatchEvent(new Event('scroll'));
    } catch (e) {
      console.error("[Optimization] Scroll dispatch failed safely:", e);
    }
  }

  // --- INITIAL MOCK DATA (Seeding LocalStorage) ---
  const MOCK_LEADERBOARD = [
    { id: 'mock_1', nickname: 'MINJI', expectedAccuracy: 90, actualAccuracy: 42, aiMistakeRate: 56, humanMistakeRate: 20, resultType: 'AI 친화형', createdAt: Date.now() - 36000000 },
    { id: 'mock_2', nickname: 'JIAN', expectedAccuracy: 80, actualAccuracy: 37, aiMistakeRate: 63, humanMistakeRate: 30, resultType: '분위기 몰입러', createdAt: Date.now() - 28800000 },
    { id: 'mock_3', nickname: 'LEE', expectedAccuracy: 70, actualAccuracy: 75, aiMistakeRate: 30, humanMistakeRate: 15, resultType: '촉 좋은 감별러', createdAt: Date.now() - 21600000 },
    { id: 'mock_4', nickname: 'SOO', expectedAccuracy: 85, actualAccuracy: 50, aiMistakeRate: 67, humanMistakeRate: 40, resultType: '자신감 MAX형', createdAt: Date.now() - 14400000 },
    { id: 'mock_5', nickname: 'YUNA', expectedAccuracy: 75, actualAccuracy: 60, aiMistakeRate: 40, humanMistakeRate: 25, resultType: '일단 찍어형', createdAt: Date.now() - 7200000 }
  ];

  // --- LOCALSTORAGE SAFE PARSE HELPERS ---
  function getLocalStorageResults() {
    try {
      const data = localStorage.getItem('realOrAiResults');
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("[Storage] Failed to parse realOrAiResults, resetting to empty array:", e);
      return [];
    }
  }

  function seedLeaderboard() {
    try {
      if (!localStorage.getItem('realOrAiResults')) {
        localStorage.setItem('realOrAiResults', JSON.stringify(MOCK_LEADERBOARD));
      }
    } catch (e) {
      console.error("[Storage] Failed to seed leaderboard:", e);
    }
  }
  seedLeaderboard();

  // --- ONE-TIME NICKNAME MIGRATION ---
  // Replace existing mock/seed nicknames with realistic dummy names (runs only once).
  // Newly added entries will always keep their exact inputted nickname.
  function migrateNicknames() {
    try {
      if (localStorage.getItem('realOrAiResultsMigrated') === 'true') return;
      const DUMMY_NAMES = ['민지', '홍길동', '김민수', '지안', '서윤', 'Alex', 'Sophie', 'Jamie', 'Mia', 'Chris'];
      let db = getLocalStorageResults();
      if (db.length === 0) {
        db = [...MOCK_LEADERBOARD];
      }
      db = db.map((entry, idx) => ({
        ...entry,
        nickname: DUMMY_NAMES[idx % DUMMY_NAMES.length]
      }));
      localStorage.setItem('realOrAiResults', JSON.stringify(db));
      localStorage.setItem('realOrAiResultsMigrated', 'true');
    } catch (err) {
      console.error("[Migration] Nickname migration failed safely:", err);
    }
  }
  migrateNicknames();

  // --- ROUTING / SCREEN SYSTEM ---
  const screens = {
    home: document.getElementById('screen-home'),
    pretest: document.getElementById('screen-pretest'),
    imageTest: document.getElementById('screen-image-test'),
    imageTest15: document.getElementById('screen-image-test-1-5'), // New Question
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

  // Order of test screens for progress steps
  const testScreensOrder = [
    'imageTest',
    'imageTest15',
    'imageTest2',
    'imageTest3',
    'imageTest4',
    'imageTest5',
    'webtoonTest',
    'paintingTest',
    'paintingTest2',
    'textTest'
  ];

  // Map to human-readable step numbers
  const screenToStepNumber = {
    imageTest: '01',
    imageTest15: '02',
    imageTest2: '03',
    imageTest3: '04',
    imageTest4: '05',
    imageTest5: '06',
    webtoonTest: '07',
    paintingTest: '08',
    paintingTest2: '09',
    textTest: '10'
  };

  // Render 10 step progress nodes dynamically
  function renderStepIndicator(screenKey) {
    const container = document.getElementById(`step-container-${screenKey}`);
    if (!container) return;
    
    container.innerHTML = '';
    
    // For pretest, render 10 inactive nodes
    if (screenKey === 'pretest') {
      for (let i = 0; i < 10; i++) {
        const node = document.createElement('div');
        node.className = 'step-node';
        node.innerHTML = `<span>${i + 1}</span>`;
        container.appendChild(node);
        if (i < 9) {
          const line = document.createElement('div');
          line.className = 'step-line';
          container.appendChild(line);
        }
      }
      return;
    }
    
    const currentIdx = testScreensOrder.indexOf(screenKey);
    if (currentIdx === -1) return;
    
    for (let i = 0; i < 10; i++) {
      const node = document.createElement('div');
      node.className = 'step-node';
      if (i < currentIdx) {
        node.classList.add('completed');
      } else if (i === currentIdx) {
        node.classList.add('active');
      } else {
        node.innerHTML = `<span>${i + 1}</span>`;
      }
      container.appendChild(node);
      
      if (i < 9) {
        const line = document.createElement('div');
        line.className = 'step-line';
        if (i < currentIdx) {
          line.classList.add('completed');
        }
        container.appendChild(line);
      }
    }
  }

  // Staggered reveal helper using CSS variables & requestAnimationFrame
  function triggerStaggeredReveal(activeScreenElement) {
    const cards = activeScreenElement.querySelectorAll('.gallery-frame, .text-card');
    cards.forEach((card, idx) => {
      card.style.opacity = '0';
      card.style.transform = 'translate3d(0, 16px, 0)';
      card.style.transition = 'none';
      
      // Force layout reflow
      void card.offsetHeight;
      
      const delay = idx * 0.05; // 0.05s, 0.1s, 0.15s, 0.2s
      card.style.transition = `opacity 0.45s cubic-bezier(0.215, 0.61, 0.355, 1) ${delay}s, transform 0.45s cubic-bezier(0.215, 0.61, 0.355, 1) ${delay}s, box-shadow 0.4s var(--ease), background-color 0.4s var(--ease), border-color 0.4s var(--ease)`;
      
      requestAnimationFrame(() => {
        card.style.opacity = '1';
        card.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }

  let transitionInProgress = false;

  // --- ENHANCED SCREEN TRANSITIONS ---
  function showScreen(screenKey) {
    if (transitionInProgress) return;

    const stepNum = screenToStepNumber[screenKey];
    if (stepNum) {
      const intermissionOverlay = document.getElementById('intermission-overlay');
      const intermissionNumber = document.getElementById('intermission-number');
      
      if (intermissionOverlay && intermissionNumber) {
        transitionInProgress = true;
        intermissionNumber.innerText = stepNum;
        intermissionOverlay.classList.add('active');
        
        // After cover is active, swap screens
        setTimeout(() => {
          Object.values(screens).forEach(screen => {
            screen.classList.remove('active');
          });
          const activeScreen = screens[screenKey];
          if (activeScreen) {
            activeScreen.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'instant' });
            activeScreen.scrollTo({ top: 0, behavior: 'instant' });
            renderStepIndicator(screenKey);
          }
          
          // Let the user read the large step number card
          setTimeout(() => {
            intermissionOverlay.classList.remove('active');
            transitionInProgress = false;
            
            // Once overlay fades out, run stagger reveal
            if (activeScreen) {
              triggerStaggeredReveal(activeScreen);
            }
          }, 400);
          
        }, 300);
        return;
      }
    }

    // Fallback for non-question screens
    Object.values(screens).forEach(screen => {
      screen.classList.remove('active');
    });
    const activeScreen = screens[screenKey];
    if (activeScreen) {
      activeScreen.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'instant' });
      activeScreen.scrollTo({ top: 0, behavior: 'instant' });
      
      if (screenKey === 'pretest') {
        renderStepIndicator('pretest');
      }

      if (screenKey === 'personalResult') {
        const resultScreenEl = document.getElementById('screen-personal-result');
        if (resultScreenEl) {
          resultScreenEl.classList.remove('reveal-bg');
          void resultScreenEl.offsetWidth; // Trigger reflow
          resultScreenEl.classList.add('reveal-bg');
        }
      }
    }
  }

  // --- HOME SCREEN EVENTS ---
  const btnToPretest = document.getElementById('btn-to-pretest');
  if (btnToPretest) {
    btnToPretest.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (typeof showScreen === 'function') {
        showScreen('pretest');
      } else {
        document.querySelectorAll('.screen').forEach(section => {
          section.classList.remove('active');
        });
        document.getElementById('screen-pretest')?.classList.add('active');
      }
    });
  }

  const btnScrollToTop = document.getElementById('btn-scroll-to-top');
  if (btnScrollToTop) {
    btnScrollToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const homeScreen = document.getElementById('screen-home');
      if (homeScreen) {
        homeScreen.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // --- PRE TEST SCREEN EVENTS ---
  const nicknameInput = document.getElementById('input-nickname');
  const expectedSlider = document.getElementById('slider-expected');
  const sliderBubble = document.getElementById('slider-bubble');

  expectedSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    sliderBubble.innerText = `${val}%`;
    e.target.style.setProperty('--val', val + '%');
    state.expectedAccuracy = parseInt(val, 10);
  });
  expectedSlider.style.setProperty('--val', expectedSlider.value + '%');

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
    renderImageGrid1_5();
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
    let imgCount = 0, img15Count = 0, img2Count = 0, img3Count = 0, img4Count = 0, img5Count = 0, webtoonCount = 0, paintingCount = 0, painting2Count = 0, textCount = 0;
    state.selections.forEach(id => {
      if (id.startsWith('img_')) imgCount++;
      else if (id.startsWith('img15_')) img15Count++;
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

    const btnImg15 = document.getElementById('btn-image15-next');
    if (btnImg15) { if (img15Count > 0) btnImg15.classList.remove('disabled'); else btnImg15.classList.add('disabled'); }
    
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

  function renderImageGrid1_5() {
    const grid = document.getElementById('image-grid-1-5');
    if (!grid) return;
    grid.innerHTML = '';
    
    testData.images1_5.forEach((img, idx) => {
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
          <div class="article-body" style="display: flex; flex-direction: column; gap: 8px; text-align: left; width: 100%;">
            <h3 class="text-title" style="font-size: 1.02rem; font-weight: 700; line-height: 1.4; color: var(--black); word-break: keep-all; letter-spacing: -0.02em; margin: 0;">${escapeHtml(textItem.title || '')}</h3>
            <p class="text-content" style="font-size: 0.8rem; line-height: 1.55; color: rgba(0, 0, 0, 0.55); margin: 0; word-break: keep-all; font-weight: 400;">${escapeHtml(textItem.content || '')}</p>
          </div>
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

  const btnImage15Prev = document.getElementById('btn-image15-prev');
  if (btnImage15Prev) btnImage15Prev.addEventListener('click', () => showScreen('imageTest'));

  const btnImage2Prev = document.getElementById('btn-image2-prev');
  if (btnImage2Prev) btnImage2Prev.addEventListener('click', () => showScreen('imageTest15'));

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
  document.getElementById('btn-image-next').addEventListener('click', () => showScreen('imageTest15'));
  document.getElementById('btn-image15-next').addEventListener('click', () => showScreen('imageTest2'));
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
        return '모든 문제를 정확하게 구별했습니다.<br>AI와 인간의 차이를 가장 예민하게 읽어내는 유형입니다.';
      case '촉 좋은 감별러':
        return '작은 단서도 놓치지 않습니다.<br>직감과 관찰력이 뛰어난 유형입니다.';
      case '자신감 MAX형':
        return '확신은 강했지만 결과는 조금 달랐습니다.<br>AI를 구별하는 일이 생각보다 어렵다는 것을 보여주는 유형입니다.';
      case '숨은 고수':
        return '예상보다 훨씬 좋은 결과를 보여주었습니다.<br>생각보다 감각이 뛰어난 유형입니다.';
      case 'AI 절친':
        return 'AI 콘텐츠를 매우 자연스럽게 받아들이는 유형입니다.<br>AI로 생성된 콘텐츠를 실제 창작물처럼 신뢰하는 경향이 있습니다.';
      case '균형형':
        return '의심하지도, 쉽게 믿지도 않습니다.<br>가장 균형 잡힌 시선으로 콘텐츠를 바라보는 유형입니다.';
      default:
        return '의심하지도, 쉽게 믿지도 않습니다.<br>가장 균형 잡힌 시선으로 콘텐츠를 바라보는 유형입니다.';
    }
  }

  // --- SCORING & STORAGE DB LOGIC ---
  let currentResult = null;

  function calculateAndSaveResults() {
    const allItems = [
      ...testData.images,
      ...testData.images1_5,
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

    const allImages = [...testData.images, ...testData.images1_5, ...testData.images2, ...testData.images3, ...testData.images4, ...testData.images5, ...testData.webtoons, ...testData.paintings, ...(testData.paintings2 || [])];
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

    saveCurrentResult();
    updatePersonalResultsUI(currentResult);
  }

  function updatePersonalResultsUI(result) {
    const typeName = getResultType(result);
    const typeDesc = getResultDescription(typeName);

    const typeNameEl = document.getElementById('result-type-name');
    if (typeNameEl) typeNameEl.textContent = typeName;

    const typeDescEl = document.getElementById('result-type-desc');
    if (typeDescEl) typeDescEl.innerHTML = typeDesc;

    // 실제 정답률 애니메이션
    const valActual = document.getElementById('val-actual');
    if (valActual) animateNumber(valActual, result.actualAccuracy);

    // 예상 정답률
    const valExpected = document.getElementById('val-expected');
    if (valExpected) valExpected.innerText = `${result.expectedAccuracy}%`;

    // 상위 % 계산
    const valRank = document.getElementById('val-rank');
    if (valRank) {
      let results = getLocalStorageResults();
      if (results.length === 0) {
        valRank.innerText = '1%';
      } else {
        const accuracies = results.map(r => r.actualAccuracy).sort((a, b) => b - a);
        const myAcc = result.actualAccuracy;
        const countBetter = accuracies.filter(acc => acc > myAcc).length;
        const percentile = Math.max(1, Math.round((countBetter / accuracies.length) * 100));
        valRank.innerText = `${percentile}%`;
      }
    }

    // 참여자 수
    const valParticipants = document.getElementById('val-participants');
    if (valParticipants) {
      let results = getLocalStorageResults();
      valParticipants.innerText = `${results.length.toLocaleString()}명`;
    }
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
    let db = getLocalStorageResults();
    
    const existingIndex = db.findIndex(entry => entry.id === currentResult.id);
    if (existingIndex !== -1) {
      db[existingIndex] = currentResult;
    } else {
      db.push(currentResult);
    }
    localStorage.setItem("realOrAiResults", JSON.stringify(db));
  }

  // --- COLLECTIVE RENDER LOGIC ---
  function renderCollectiveResults() {
    let results = getLocalStorageResults();
    const totalCount = results.length;

    // 1. 전체 참여자 수
    const totalParticipantsEl = document.getElementById("val-total-participants");
    if (totalParticipantsEl) {
      totalParticipantsEl.innerText = `${totalCount.toLocaleString()}명`;
    }

    // 2. 가장 많은 유형 및 비율 계산
    const typeCounts = {
      'AI 절친': 0,
      '균형형': 0,
      '촉 좋은 감별러': 0,
      '자신감 MAX형': 0,
      '숨은 고수': 0,
      'AI 마스터': 0
    };

    results.forEach(r => {
      if (typeCounts[r.resultType] !== undefined) {
        typeCounts[r.resultType]++;
      } else {
        typeCounts[r.resultType] = 1;
      }
    });

    let mostCommonType = 'AI 절친';
    let maxVal = 0;
    Object.keys(typeCounts).forEach(type => {
      if (typeCounts[type] > maxVal) {
        maxVal = typeCounts[type];
        mostCommonType = type;
      }
    });
    const mostCommonPercent = totalCount > 0 ? Math.round((maxVal / totalCount) * 100) : 0;

    const mostCommonTypeEl = document.getElementById("val-most-common-type");
    const mostCommonPercentEl = document.getElementById("val-most-common-percent");
    if (mostCommonTypeEl) mostCommonTypeEl.innerText = mostCommonType;
    if (mostCommonPercentEl) mostCommonPercentEl.innerText = `${mostCommonPercent}%`;

    // 3. 평균 정답률 계산
    let totalAccSum = 0;
    results.forEach(r => {
      totalAccSum += r.actualAccuracy;
    });
    const avgAccuracy = totalCount > 0 ? Math.round(totalAccSum / totalCount) : 0;

    const avgAccuracyEl = document.getElementById("val-avg-accuracy");
    if (avgAccuracyEl) avgAccuracyEl.innerText = `${avgAccuracy}%`;

    // 4. 가장 어려웠던 / 쉬웠던 문제 계산
    let hardest = null;
    let easiest = null;
    let minRate = 101;
    let maxRate = -1;

    QUESTION_STATS.forEach(q => {
      const rate = Math.round((q.correctCount / q.totalParticipants) * 100);
      if (rate < minRate) { minRate = rate; hardest = q; }
      if (rate > maxRate) { maxRate = rate; easiest = q; }
    });

    const hardestQuestionEl = document.getElementById("val-hardest-question");
    const hardestPercentEl = document.getElementById("val-hardest-percent");
    if (hardestQuestionEl) hardestQuestionEl.innerText = hardest ? hardest.title : '이미지 테스트 4';
    if (hardestPercentEl) hardestPercentEl.innerText = `${minRate}%`;

    const easiestQuestionEl = document.getElementById("val-easiest-question");
    const easiestPercentEl = document.getElementById("val-easiest-percent");
    if (easiestQuestionEl) easiestQuestionEl.innerText = easiest ? easiest.title : '헤드라인 테스트';
    if (easiestPercentEl) easiestPercentEl.innerText = `${maxRate}%`;

    // 5. 리더보드 테이블 렌더링 (collective 화면의 tbody는 없어졌으므로 안전하게 체크)
    const tbody = document.getElementById('collective-result-body');
    if (tbody) {
      renderLeaderboardInto(tbody, document.getElementById('leaderboard-count'), results, totalCount);
    }
  }

  // 리더보드를 주어진 tbody에 렌더링하는 공통 함수
  function renderLeaderboardInto(tbody, countEl, results, totalCount) {
    tbody.innerHTML = '';
    const sorted = [...results].sort((a, b) => b.actualAccuracy - a.actualAccuracy);

    sorted.forEach((r, idx) => {
      const rank = idx + 1;
      const isCurrentUser = currentResult && r.id === currentResult.id;

      let dateStr = '-';
      if (r.createdAt) {
        const d = new Date(r.createdAt);
        dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
      }

      let rankDisplay = String(rank);
      if (rank === 1) rankDisplay = '🥇';
      else if (rank === 2) rankDisplay = '🥈';
      else if (rank === 3) rankDisplay = '🥉';

      const youBadge = isCurrentUser ? `<span class="you-badge">YOU</span>` : '';
      const nickname = escapeHtml(r.nickname || 'USER');
      const typeBadge = `<span class="type-badge">${escapeHtml(r.resultType || '-')}</span>`;

      const tr = document.createElement('tr');
      if (isCurrentUser) tr.className = 'current-user-row';
      tr.innerHTML = `
        <td>${rankDisplay}</td>
        <td class="nick-cell">${youBadge}${nickname}</td>
        <td>${typeBadge}</td>
        <td class="val-expected">${r.expectedAccuracy != null ? r.expectedAccuracy + '%' : '-'}</td>
        <td class="actual-highlight">${r.actualAccuracy != null ? r.actualAccuracy + '%' : '-'}</td>
        <td><span class="ai-mistake-badge">${r.aiMistakeRate != null ? r.aiMistakeRate + '%' : '-'}</span></td>
        <td>${dateStr}</td>
      `;
      tbody.appendChild(tr);
    });

    if (countEl) {
      countEl.innerText = `총 ${totalCount.toLocaleString()}명 참여 · 실제 정확도 기준 정렬`;
    }
  }

  // ending 화면용 리더보드 렌더링
  function renderEndingLeaderboard() {
    const results = getLocalStorageResults();
    const totalCount = results.length;
    const tbody = document.getElementById('ending-result-body');
    const countEl = document.getElementById('ending-leaderboard-count');
    if (tbody) {
      renderLeaderboardInto(tbody, countEl, results, totalCount);
    }
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
  function buildUserAnswers() {
    const map = {};
    QUESTION_STATS.forEach(q => { map[q.id] = []; });

    state.selections.forEach(selId => {
      const lastUnderscore = selId.lastIndexOf('_');
      const prefix = selId.substring(0, lastUnderscore);
      const num = parseInt(selId.substring(lastUnderscore + 1), 10);

      if (map.hasOwnProperty(prefix)) {
        map[prefix].push(num);
      }
    });

    Object.keys(map).forEach(k => map[k].sort((a, b) => a - b));
    return map;
  }

  // --- ANSWER STATS 렌더링 ---
  function renderAnswerStats() {
    const list = document.getElementById('answer-stats-list');
    if (!list) return;
    list.innerHTML = '';

    const userAnswers = buildUserAnswers();

    const typeMap = {
      '이미지': 'IMAGE',
      '일러스트': 'ILLUST',
      '페인팅': 'PAINTING',
      '드로잉': 'DRAWING',
      '헤드라인': 'HEADLINE',
      '기사': 'ARTICLE'
    };

    QUESTION_STATS.forEach((q, qIdx) => {
      const userSelected = userAnswers[q.id] || [];
      const verdict = compareAnswers(userSelected, q.answer);
      const accuracy = Math.round((q.correctCount / q.totalParticipants) * 100);

      const verdictClass = verdict === '정답' ? '정답'
                         : verdict === '부분 정답' ? '부분-정답'
                         : '오답';

      const myChoiceText = userSelected.length > 0
        ? userSelected.map(n => `${n}번`).join(', ')
        : '선택 없음';

      const correctText = q.answer.map(n => `${n}번`).join(', ');
      const englishType = typeMap[q.type] || 'TEST';

      // 4개 보기 카드 비교 레이아웃 생성
      const previewData = PREVIEW_QUESTIONS.find(pq => pq.id === q.id);
      let comparisonHtml = '';

      if (previewData) {
        comparisonHtml = previewData.options.map(opt => {
          const isAi = q.answer.includes(opt.number);
          const isMine = userSelected.includes(opt.number);
          
          let mediaHtml = '';
          if (previewData.type === 'image') {
            mediaHtml = `
              <div class="comparison-img-box">
                <img src="${opt.src}" alt="${q.title} ${opt.number}번">
              </div>
            `;
          } else {
            mediaHtml = `
              <div class="comparison-text-box" style="display: flex; align-items: stretch; justify-content: flex-start; text-align: left; padding: 20px; min-height: 160px; width: 100%;">
                <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
                  <h4 class="comparison-text-title" style="font-size: 0.92rem; font-weight: 700; line-height: 1.35; color: var(--black); margin: 0; word-break: keep-all;">${escapeHtml(opt.title || '')}</h4>
                  <p class="comparison-text-content" style="font-size: 0.75rem; font-weight: 400; line-height: 1.5; color: rgba(0, 0, 0, 0.55); margin: 0; word-break: keep-all; white-space: pre-wrap;">${escapeHtml(opt.content || '')}</p>
                </div>
              </div>
            `;
          }

          const badgeClass = isAi ? 'badge-ai' : 'badge-real';
          const badgeText = isAi ? 'AI' : 'REAL';
          const mineBadge = isMine ? `<span class="badge-user-choice">내 선택</span>` : '';
          const cardClass = isMine ? 'is-selected' : '';

          return `
            <div class="comparison-card ${cardClass}">
              ${mediaHtml}
              <div class="comparison-meta">
                <span class="comparison-option-num">${opt.number}번</span>
                <div style="display: flex; align-items: center; gap: 4px;">
                  ${mineBadge}
                  <span class="badge-ai-real ${badgeClass}">${badgeText}</span>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }

      const barsHtml = [1, 2, 3, 4].map(optNum => {
        const count = q.optionSelections[optNum] || 0;
        const rate = Math.round((count / q.totalParticipants) * 100);
        const isCorrect = q.answer.includes(optNum);
        const isMine = userSelected.includes(optNum);

        const badges = [];
        if (isCorrect) badges.push('<span class="stat-badge badge-correct">정답</span>');
        if (isMine) badges.push('<span class="stat-badge badge-mine">내 선택</span>');

        const barClass = isCorrect ? 'bar-ai' : 'bar-real';

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

      const card = document.createElement('div');
      card.className = 'answer-stat-card';
      card.innerHTML = `
        <div class="stat-card-header">
          <span class="stat-card-type-label">${englishType}</span>
          <span class="stat-question-num">문항 ${qIdx + 1} / ${QUESTION_STATS.length}</span>
        </div>
        
        <div class="stat-card-comparison-area">
          <div class="stat-comparison-grid">
            ${comparisonHtml}
          </div>
        </div>
 
        <div class="stat-info-details-summary">
          <div class="stat-details-grid-summary">
            <div class="detail-summary-item">
              <span class="detail-summary-label">정답 (AI)</span>
              <span class="detail-summary-val text-ai">${correctText}</span>
            </div>
            <div class="detail-summary-item">
              <span class="detail-summary-label">내 선택</span>
              <span class="detail-summary-val">${myChoiceText}</span>
            </div>
            <div class="detail-summary-item">
              <span class="detail-summary-label">결과</span>
              <span class="detail-summary-val verdict-${verdictClass}">${verdict}</span>
            </div>
            <div class="detail-summary-item">
              <span class="detail-summary-label">전체 정답률</span>
              <span class="detail-summary-val text-highlight">${accuracy}%</span>
            </div>
          </div>
        </div>

        <div class="stat-graph-section-sub">
          <span class="graph-title-sub">보기별 선택률</span>
          <div class="stat-bars-container">
            ${barsHtml}
          </div>
        </div>
      `;

      list.appendChild(card);
    });

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
            observer.unobserve(bar);
          }
        });
      }, { threshold: 0.1 });

      bars.forEach(bar => observer.observe(bar));
    } else {
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

    if (previewData.type === 'headline' || previewData.type === 'text' || previewData.type === 'article') {
      content.className = 'question-modal-content text-preview-grid';

      previewData.options.forEach(option => {
        const item = document.createElement('div');
        item.className = 'preview-text-option';
        item.innerHTML = `
          <div class="preview-option-number">${option.number}번</div>
          <div style="display: flex; flex-direction: column; gap: 8px; text-align: left; width: 100%;">
            <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--black); margin: 0; line-height: 1.4; word-break: keep-all;">${escapeHtml(option.title || '')}</h4>
            <p style="font-size: 0.85rem; font-weight: 400; color: rgba(0, 0, 0, 0.55); margin: 0; line-height: 1.55; word-break: keep-all; white-space: pre-wrap;">${escapeHtml(option.content || '')}</p>
          </div>
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

  const btnToAnswerStatsFromCollective = document.getElementById('btn-to-answer-stats-from-collective');
  if (btnToAnswerStatsFromCollective) {
    btnToAnswerStatsFromCollective.addEventListener('click', () => {
      renderAnswerStats();
      showScreen('answerStats');
    });
  }

  const btnToCollective = document.getElementById("btn-to-collective");
  if (btnToCollective) {
    btnToCollective.addEventListener("click", () => {
      renderCollectiveResults();
      showScreen("collectiveResult");
    });
  }

  const btnToCollectiveDirect = document.getElementById("btn-to-collective-direct");
  if (btnToCollectiveDirect) {
    btnToCollectiveDirect.addEventListener("click", () => {
      renderCollectiveResults();
      showScreen("collectiveResult");
    });
  }

  const btnToEnding = document.getElementById("btn-to-ending");
  if (btnToEnding) {
    btnToEnding.addEventListener("click", () => {
      renderEndingLeaderboard();
      showScreen("ending");
    });
  }

  const btnShareResult = document.getElementById("btn-share-result");
  if (btnShareResult) {
    btnShareResult.addEventListener("click", () => {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          alert("결과 링크가 클립보드에 복사되었습니다.");
        })
        .catch(() => {
          alert("링크 복사에 실패했습니다. 현재 주소를 직접 복사해주세요.");
        });
    });
  }

  const restartAction = () => {
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
  };

  document.getElementById('btn-restart').addEventListener('click', restartAction);

  const btnRestartFromCollective = document.getElementById('btn-restart-from-collective');
  if (btnRestartFromCollective) {
    btnRestartFromCollective.addEventListener('click', restartAction);
  }

  // --- GLOBAL HEADER NAVIGATION EVENTS ---
  const navProject = document.getElementById('nav-project');
  if (navProject) {
    navProject.addEventListener('click', () => showScreen('home'));
  }

  const navAbout = document.getElementById('nav-about');
  if (navAbout) {
    navAbout.addEventListener('click', () => {
      showScreen('home');
      setTimeout(() => {
        const introSection = document.querySelector('.home-intro');
        if (introSection) {
          introSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    });
  }

  const navTest = document.getElementById('nav-test');
  if (navTest) {
    navTest.addEventListener('click', () => {
      if (state.nickname) {
        // If a test is in progress, find the current active screen
        const currentActiveTest = Object.keys(screens).find(key => {
          return key !== 'home' && key !== 'analysis' && screens[key].classList.contains('active');
        });
        if (currentActiveTest) {
          showScreen(currentActiveTest);
        } else {
          showScreen('imageTest');
        }
      } else {
        showScreen('pretest');
      }
    });
  }

  const navResult = document.getElementById('nav-result');
  if (navResult) {
    navResult.addEventListener('click', () => {
      if (currentResult) {
        showScreen('personalResult');
      } else {
        renderEndingLeaderboard();
        showScreen('ending');
      }
    });
  }

  const btnGlobalStart = document.getElementById('btn-global-start');
  if (btnGlobalStart) {
    btnGlobalStart.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (typeof showScreen === 'function') {
        showScreen('pretest');
      } else {
        document.querySelectorAll('.screen').forEach(section => {
          section.classList.remove('active');
        });
        document.getElementById('screen-pretest')?.classList.add('active');
      }
    });
  }

});
