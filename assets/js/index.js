const root = document.documentElement;
document.querySelectorAll('.prose code').forEach((code) => {
  if (!code.closest('pre') && /[가-힣]/.test(code.textContent)) code.classList.add('prose-word');
});
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

// Keep code and colors selectable when clipboard permission is unavailable.
const copyIcons = {
  copy: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="5" width="12" height="16" rx="2"/><path d="M9 5V3h6v2M9 3h6"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
  error: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 6v7m0 3v2"/></svg>'
};
const setCopyIcon = (button, state, label) => {
  button.innerHTML = copyIcons[state] + '<span class="sr-only">' + label + '</span>';
  button.setAttribute('aria-label', label);
  button.title = label;
};
const copyReference = async (button, value) => {
  const originalLabel = button.dataset.copyLabel || button.textContent;
  button.dataset.copyLabel = originalLabel;
  try {
    await navigator.clipboard.writeText(value);
    if (button.classList.contains('copy-icon')) setCopyIcon(button, 'check', 'Copied');
    else button.textContent = 'Copied!';
  } catch {
    if (button.classList.contains('copy-icon')) setCopyIcon(button, 'error', 'Copy failed — select manually');
    else button.textContent = 'Copy failed — select manually';
  }
  clearTimeout(button.copyFeedbackTimer);
  button.copyFeedbackTimer = setTimeout(() => {
    if (button.classList.contains('copy-icon')) setCopyIcon(button, 'copy', 'Copy code');
    else button.textContent = originalLabel;
  }, 1800);
};

document.querySelectorAll('.prose pre').forEach((pre) => {
  const code = pre.querySelector('code');
  const wrapper = document.createElement('div');
  wrapper.className = 'code-copy-block';
  pre.before(wrapper);
  wrapper.append(pre);
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy-button copy-icon';
  setCopyIcon(button, 'copy', 'Copy code');
  button.setAttribute('aria-live', 'polite');
  button.addEventListener('click', () => copyReference(button, (code || pre).textContent));
  wrapper.append(button);
});

document.querySelectorAll('[data-copy-value]').forEach((button) => {
  button.setAttribute('aria-live', 'polite');
  button.addEventListener('click', () => copyReference(button, button.dataset.copyValue));
});
