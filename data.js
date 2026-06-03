const testData = {
  images: [
    {
      id: "img_1",
      title: "Neon Horizon",
      isAi: true,
      src: "https://i.postimg.cc/y6jcmbd4/20260409-044042-8f50f65b.jpg",
      tagline: "미래형 사이버펑크 메가시티",
      description: "화려하고 빈틈없는 완성도를 보여주지만, 어딘가 어색한 간판의 문자 뭉개짐과 건물 창문 배열의 비물리적인 대칭 붕괴가 관찰되는 AI 이미지입니다."
    },
    {
      id: "img_2",
      title: "을지로의 가을 비",
      isAi: true,
      src: "https://i.postimg.cc/wjC0CGD6/seukeulinsyas-2026-05-14-ojeon-3-01-36.png",
      tagline: "실제 스트리트 포토그래피",
      description: "인간 사진작가가 비 내리는 을지로 골목길의 찰나를 수동 카메라로 포착한 사진입니다."
    },
    {
      id: "img_3",
      title: "시간을 품은 소녀",
      isAi: false,
      src: "https://i.postimg.cc/CdyRhk7L/image-50.png",
      tagline: "초현실주의 디지털 아트",
      description: "환상적이고 몽환적인 분위기를 자아내지만, 소녀의 귓바퀴 구조와 귀걸이의 기하학적 결합 방식이 불규칙한 AI 이미지입니다."
    },
    {
      id: "img_4",
      title: "할머니의 뜨개질",
      isAi: false,
      src: "https://i.postimg.cc/ZR28N9Hr/image-52.png",
      tagline: "일상의 클로즈업 사진",
      description: "인간 다큐멘터리 사진작가가 매크로 렌즈로 촬영한 실제 사진입니다."
    }
  ],
  images2: [
    {
      id: "img2_1",
      title: "Quantum Transit",
      isAi: true,
      src: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800",
      tagline: "차원을 넘는 초현실적 기차",
      description: "중력과 물리 법칙을 완전히 무시한 채, 기차가 달릴수록 배경의 빌딩들이 변하는 전형적인 AI 이미지입니다."
    },
    {
      id: "img2_2",
      title: "도심 속 바쁜 사람들",
      isAi: true,
      src: "https://i.postimg.cc/ZR9kRQyh/6ea47097-a104-496b-8a60-efa7d27168a4.png",
      tagline: "도심 풍경",
      description: "실제 도심의 바쁜 일상을 담은 사진입니다."
    },
    {
      id: "img2_3",
      title: "우주 탐험",
      isAi: false,
      src: "https://i.postimg.cc/VsjGR1w9/a059e21decc9877077beeaeb5fd25628.jpg",
      tagline: "상상 속의 우주",
      description: "인공지능이 상상한 우주의 모습입니다."
    },
    {
      id: "img2_4",
      title: "자연의 소리",
      isAi: true,
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
      tagline: "숲 속의 아침",
      description: "실제 숲 속의 아침 풍경을 담은 사진입니다."
    }
  ],
  images3: [
    {
      id: "img3_1",
      title: "초현실적인 숲",
      isAi: true,
      src: "https://i.postimg.cc/Y23N0Skn/20260603-122437-969ccb03.jpg",
      tagline: "네온 빛의 나무들",
      description: "인공지능이 상상한 네온 빛이 가득한 신비로운 숲 이미지입니다."
    },
    {
      id: "img3_2",
      title: "고요한 호수",
      isAi: true,
      src: "https://i.postimg.cc/Hk5VJSXJ/hf-20260603-073900-fdf3dd95-672c-4307-9436-cb3cc0a4e336.png",
      tagline: "자연 그대로의 풍경",
      description: "인간 사진작가가 촬영한 아름답고 고요한 호수 사진입니다."
    },
    {
      id: "img3_3",
      title: "미래 도시 비행",
      isAi: false,
      src: "https://i.postimg.cc/zGJGBJz0/seukeulinsyas-2026-06-03-ohu-9-32-58.png",
      tagline: "사이버펑크 스카이라인",
      description: "물리 법칙을 무시한 형태의 비행체가 떠있는 전형적인 AI 생성물입니다."
    },
    {
      id: "img3_4",
      title: "빈티지 카페",
      isAi: true,
      src: "https://i.postimg.cc/LhKy396d/e8f23a811df3ba8fdc203ebc0fae9b40.jpg",
      tagline: "따뜻한 아날로그 감성",
      description: "필름 카메라로 촬영된 실제 카페의 한 구석입니다."
    }
  ],
  images4: [
    {
      id: "img4_1",
      title: "디지털 스케이프 1",
      isAi: false,
      src: "https://i.postimg.cc/7L8X7QRB/pngtree-red-lollipop-candy-with-white-swirels-png-image-21009631.png",
      tagline: "네온 빛의 나무들",
      description: "인공지능이 상상한 네온 빛이 가득한 신비로운 숲 이미지입니다."
    },
    {
      id: "img4_2",
      title: "디지털 스케이프 2",
      isAi: false,
      src: "https://i.postimg.cc/PJ91HCnT/photo-1773332611612-ffdaa753afb1.avif",
      tagline: "자연 그대로의 풍경",
      description: "인간 사진작가가 촬영한 아름답고 고요한 호수 사진입니다."
    },
    {
      id: "img4_3",
      title: "디지털 스케이프 3",
      isAi: false,
      src: "https://i.postimg.cc/y89yVyd4/photo-1595434091143-b375ced5fe5c.avif",
      tagline: "사이버펑크 스카이라인",
      description: "물리 법칙을 무시한 형태의 비행체가 떠있는 전형적인 AI 생성물입니다."
    },
    {
      id: "img4_4",
      title: "디지털 스케이프 4",
      isAi: true,
      src: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800",
      tagline: "따뜻한 아날로그 감성",
      description: "필름 카메라로 촬영된 실제 카페의 한 구석입니다."
    }
  ],
  images5: [
    {
      id: "img5_1",
      title: "비주얼 아트 1",
      isAi: false,
      src: "https://i.postimg.cc/zvKnFTcd/photo-1780380069585-4703916d9ea4.avif",
      tagline: "네온 빛의 나무들",
      description: "인공지능이 상상한 네온 빛이 가득한 신비로운 숲 이미지입니다."
    },
    {
      id: "img5_2",
      title: "비주얼 아트 2",
      isAi: true,
      src: "https://i.postimg.cc/28YvfbJ3/272d0bcc-5b84-445b-b300-d41d12fa0a62.png",
      tagline: "자연 그대로의 풍경",
      description: "인간 사진작가가 촬영한 아름답고 고요한 호수 사진입니다."
    },
    {
      id: "img5_3",
      title: "비주얼 아트 3",
      isAi: false,
      src: "https://i.postimg.cc/ZKgSdpSS/photo-1780037125452-7819c0d0871a.avif",
      tagline: "사이버펑크 스카이라인",
      description: "물리 법칙을 무시한 형태의 비행체가 떠있는 전형적인 AI 생성물입니다."
    },
    {
      id: "img5_4",
      title: "비주얼 아트 4",
      isAi: true,
      src: "https://i.postimg.cc/Bb9h3ZWh/20260603-124819-94a03b9f.jpg",
      tagline: "따뜻한 아날로그 감성",
      description: "필름 카메라로 촬영된 실제 카페의 한 구석입니다."
    }
  ],
  webtoons: [
    {
      id: "webtoon_1",
      title: "일러스트 1",
      isAi: false,
      src: "https://i.postimg.cc/1RMK3KZ8/910e8f17c75c45edfaf7a8fbace3c39b.jpg",
      tagline: "일러스트 샘플 1",
      description: "AI가 생성한 일러스트입니다."
    },
    {
      id: "webtoon_2",
      title: "일러스트 2",
      isAi: true,
      src: "https://i.postimg.cc/pXhnMQVV/a64bbd16-62a4-4907-899f-15b2e421d49d.png",
      tagline: "일러스트 샘플 2",
      description: "작가가 직접 그린 일러스트입니다."
    },
    {
      id: "webtoon_3",
      title: "일러스트 3",
      isAi: false,
      src: "https://i.postimg.cc/SsLbMvGb/84e2f1a35b37bdb6080ed60d67e5d88c.jpg",
      tagline: "일러스트 샘플 3",
      description: "AI가 생성한 일러스트입니다."
    },
    {
      id: "webtoon_4",
      title: "일러스트 4",
      isAi: true,
      src: "https://i.postimg.cc/ZK5zWjvp/20260603-133741-1f1cfac4.jpg",
      tagline: "일러스트 샘플 4",
      description: "작가가 직접 그린 일러스트입니다."
    }
  ],
  paintings: [
    {
      id: "painting_1",
      title: "페인팅 1",
      isAi: true,
      src: "https://i.postimg.cc/260TMdkM/b9f9ee9a-bf31-4fdf-8ac4-fb5accd97ec4.png",
      tagline: "페인팅 샘플 1",
      description: "AI가 생성한 페인팅입니다."
    },
    {
      id: "painting_2",
      title: "페인팅 2",
      isAi: false,
      src: "https://i.postimg.cc/5yZ5WnZP/9cc05429cae5fb47c34adca271a8e3e7.jpg",
      tagline: "페인팅 샘플 2",
      description: "작가가 직접 그린 페인팅입니다."
    },
    {
      id: "painting_3",
      title: "페인팅 3",
      isAi: false,
      src: "https://i.postimg.cc/JhPbz1f1/262bc41bb6361f852caa115d57aff7c2.jpg",
      tagline: "페인팅 샘플 3",
      description: "AI가 생성한 페인팅입니다."
    },
    {
      id: "painting_4",
      title: "페인팅 4",
      isAi: true,
      src: "https://i.postimg.cc/RVBQdbLF/ef2d8b09-a2c5-4040-86a4-618f2c2093e0.png",
      tagline: "페인팅 샘플 4",
      description: "작가가 직접 그린 페인팅입니다."
    }
  ],
  paintings2: [
    {
      id: "painting2_1",
      title: "원본 이미지",
      isAi: false,
      invertSelection: true,
      src: "https://i.postimg.cc/N0cKqWL5/0422c6556c6794ffcd2472d65146b5a2.jpg",
      tagline: "원본 이미지",
      description: "AI가 학습한 원본 이미지입니다."
    },
    {
      id: "painting2_2",
      title: "AI 드로잉 1",
      isAi: true,
      invertSelection: true,
      src: "https://i.ibb.co/5h7XCKJQ/53c90148-2f1d-4c64-a4ef-3ef171a8f4b2.png",
      tagline: "AI 생성 이미지",
      description: "원본 이미지를 바탕으로 생성된 AI 드로잉 이미지입니다."
    },
    {
      id: "painting2_3",
      title: "AI 드로잉 2",
      isAi: true,
      invertSelection: true,
      src: "https://i.ibb.co/PsJHW7pX/ea49a59c-8d20-48f3-9e8a-65ab9e3b65b3.png",
      tagline: "AI 생성 이미지",
      description: "원본 이미지를 바탕으로 생성된 AI 드로잉 이미지입니다."
    },
    {
      id: "painting2_4",
      title: "AI 드로잉 3",
      isAi: true,
      invertSelection: true,
      src: "https://i.ibb.co/0jYGXLxf/60ae5f42-04ad-421f-bc80-a4ccb6817996.png",
      tagline: "AI 생성 이미지",
      description: "원본 이미지를 바탕으로 생성된 AI 드로잉 이미지입니다."
    }
  ],
  text: [
    {
      id: "text_1",
      title: "올해 첫 영향 태풍 ‘장미’ 소멸…온대저기압으로 변질",
      isAi: false,
      content: "",
      description: "기상청 등에서 발표하는 전형적인 형태의 사실 전달형 기사 헤드라인입니다."
    },
    {
      id: "text_2",
      title: "초등교사 10명 중 7명 \"정서 지도 부담 커졌다\"",
      isAi: true,
      content: "",
      description: "설문조사 결과를 바탕으로 작성된 일반적인 형태의 기사 헤드라인입니다."
    },
    {
      id: "text_3",
      title: "전국 편의점 매출 1위 품목은 삼각김밥 아닌 '이것'",
      isAi: true,
      content: "",
      description: "독자의 호기심을 유발하여 클릭을 유도하기 위해 생성된 전형적인 낚시성(Clickbait) AI 헤드라인입니다."
    },
    {
      id: "text_4",
      title: "하버드 출신 의사가 경고한 ‘조용히 몸 망치는 습관’ 8가지",
      isAi: false,
      content: "",
      description: "권위자의 이름을 빌려 조회수를 높이려는 목적으로 자주 생성되는 형태의 AI 기사 헤드라인입니다."
    }
  ]
};

// =============================================
// 문항별 통계 데이터 (정답지와 통계 페이지용)
// answer: AI인 보기 번호 배열 (실제 data.js isAi 기반)
// =============================================
const QUESTION_STATS = [
  {
    id: "img",
    title: "이미지 테스트 1",
    type: "이미지",
    // img_1=AI(1번), img_2=AI(2번), img_3=인간(3번), img_4=인간(4번)
    answer: [1, 2],
    totalParticipants: 120,
    correctCount: 58,
    optionSelections: { 1: 71, 2: 63, 3: 44, 4: 38 }
  },
  {
    id: "img2",
    title: "이미지 테스트 2",
    type: "이미지",
    // img2_1=AI(1번), img2_2=AI(2번), img2_3=인간(3번), img2_4=AI(4번)
    answer: [1, 2, 4],
    totalParticipants: 120,
    correctCount: 43,
    optionSelections: { 1: 68, 2: 55, 3: 31, 4: 72 }
  },
  {
    id: "img3",
    title: "이미지 테스트 3",
    type: "이미지",
    // img3_1=AI(1번), img3_2=AI(2번), img3_3=인간(3번), img3_4=AI(4번)
    answer: [1, 2, 4],
    totalParticipants: 120,
    correctCount: 39,
    optionSelections: { 1: 74, 2: 61, 3: 47, 4: 58 }
  },
  {
    id: "img4",
    title: "이미지 테스트 4",
    type: "이미지",
    // img4_1=인간(1번), img4_2=인간(2번), img4_3=인간(3번), img4_4=AI(4번)
    answer: [4],
    totalParticipants: 120,
    correctCount: 64,
    optionSelections: { 1: 38, 2: 29, 3: 42, 4: 77 }
  },
  {
    id: "img5",
    title: "이미지 테스트 5",
    type: "이미지",
    // img5_1=인간(1번), img5_2=AI(2번), img5_3=인간(3번), img5_4=AI(4번)
    answer: [2, 4],
    totalParticipants: 120,
    correctCount: 51,
    optionSelections: { 1: 33, 2: 79, 3: 41, 4: 66 }
  },
  {
    id: "webtoon",
    title: "일러스트 테스트",
    type: "일러스트",
    // webtoon_1=인간(1번), webtoon_2=AI(2번), webtoon_3=인간(3번), webtoon_4=AI(4번)
    answer: [2, 4],
    totalParticipants: 120,
    correctCount: 53,
    optionSelections: { 1: 41, 2: 69, 3: 38, 4: 72 }
  },
  {
    id: "painting",
    title: "페인팅 테스트",
    type: "페인팅",
    // painting_1=AI(1번), painting_2=인간(2번), painting_3=인간(3번), painting_4=AI(4번)
    answer: [1, 4],
    totalParticipants: 120,
    correctCount: 47,
    optionSelections: { 1: 66, 2: 44, 3: 39, 4: 58 }
  },
  {
    id: "painting2",
    title: "드로잉 테스트",
    type: "드로잉",
    // invertSelection: 원본(painting2_1=1번)을 클릭해야 정답
    answer: [1],
    totalParticipants: 120,
    correctCount: 61,
    optionSelections: { 1: 73, 2: 48, 3: 39, 4: 29 }
  },
  {
    id: "text",
    title: "헤드라인 테스트",
    type: "헤드라인",
    // text_1=인간(1번), text_2=AI(2번), text_3=AI(3번), text_4=인간(4번)
    answer: [2, 3],
    totalParticipants: 120,
    correctCount: 38,
    optionSelections: { 1: 51, 2: 64, 3: 58, 4: 46 }
  }
];

// 정답 판정 함수
function compareAnswers(userSelected = [], correctAnswer = []) {
  const user = [...userSelected].map(Number).sort((a, b) => a - b);
  const correct = [...correctAnswer].map(Number).sort((a, b) => a - b);

  const exact =
    user.length === correct.length &&
    user.every((value, index) => value === correct[index]);

  if (exact) return "정답";

  const partial = user.some(value => correct.includes(value));
  if (partial) return "부분 정답";

  return "오답";
}

// =============================================
// PREVIEW QUESTIONS (다시 보기용 원본 데이터)
// =============================================
const PREVIEW_QUESTIONS = [
  {
    id: "img",
    title: "이미지 테스트 1",
    type: "image",
    options: testData.images.map((item, idx) => ({ number: idx + 1, src: item.src }))
  },
  {
    id: "img2",
    title: "이미지 테스트 2",
    type: "image",
    options: testData.images2.map((item, idx) => ({ number: idx + 1, src: item.src }))
  },
  {
    id: "img3",
    title: "이미지 테스트 3",
    type: "image",
    options: testData.images3.map((item, idx) => ({ number: idx + 1, src: item.src }))
  },
  {
    id: "img4",
    title: "이미지 테스트 4",
    type: "image",
    options: testData.images4.map((item, idx) => ({ number: idx + 1, src: item.src }))
  },
  {
    id: "img5",
    title: "이미지 테스트 5",
    type: "image",
    options: testData.images5.map((item, idx) => ({ number: idx + 1, src: item.src }))
  },
  {
    id: "webtoon",
    title: "일러스트 테스트",
    type: "image",
    options: testData.webtoons.map((item, idx) => ({ number: idx + 1, src: item.src }))
  },
  {
    id: "painting",
    title: "페인팅 테스트",
    type: "image",
    options: testData.paintings.map((item, idx) => ({ number: idx + 1, src: item.src }))
  },
  {
    id: "painting2",
    title: "드로잉 테스트",
    type: "image",
    options: testData.paintings2.map((item, idx) => ({ number: idx + 1, src: item.src }))
  },
  {
    id: "text",
    title: "헤드라인 테스트",
    type: "headline",
    options: testData.text.map((item, idx) => ({ number: idx + 1, text: item.title }))
  }
];
