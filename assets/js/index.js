const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

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
