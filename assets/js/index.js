const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const languageToggle = document.querySelector('.language-toggle');
const interfaceCopy = {
  'Home': '홈', 'Work': '작업', 'Library': '라이브러리', 'Notes': '노트', 'Readlog': '읽은 기록',
  'Selected Work': '주요 프로젝트', 'Experience': '경력', 'Education': '학력',
  'Projects': '프로젝트', 'Certificates': '자격·인증',
  'CURRENTLY': '현재', 'EDUCATION': '학력',
  'Fonts': '폰트', 'Colors': '색상', 'UI Components': 'UI 컴포넌트', 'Commands': '명령어',
  'Browse references': '자료 보기',
  'Useful references, ready to reuse.': '다시 꺼내 쓰는 자료들.',
  'Fonts, colors, interface components, and commands I return to.': '자주 사용하는 폰트, 색상, UI 컴포넌트와 명령어를 모읍니다.',
  'Font previews, usage notes, and licensing references.': '폰트 미리보기, 사용 기록과 라이선스 정보.',
  'Colors, palettes, and combinations for everyday use.': '자주 사용하는 색상, 팔레트와 조합.',
  'Reusable interface elements with examples and code.': '재사용할 UI 요소와 예제 코드.',
  'Command references for Git, tmux, Linux, CMD, and PowerShell.': 'Git, tmux, Linux, CMD와 PowerShell 명령어.',
  'Notes, Notes.': '배우고 생각한 기록.',
  'Short notes on engineering, computer science, and ideas worth remembering.': '기술을 배우며 기억하고 싶은 내용을 기록합니다.',
  'Things consumed, thoughts retained.': '읽고 보고, 남긴 생각.',
  'Notes and reflections on books, YouTube videos, columns, articles, and news.': '책, 영상, 칼럼, 아티클과 뉴스를 읽고 남긴 기록입니다.',
  'Notes are being prepared.': '노트를 준비하고 있습니다.',
  'Writing on engineering, data, and learning will live here.': '기술, 데이터와 배움에 관한 글을 모읍니다.',
  'No published notes yet.': '아직 공개된 노트가 없습니다.', 'Check back soon.': '다음에 다시 들러 주세요.',
  'No readlog entries yet.': '아직 읽은 기록이 없습니다.',
  'Books, videos, columns, articles, and news will live here.': '책, 영상, 칼럼, 아티클과 뉴스에 관한 기록을 모읍니다.',
  'No references yet.': '아직 등록된 자료가 없습니다.',
  'CONTACT': '연락처', 'Email ↗': '이메일 ↗', 'SOCIAL & WRITING': '소셜 · 글', 'LOCAL TIME': '현재 시각',
  '← All notes': '← 모든 노트', '← All readlog entries': '← 모든 읽은 기록',
  'Skip to content': '본문으로 이동', 'Toggle navigation': '메뉴 열기·닫기'
};
const translatedElements = new Map();
const languageSelectors = '.site-nav a, .index-heading h2, .page-intro h1, .page-intro > p, .page-intro .eyebrow a, .compact-row h3, .compact-row p, .compact-row small, .intro-facts small, .empty-state p, .empty-state span, .footer-links small, .footer-links .icon-link span, .back-link, .skip-link, .menu-toggle .sr-only';
document.querySelectorAll(languageSelectors).forEach((element) => {
  // Containers with a breadcrumb link are translated through the link itself.
  if (element.querySelector('a')) return;
  const original = element.textContent.replace(/\s+/g, ' ').trim();
  if (interfaceCopy[original]) translatedElements.set(element, { html: element.innerHTML, ko: interfaceCopy[original] });
});
const uiLanguage = () => root.dataset.uiLang === 'en' ? 'en' : 'ko';
const applyLanguage = (language) => {
  root.dataset.uiLang = language;
  root.lang = language;
  translatedElements.forEach((copy, element) => {
    if (language === 'ko') element.textContent = copy.ko;
    else element.innerHTML = copy.html;
  });
  document.querySelectorAll('[data-copy-ko][data-copy-en]').forEach((element) => {
    element.textContent = language === 'ko' ? element.dataset.copyKo : element.dataset.copyEn;
  });
  const label = language === 'ko' ? 'Switch to English' : '한국어로 전환';
  languageToggle?.setAttribute('aria-label', label);
  languageToggle?.setAttribute('title', label);
  themeToggle?.setAttribute('aria-label', language === 'ko' ? '밝은 테마·어두운 테마 전환' : 'Toggle color theme');
  nav?.setAttribute('aria-label', language === 'ko' ? '주 메뉴' : 'Primary navigation');
};
languageToggle?.addEventListener('click', () => {
  const next = uiLanguage() === 'ko' ? 'en' : 'ko';
  try { localStorage.setItem('language', next); } catch { /* Selection still works for this page. */ }
  applyLanguage(next);
});

themeToggle?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('theme', next);
});

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('is-open', !open);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuToggle?.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
}));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion || !('IntersectionObserver' in window)) {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

const timeElement = document.querySelector('#local-time');
const updateClock = () => {
  if (!timeElement) return;
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hour12: false
  }).format(new Date());
  timeElement.textContent = `${time} KST`;
};
updateClock();
setInterval(updateClock, 60000);

// Keep code and colors selectable when clipboard permission is unavailable.
const copyReference = async (button, value) => {
  const originalLabel = button.dataset.copyLabel || button.textContent;
  button.dataset.copyLabel = originalLabel;
  try {
    await navigator.clipboard.writeText(value);
    button.textContent = uiLanguage() === 'ko' ? '복사 완료!' : 'Copied!';
  } catch {
    button.textContent = uiLanguage() === 'ko' ? '복사 실패 — 직접 선택해 주세요' : 'Copy failed — select manually';
  }
  clearTimeout(button.copyFeedbackTimer);
  button.copyFeedbackTimer = setTimeout(() => {
    button.textContent = button.dataset.copyEn ? (uiLanguage() === 'ko' ? button.dataset.copyKo : button.dataset.copyEn) : originalLabel;
  }, 2200);
};

document.querySelectorAll('.library-content pre').forEach((pre) => {
  const code = pre.querySelector('code');
  const wrapper = document.createElement('div');
  wrapper.className = 'code-copy-block';
  pre.before(wrapper);
  wrapper.append(pre);
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy-button';
  button.textContent = 'Copy code';
  button.dataset.copyEn = 'Copy code';
  button.dataset.copyKo = '코드 복사';
  button.setAttribute('aria-live', 'polite');
  button.addEventListener('click', () => copyReference(button, (code || pre).textContent));
  wrapper.append(button);
});

document.querySelectorAll('[data-copy-value]').forEach((button) => {
  button.setAttribute('aria-live', 'polite');
  button.addEventListener('click', () => copyReference(button, button.dataset.copyValue));
});

applyLanguage(uiLanguage());
