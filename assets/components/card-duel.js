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
    const labels = volume ? ['Up', 'Down'] : ['Like', 'Dislike'];
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host { display:inline-block; vertical-align:middle; }
        * { box-sizing:border-box; }
        button { position:relative; display:inline-flex; align-items:center; justify-content:center; width:132px; height:38px; padding:0 14px; border:1px solid var(--line,#deded9); border-radius:7px; background:var(--bg,#fff); color:var(--text,#171717); font:500 14px/1 "Geist Variable","Pretendard Variable",sans-serif; cursor:pointer; box-shadow:0 1px 2px #00000006; transition:background .15s; }
        button:hover:not(:disabled) { background:var(--soft,#f4f4f4); }
        button:focus-visible { outline:2px solid currentColor; outline-offset:4px; }
        button:disabled { cursor:wait; }
        .label { display:flex; align-items:center; gap:8px; }
        .cards { display:none; position:absolute; inset:0; grid-template-columns:1fr 1fr; overflow:hidden; border-radius:6px; }
        .cell { display:block; position:relative; overflow:hidden; font-size:17px; font-weight:400; }
        .reel { display:block; will-change:transform; }
        .face { height:var(--reel-height,36px); display:flex; align-items:center; justify-content:center; gap:5px; }
        .rank { font-family:var(--font-mono,"Monoplex KR",monospace); }
        .cell + .cell { border-left:1px solid var(--line,#ddd); }
        .suit { font-size:12px; } .red { color:#c44444; }
        button[data-phase="rolling"] .label,button[data-phase="reveal"] .label { visibility:hidden; }
        button[data-phase="rolling"] .cards,button[data-phase="reveal"] .cards { display:grid; }
        .cell[data-winner="true"] { background:var(--text,#171717); color:var(--bg,#fff); }
        .cell[data-winner="true"] .red { color:inherit; }
        .cell[data-winner="false"] { opacity:.4; }
        .sr-only { position:absolute; width:1px; height:1px; overflow:hidden; clip-path:inset(50%); white-space:nowrap; }
        @media(prefers-reduced-motion:reduce) { *,*::before,*::after { animation:none!important; transition:none!important; } }
      </style>
      <button type="button" data-phase="idle">
        <span class="label"><span class="text">${initial}</span></span>
        <span class="cards" aria-hidden="true"><span class="cell"></span><span class="cell"></span></span>
      </button>
      <span class="sr-only" role="status" aria-live="polite" aria-atomic="true"></span>`;
    const button = shadow.querySelector('button');
    const cells = [...shadow.querySelectorAll('.cell')];
    const status = shadow.querySelector('[role="status"]');
    const face = (rank) => {
      const suit = Math.floor(Math.random() * 4);
      return `<span class="face"><span class="rank">${ranks[rank]}</span><span class="suit${suit === 1 || suit === 3 ? ' red' : ''}">${suits[suit]}</span></span>`;
    };
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let resetTimer;
    this.clearResultTimer = () => clearTimeout(resetTimer);
    let busy = false;
    button.addEventListener('click', async () => {
      if (busy) return;
      busy = true;
      clearTimeout(resetTimer);
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      button.dataset.phase = 'rolling';
      cells.forEach((cell) => { delete cell.dataset.winner; });
      status.textContent = '카드를 뽑고 있습니다.';
      try {
        const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const values = drawRanks();
        const winner = values[0] > values[1] ? 0 : 1;
        await Promise.all(cells.map(async (cell, index) => {
          cell.style.setProperty('--reel-height', `${button.clientHeight}px`);
          if (reduced) { cell.innerHTML = face(values[index]); return; }
          const faces = Array.from({ length:22 }, () => face(Math.floor(Math.random() * 13)));
          faces.push(face(values[index]));
          cell.innerHTML = `<span class="reel">${faces.join('')}</span>`;
          const reel = cell.querySelector('.reel');
          await reel.animate([
            { transform:'translateY(0)' },
            { transform:`translateY(-${22 * button.clientHeight}px)` }
          ], { duration:1500 + index * 400, easing:'cubic-bezier(0.16, 1, 0.3, 1)', fill:'forwards' }).finished;
        }));
        if (!this.isConnected) return;
        cells.forEach((cell, index) => { cell.dataset.winner = String(index === winner); });
        button.dataset.phase = 'reveal';
        if (!reduced) await wait(600);
        if (!this.isConnected) return;
        shadow.querySelector('.text').textContent = labels[winner];
        button.dataset.phase = 'result';
        button.setAttribute('aria-label', `${labels[winner]} 선택됨. 다시 카드로 결정`);
        status.textContent = `왼쪽 ${ranks[values[0]]}, 오른쪽 ${ranks[values[1]]}. ${labels[winner]} 선택!`;
        this.dispatchEvent(new CustomEvent('card-duel-choice', {
          detail: { choice: labels[winner], winner, ranks: values.map((value) => ranks[value]), mode: volume ? 'volume' : 'reaction' },
          bubbles: true, composed: true
        }));
        resetTimer = setTimeout(() => {
          if (!this.isConnected || busy) return;
          shadow.querySelector('.text').textContent = initial;
          button.dataset.phase = 'idle';
          button.removeAttribute('aria-label');
        }, 1800);
      } finally {
        busy = false;
        button.disabled = false;
        button.removeAttribute('aria-busy');
        if (button.dataset.phase !== 'result') button.dataset.phase = 'idle';
      }
    });
  }
  disconnectedCallback() { this.clearResultTimer?.(); }
}

if (!customElements.get('card-duel')) customElements.define('card-duel', CardDuel);
