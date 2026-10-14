const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits = ['♠', '♥', '♣', '♦'];

export function drawRanks(random = Math.random) {
  const left = Math.floor(random() * 13);
  const next = Math.floor(random() * 12);
  return [left, next >= left ? next + 1 : next];
}

class CardDuel extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const volume = this.getAttribute('mode') !== 'reaction';
    const initial = volume ? 'Volume' : 'Like / Dislike';
    const labels = volume ? ['Up', 'Down'] : ['좋아요', '싫어요'];
    const icons = volume ? ['↑', '↓'] : ['♡', '×'];
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host { display:inline-block; vertical-align:middle; }
        * { box-sizing:border-box; }
        button { position:relative; display:inline-flex; align-items:center; justify-content:center; width:132px; height:38px; padding:0 14px; border:1px solid var(--line,#deded9); border-radius:7px; background:var(--bg,#fff); color:var(--text,#171717); font:500 13px/1 system-ui,sans-serif; cursor:pointer; box-shadow:0 1px 2px #00000006; transition:background .15s; }
        button:hover:not(:disabled) { background:var(--soft,#f4f4f4); }
        button:focus-visible { outline:2px solid currentColor; outline-offset:4px; }
        button:disabled { cursor:wait; }
        .label { display:flex; align-items:center; gap:8px; }
        .icon { font-size:17px; font-weight:400; }
        .cards { display:none; position:absolute; inset:0; grid-template-columns:1fr 1fr; overflow:hidden; border-radius:6px; }
        .cell { display:flex; justify-content:center; align-items:center; gap:5px; font-size:17px; font-weight:600; }
        .cell + .cell { border-left:1px solid var(--line,#ddd); }
        .suit { font-size:12px; } .red { color:#c44444; }
        button[data-phase="rolling"] .label,button[data-phase="reveal"] .label { visibility:hidden; }
        button[data-phase="rolling"] .cards,button[data-phase="reveal"] .cards { display:grid; }
        button[data-phase="rolling"] .cell > span { animation:shuffle .1s linear infinite; }
        button[data-phase="rolling"] .cell:last-child > span { animation-delay:-.05s; }
        .cell[data-winner="true"] { background:var(--text,#171717); color:var(--bg,#fff); }
        .cell[data-winner="true"] .red { color:inherit; }
        .cell[data-winner="false"] { opacity:.4; }
        .sr-only { position:absolute; width:1px; height:1px; overflow:hidden; clip-path:inset(50%); white-space:nowrap; }
        @keyframes shuffle { from { transform:translateY(-12px); opacity:.3; } to { transform:translateY(12px); opacity:.9; } }
        @media(prefers-reduced-motion:reduce) { *,*::before,*::after { animation:none!important; transition:none!important; } }
      </style>
      <button type="button" data-phase="idle">
        <span class="label"><span class="icon" aria-hidden="true">${volume ? '↕' : '♡'}</span><span class="text">${initial}</span></span>
        <span class="cards" aria-hidden="true"><span class="cell"><span class="rank">?</span><span class="suit">♠</span></span><span class="cell"><span class="rank">?</span><span class="suit">♥</span></span></span>
      </button>
      <span class="sr-only" role="status" aria-live="polite" aria-atomic="true"></span>`;
    const button = shadow.querySelector('button');
    const cells = [...shadow.querySelectorAll('.cell')];
    const status = shadow.querySelector('[role="status"]');
    const paint = (values) => cells.forEach((cell, index) => {
      const suit = Math.floor(Math.random() * 4);
      cell.querySelector('.rank').textContent = ranks[values[index]];
      cell.querySelector('.suit').textContent = suits[suit];
      cell.querySelector('.suit').classList.toggle('red', suit === 1 || suit === 3);
    });
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let busy = false;
    button.addEventListener('click', async () => {
      if (busy) return;
      busy = true;
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      button.dataset.phase = 'rolling';
      cells.forEach((cell) => { delete cell.dataset.winner; });
      status.textContent = '카드를 뽑고 있습니다.';
      try {
        const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduced) {
          for (let frame = 0; frame < 13; frame++) {
            paint(drawRanks());
            await wait(45 + frame * 5);
            if (!this.isConnected) return;
          }
        }
        const values = drawRanks();
        const winner = values[0] > values[1] ? 0 : 1;
        paint(values);
        cells.forEach((cell, index) => { cell.dataset.winner = String(index === winner); });
        button.dataset.phase = 'reveal';
        if (!reduced) await wait(600);
        if (!this.isConnected) return;
        shadow.querySelector('.text').textContent = labels[winner];
        shadow.querySelector('.icon').textContent = icons[winner];
        button.dataset.phase = 'result';
        button.setAttribute('aria-label', `${labels[winner]} 선택됨. 다시 카드로 결정`);
        status.textContent = `왼쪽 ${ranks[values[0]]}, 오른쪽 ${ranks[values[1]]}. ${labels[winner]} 선택!`;
        this.dispatchEvent(new CustomEvent('card-duel-choice', {
          detail: { choice: labels[winner], winner, ranks: values.map((value) => ranks[value]), mode: volume ? 'volume' : 'reaction' },
          bubbles: true, composed: true
        }));
      } finally {
        busy = false;
        button.disabled = false;
        button.removeAttribute('aria-busy');
        if (button.dataset.phase !== 'result') button.dataset.phase = 'idle';
      }
    });
  }
}

if (!customElements.get('card-duel')) customElements.define('card-duel', CardDuel);
