// ==============================
// 타입
// ==============================
export type Idol = {
  id: number;
  name: string;
  groupName: string;
  avatarUrl: string;
  position: '보컬' | '댄서' | '랩';
};

// ==============================
// 상수/유틸 (서버 목업 키는 하나만!)
// ==============================
const SERVER_FAVORITES_KEY = 'mock-server-favorites';
const POSITIONS: Idol['position'][] = ['보컬', '댄서', '랩'];

// 무한스크롤 볼륨 조절용 (필요 시 숫자만 바꾸면 됨)
const EXTRA_GROUPS_LENGTH = 40; // 추가 생성할 가상 그룹 개수
const MEMBERS_PER_EXTRA_GROUP = 8; // 각 가상 그룹의 멤버 수

const sleep = (ms: number) => {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
};

function loadServerFavorites(): number[] {
  try {
    const raw = localStorage.getItem(SERVER_FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveServerFavorites(ids: number[]) {
  try {
    localStorage.setItem(SERVER_FAVORITES_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

// DiceBear(상업 가능) 아바타 PNG
const avatar = (seed: string, size = 256) =>
  `https://api.dicebear.com/7.x/thumbs/png?seed=${encodeURIComponent(seed)}&size=${size}`;

export const DEMO_IDOL: Idol = {
  id: 10001,
  name: '은하',
  groupName: 'VIVIZ',
  avatarUrl: avatar('VIVIZ-은하'),
  position: '보컬',
};

// ==============================
// 기본(실존 느낌) 그룹 데이터
// ==============================
type GroupDef = { group: string; members: string[] };

const GROUPS: GroupDef[] = [
  { group: '에스파', members: ['카리나', '윈터', '지젤', '닝닝'] },
  { group: '뉴진스', members: ['민지', '하니', '다니엘', '해린', '혜인'] },
  {
    group: '아이브',
    members: ['안유진', '가을', '레이', '장원영', '리즈', '이서'],
  },
  {
    group: '르세라핌',
    members: ['사쿠라', '김채원', '허윤진', '카즈하', '홍은채'],
  },
  { group: '블랙핑크', members: ['지수', '제니', '로제', '리사'] },
  {
    group: '트와이스',
    members: [
      '나연',
      '정연',
      '모모',
      '사나',
      '지효',
      '미나',
      '다현',
      '채영',
      '쯔위',
    ],
  },
  { group: '있지', members: ['예지', '리아', '류진', '채령', '유나'] },
  {
    group: '엔믹스',
    members: ['해원', '릴리', '설윤', '배이', '지우', '규진'],
  },
  { group: '(여자)아이들', members: ['미연', '민니', '소연', '우기', '슈화'] },
  { group: '레드벨벳', members: ['아이린', '슬기', '웬디', '조이', '예리'] },
  {
    group: '방탄소년단',
    members: ['RM', '진', '슈가', '제이홉', '지민', '뷔', '정국'],
  },
  {
    group: '세븐틴',
    members: [
      '에스쿱스',
      '정한',
      '조슈아',
      '준',
      '호시',
      '원우',
      '우지',
      '디에잇',
      '민규',
      '도겸',
      '승관',
      '버논',
      '디노',
    ],
  },
  {
    group: '스트레이키즈',
    members: ['방찬', '리노', '창빈', '현진', '한', '필릭스', '승민', '아이엔'],
  },
  {
    group: '엑소',
    members: [
      '수호',
      '시우민',
      '레이',
      '백현',
      '첸',
      '찬열',
      '디오',
      '카이',
      '세훈',
    ],
  },
  {
    group: '엔시티 127',
    members: [
      '태일',
      '쟈니',
      '태용',
      '유타',
      '도영',
      '재현',
      '정우',
      '마크',
      '해찬',
    ],
  },
  {
    group: '엔시티 드림',
    members: ['마크', '런쥔', '제노', '해찬', '재민', '천러', '지성'],
  },
  {
    group: '더보이즈',
    members: [
      '상연',
      '제이콥',
      '영훈',
      '현재',
      '주연',
      '케빈',
      '뉴',
      '큐',
      '주학년',
      '선우',
      '에릭',
    ],
  },
  {
    group: '에이티즈',
    members: ['홍중', '성화', '윤호', '여상', '산', '민기', '우영', '종호'],
  },
  {
    group: '아이콘',
    members: ['진환', '윤형', '바비', '동혁', '주네', '찬우'],
  },
  { group: '하이라이트', members: ['윤두준', '양요섭', '이기광', '손동운'] },

  // 혼성/추가 (테스트용)
  {
    group: 'K-STAR',
    members: ['은하수', '별빛', '태양', '달빛', '새벽', '노을'],
  },
  {
    group: '빔프로젝트',
    members: ['라이트', '섀도', '미러', '프리즘', '레인보우'],
  },
  { group: '딩딩', members: ['디노', '딩딩', '딩구', '땡땡', '딩고'] },
];

// ==============================
// 무한스크롤용 대량 생성
// ==============================
const EXTRA_GROUPS: GroupDef[] = Array.from({
  length: EXTRA_GROUPS_LENGTH,
}).map((_, groupIndex) => {
  // _ → groupIndex
  const members = Array.from({ length: MEMBERS_PER_EXTRA_GROUP }).map(
    (__, memberIndex) => `연습생${groupIndex + 1}-${memberIndex + 1}`, // _ → __
  );
  return { group: `연습생유닛-${groupIndex + 1}`, members };
});

// ==============================
// 아이돌 풀 빌드(안정적 ID, 정렬 보장)
// ==============================
function buildMockIdols(): Idol[] {
  let nextId = 0;
  const idols: Idol[] = [DEMO_IDOL];
  const allGroups = [...GROUPS, ...EXTRA_GROUPS];

  allGroups.forEach(({ group, members }) => {
    members.forEach((name, index) => {
      nextId += 1;
      idols.push({
        id: nextId,
        name,
        groupName: group,
        avatarUrl: avatar(`${group}-${name}`), // 시드 고정 → 이미지 안정
        position: POSITIONS[index % POSITIONS.length],
      });
    });
  });

  // 이름 → 그룹 기준 안정 정렬(검색/스크롤 재현성 ↑)
  idols.sort((a, b) => {
    if (a.name === b.name) return a.groupName.localeCompare(b.groupName);
    return a.name.localeCompare(b.name);
  });

  return idols;
}

export const MOCK_IDOLS: Idol[] = buildMockIdols(); // 200명+ 보장

// ==============================
// 목업 API
// ==============================

/** 서버(목업)의 즐겨찾기 목록을 아이돌 객체 배열로 반환 */
export async function fetchFavoriteIdols(): Promise<Idol[]> {
  await sleep(200);
  const favoriteIdSet = new Set(loadServerFavorites());
  return MOCK_IDOLS.filter(idol => favoriteIdSet.has(idol.id));
}

/** 검색 + 페이지네이션(무한스크롤) */
export async function searchIdols(
  query: string,
  page: number,
  pageSize: number,
): Promise<{ items: Idol[]; nextPage: number | null }> {
  await sleep(250);

  const q = query.trim().toLowerCase();
  if (!q) return { items: [], nextPage: null };

  const filtered = MOCK_IDOLS.filter(idol => {
    const name = idol.name.toLowerCase();
    const group = idol.groupName.toLowerCase();
    return name.includes(q) || group.includes(q);
  });

  const start = page * pageSize;
  const end = start + pageSize;
  const items = filtered.slice(start, end);
  const nextPage = end < filtered.length ? page + 1 : null;

  return { items, nextPage };
}

/**
 * 즐겨찾기 토글 (서버 목업 상태 반영)
 * - 실제 API 연결 시 add/remove 엔드포인트로 대체
 */
export async function toggleFavorite(
  id: number,
): Promise<{ id: number; isFavorited: boolean }> {
  await sleep(150);

  const current = new Set(loadServerFavorites());
  if (current.has(id)) {
    current.delete(id);
  } else {
    current.add(id);
  }

  const updated = Array.from(current);
  saveServerFavorites(updated);

  return { id, isFavorited: current.has(id) };
}

// ==============================
// 개발 편의(로컬 초기화)
// ==============================

/** 서버(목업) 즐겨찾기(localStorage)만 초기화 */
export function resetMockServerFavorites() {
  try {
    localStorage.removeItem(SERVER_FAVORITES_KEY);
  } catch {
    // ignore
  }
}

/** 서버(목업) + zustand persist 모두 초기화 */
export function resetAllMockData() {
  try {
    localStorage.removeItem(SERVER_FAVORITES_KEY); // 서버 목업 상태
    localStorage.removeItem('favorites-storage'); // zustand persist 기본키 (스토어 파일에서 설정한 키)
  } catch {
    // ignore
  }
}
