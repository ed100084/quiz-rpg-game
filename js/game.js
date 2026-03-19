// =====================================================
//  勇者大挑戰 — 知識冒險  |  game.js
// =====================================================

// ── 怪物設定 ──────────────────────────────────────────
const MONSTERS = [
  { name: '史萊姆',   emoji: '🟢', maxHp: 60,  attack: 12, reward: 20,  diff: 1 },
  { name: '哥布林',   emoji: '👺', maxHp: 90,  attack: 18, reward: 30,  diff: 1 },
  { name: '骷髏兵',   emoji: '💀', maxHp: 120, attack: 24, reward: 40,  diff: 2 },
  { name: '獸人',     emoji: '👹', maxHp: 160, attack: 32, reward: 55,  diff: 2 },
  { name: '黑暗精靈', emoji: '🧝', maxHp: 200, attack: 38, reward: 70,  diff: 3 },
  { name: '岩石巨人', emoji: '🗿', maxHp: 250, attack: 45, reward: 85,  diff: 3 },
  { name: '巨龍王',   emoji: '🐉', maxHp: 350, attack: 60, reward: 150, diff: 3, isBoss: true },
];

// ── 商店道具 ──────────────────────────────────────────
const SHOP_ITEMS = [
  { id: 'potion',    name: '生命藥水',   icon: '🧪', cost: 30,  desc: '立即恢復 50 點 HP', max: 99 },
  { id: 'sword',     name: '鋼鐵之劍',   icon: '⚔️',  cost: 60,  desc: '永久提升 15 點攻擊力', max: 3 },
  { id: 'shield',    name: '魔法護盾',   icon: '🛡️',  cost: 45,  desc: '下一次受傷免疫（一次性）', max: 3 },
  { id: 'scroll',    name: '時間之書',   icon: '📜',  cost: 40,  desc: '本場答題時間 +10 秒', max: 2 },
  { id: 'elixir',   name: '滿血靈藥',   icon: '💊',  cost: 100, desc: '完全恢復所有 HP', max: 1 },
  { id: 'doubleGold',name: '財富護符',   icon: '🍀',  cost: 80,  desc: '下一場戰鬥金幣獲得翻倍', max: 2 },
];

// ── 成就徽章 ──────────────────────────────────────────
const BADGES = [
  { id: 'first_win',   icon: '⚔️',  name: '初戰告捷',  desc: '贏得第一場戰鬥' },
  { id: 'combo5',      icon: '🔥',  name: '連擊高手',  desc: '達成 5 連擊' },
  { id: 'no_damage',   icon: '🛡️',  name: '無傷過關',  desc: '未受傷通關一場戰鬥' },
  { id: 'boss_slayer', icon: '🐉',  name: '屠龍英雄',  desc: '擊敗巨龍王' },
  { id: 'rich',        icon: '💰',  name: '土豪冒險者', desc: '累積超過 300 枚金幣' },
  { id: 'scholar',     icon: '📚',  name: '學識淵博',  desc: '答對 20 題以上' },
];

// ── 初始遊戲狀態 ──────────────────────────────────────
const INITIAL_STATE = () => ({
  screen: 'start',
  player: {
    maxHp: 100,
    hp: 100,
    attack: 25,
    coins: 0,
    level: 1,
    shielded: false,
    doubleGold: false,
    extraTime: 0,  // 額外答題秒數
    itemsBought: {},  // id -> count
  },
  monster: null,
  question: null,
  category: null,
  combo: 0,
  score: 0,
  battlesWon: 0,
  totalCorrect: 0,
  earnedThisBattle: 0,
  playerHpAtBattleStart: 100,
  timerInterval: null,
  timeLeft: 30,
  answering: false,
  earnedBadges: new Set(),
  questionHistory: [],
  lastBattleNoDamage: false,
});

let G = INITIAL_STATE();

// ── 工具函式 ──────────────────────────────────────────
const $ = id => document.getElementById(id);
const app = () => document.getElementById('app');

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function saveHighScore() {
  const prev = parseInt(localStorage.getItem('hiscore') || '0');
  if (G.score > prev) localStorage.setItem('hiscore', G.score);
}

function getHighScore() {
  return parseInt(localStorage.getItem('hiscore') || '0');
}

// 顯示通知
function notify(msg, type = 'info') {
  let el = document.querySelector('.notification');
  if (!el) {
    el = document.createElement('div');
    el.className = 'notification';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = `notification ${type}`;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 2200);
}

// 獲得徽章
function earnBadge(id) {
  if (G.earnedBadges.has(id)) return;
  G.earnedBadges.add(id);
  const b = BADGES.find(b => b.id === id);
  if (b) notify(`${b.icon} 獲得徽章：${b.name}！`, 'success');
}

// 檢查徽章條件
function checkBadges() {
  if (G.battlesWon >= 1) earnBadge('first_win');
  if (G.combo >= 5) earnBadge('combo5');
  if (G.lastBattleNoDamage) earnBadge('no_damage');
  if (G.player.coins >= 300) earnBadge('rich');
  if (G.totalCorrect >= 20) earnBadge('scholar');
}

// ── HP 顯示 ──────────────────────────────────────────
function hpBarClass(pct) {
  if (pct > 0.5) return '';
  if (pct > 0.25) return 'mid';
  return 'low';
}

// ── 怪物選擇 ──────────────────────────────────────────
function pickMonster(level) {
  // 每 7 關出一次 Boss
  if (level % 7 === 0) return { ...MONSTERS[6], hp: MONSTERS[6].maxHp };
  // 根據關卡難度選怪
  const diff = level <= 2 ? 1 : level <= 5 ? 2 : 3;
  const pool = MONSTERS.filter(m => m.diff === diff && !m.isBoss);
  const m = pool[Math.floor(Math.random() * pool.length)];
  // 怪物 HP 隨關卡成長
  const scale = 1 + (level - 1) * 0.12;
  return { ...m, hp: Math.floor(m.maxHp * scale), maxHp: Math.floor(m.maxHp * scale) };
}

// ── 難度對應 ──────────────────────────────────────────
function levelDifficulty(level) {
  if (level <= 2) return 1;
  if (level <= 5) return 2;
  return 3;
}

// ── 答題時間 ──────────────────────────────────────────
function questionTime() {
  return 30 + G.player.extraTime;
}

// ═══════════════════════════════════════════════════════
//  渲染函式
// ═══════════════════════════════════════════════════════

// ── 開始畫面 ──────────────────────────────────────────
function renderStart() {
  const hi = getHighScore();
  app().innerHTML = `
    <div id="screen-start">
      <div class="hero-emoji">🗡️</div>
      <div class="game-title">勇者大挑戰</div>
      <div class="game-subtitle">知識冒險 RPG</div>

      <div class="start-info">
        <h3>遊戲說明</h3>
        <ul>
          <li><span>⚔️</span>回答問題攻擊怪物</li>
          <li><span>⏱️</span>每題 30 秒答題時間</li>
          <li><span>💰</span>擊敗怪物獲得金幣</li>
          <li><span>🏪</span>每 3 關進入商店購買道具</li>
          <li><span>🔥</span>連續答對可獲得連擊加成</li>
        </ul>
      </div>

      ${hi > 0 ? `<div class="highscore-display">歷史最高分：<b>${hi}</b></div>` : ''}

      <button class="btn btn-primary btn-full" style="max-width:300px" onclick="startGame()">
        ⚔️ 開始冒險
      </button>
    </div>
  `;
}

// ── 戰鬥畫面 ──────────────────────────────────────────
function renderBattle() {
  const { player: p, monster: m, combo } = G;
  const pHpPct = p.hp / p.maxHp;
  const mHpPct = m.hp / m.maxHp;

  app().innerHTML = `
    <div id="screen-battle">

      <!-- Header -->
      <div class="battle-header">
        <div class="header-stat">
          <span class="icon">💰</span>
          <span class="val">${p.coins}</span>
        </div>
        <div class="level-badge">LV ${p.level}</div>
        <div class="header-stat">
          <span class="icon">⭐</span>
          <span class="val">${G.score}</span>
        </div>
      </div>

      <!-- Arena -->
      <div class="battle-arena" id="arena">
        <div class="floor-line"></div>

        <!-- Player -->
        <div class="fighter player" id="fighter-player">
          <div class="hp-bar-wrap">
            <div class="hp-bar ${hpBarClass(pHpPct)}" id="player-hp-bar" style="width:${pHpPct*100}%"></div>
          </div>
          <div class="hp-text" id="player-hp-text">${p.hp} / ${p.maxHp}</div>
          <div class="fighter-sprite" id="player-sprite">🧙</div>
          <div class="fighter-name">勇者${p.shielded ? ' 🛡️' : ''}</div>
        </div>

        <!-- Monster -->
        <div class="fighter monster" id="fighter-monster">
          <div class="hp-bar-wrap">
            <div class="hp-bar ${hpBarClass(mHpPct)}" id="monster-hp-bar" style="width:${mHpPct*100}%"></div>
          </div>
          <div class="hp-text" id="monster-hp-text">${m.hp} / ${m.maxHp}</div>
          <div class="fighter-sprite" id="monster-sprite">${m.emoji}</div>
          <div class="fighter-name">${m.name}${m.isBoss ? ' 👑' : ''}</div>
        </div>
      </div>

      <!-- Combo -->
      <div class="combo-display ${combo < 2 ? 'hidden' : ''}" id="combo-display">
        🔥 ${combo} 連擊！
      </div>

      <!-- Battle Log -->
      <div class="battle-log info" id="battle-log">選擇答案攻擊怪物！</div>

      <!-- Question -->
      <div class="question-box">
        <div class="question-meta">
          <span class="q-category ${CATEGORY_CLASS[G.category]}" id="q-cat">
            ${CATEGORY_NAMES[G.category]}
          </span>
          <div class="q-timer">
            <div class="q-timer-bar">
              <div class="q-timer-fill" id="timer-fill" style="width:100%"></div>
            </div>
            <span class="q-timer-num" id="timer-num">${questionTime()}</span>
          </div>
        </div>
        <div class="question-text" id="question-text">${G.question.q}</div>
        <div class="options-grid" id="options-grid">
          ${G.question.opts.map((opt, i) => `
            <button class="option-btn" data-idx="${i}" onclick="answer(${i})">
              <span class="option-label">${'ABCD'[i]}</span>
              ${opt}
            </button>
          `).join('')}
        </div>
      </div>

    </div>
  `;

  startTimer();
}

// ── 商店畫面 ──────────────────────────────────────────
function renderShop() {
  const { player: p } = G;

  app().innerHTML = `
    <div id="screen-shop">
      <div class="shop-header">
        <h2>🏪 商店</h2>
        <div>第 ${p.level} 關前的補給</div>
        <div class="shop-coins">💰 ${p.coins} 枚金幣</div>
      </div>

      <div class="shop-player-stats">
        <h3>勇者狀態</h3>
        <div class="stat-row"><span>❤️ 生命值</span><span class="stat-val">${p.hp} / ${p.maxHp}</span></div>
        <div class="stat-row"><span>⚔️ 攻擊力</span><span class="stat-val">${p.attack}</span></div>
        <div class="stat-row"><span>🛡️ 護盾</span><span class="stat-val">${p.shielded ? '已激活' : '無'}</span></div>
        <div class="stat-row"><span>🌟 得分</span><span class="stat-val">${G.score}</span></div>
      </div>

      <div class="shop-grid">
        ${SHOP_ITEMS.map(item => {
          const bought = p.itemsBought[item.id] || 0;
          const maxed = bought >= item.max;
          const cantAfford = p.coins < item.cost;
          const disabled = maxed || cantAfford;
          return `
            <div class="shop-item ${disabled ? 'disabled' : ''}" onclick="${disabled ? '' : `buyItem('${item.id}')`}">
              <div class="shop-item-icon">${item.icon}</div>
              <div class="shop-item-name">${item.name}</div>
              <div class="shop-item-desc">${item.desc}</div>
              <div class="shop-item-cost">💰 ${item.cost}
                ${maxed ? '<span style="color:var(--muted);font-size:0.7rem;margin-left:auto">（已達上限）</span>' : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <button class="btn btn-primary btn-full" onclick="continueAfterShop()">
        ⚔️ 繼續冒險 (第 ${p.level} 關)
      </button>
    </div>
  `;
}

// ── 戰鬥結果畫面 ─────────────────────────────────────
function renderResult() {
  const coins = G.earnedThisBattle;
  app().innerHTML = `
    <div id="screen-result">
      <div class="result-emoji">🎉</div>
      <div class="result-title">戰鬥勝利！</div>

      <div class="result-stats">
        <div class="result-stat-row"><span>擊敗怪物</span><span class="rsv">${G.monster.name} ${G.monster.emoji}</span></div>
        <div class="result-stat-row"><span>獲得金幣</span><span class="rsv">💰 ${coins}</span></div>
        <div class="result-stat-row"><span>當前總金幣</span><span class="rsv">💰 ${G.player.coins}</span></div>
        <div class="result-stat-row"><span>累積得分</span><span class="rsv">⭐ ${G.score}</span></div>
        <div class="result-stat-row"><span>已過關數</span><span class="rsv">${G.battlesWon} 關</span></div>
      </div>

      ${G.earnedBadges.size > 0 ? `
        <div class="badges-section">
          <h3>已獲得徽章</h3>
          <div class="badges-grid">
            ${[...G.earnedBadges].map(id => {
              const b = BADGES.find(b => b.id === id);
              return b ? `<div class="badge earned">${b.icon} ${b.name}</div>` : '';
            }).join('')}
          </div>
        </div>
      ` : ''}

      <button class="btn btn-primary" onclick="nextLevel()" style="width:100%;max-width:320px">
        ➡️ 下一關
      </button>
    </div>
  `;
}

// ── 遊戲結束畫面 ─────────────────────────────────────
function renderGameOver() {
  saveHighScore();
  app().innerHTML = `
    <div id="screen-gameover">
      <div class="gameover-emoji">💀</div>
      <div class="gameover-title">GAME OVER</div>
      <p style="color:var(--muted);margin:8px 0">你被 ${G.monster.name} 擊倒了...</p>

      <div class="result-stats">
        <div class="result-stat-row"><span>最終得分</span><span class="rsv">⭐ ${G.score}</span></div>
        <div class="result-stat-row"><span>通關數</span><span class="rsv">${G.battlesWon} 關</span></div>
        <div class="result-stat-row"><span>答對題數</span><span class="rsv">${G.totalCorrect} 題</span></div>
        <div class="result-stat-row"><span>歷史最高分</span><span class="rsv">⭐ ${getHighScore()}</span></div>
      </div>

      ${G.earnedBadges.size > 0 ? `
        <div class="badges-section">
          <h3>本局獲得徽章</h3>
          <div class="badges-grid">
            ${[...G.earnedBadges].map(id => {
              const b = BADGES.find(id2 => id2.id === id);
              return b ? `<div class="badge earned">${b.icon} ${b.name}</div>` : '';
            }).join('')}
          </div>
        </div>
      ` : ''}

      <div style="display:flex;gap:12px;width:100%;max-width:360px">
        <button class="btn btn-primary btn-full" onclick="startGame()">🔄 再玩一次</button>
        <button class="btn btn-secondary btn-full" onclick="renderStart()">🏠 首頁</button>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════
//  遊戲邏輯
// ═══════════════════════════════════════════════════════

function startGame() {
  G = INITIAL_STATE();
  startBattle();
}

function startBattle() {
  clearInterval(G.timerInterval);
  G.monster = pickMonster(G.player.level);
  G.earnedThisBattle = 0;
  G.playerHpAtBattleStart = G.player.hp;
  G.lastBattleNoDamage = true;
  loadNextQuestion();
  renderBattle();
}

function loadNextQuestion() {
  G.category = randomCategory();
  const diff = levelDifficulty(G.player.level);

  // 避免重複出現同一題（最近10題）
  let q, tries = 0;
  do {
    q = getQuestion(G.category, diff);
    tries++;
  } while (G.questionHistory.includes(q.q) && tries < 20);

  G.question = q;
  G.questionHistory = [...G.questionHistory.slice(-9), q.q];
  G.answering = false;
}

// ── 計時器 ───────────────────────────────────────────
function startTimer() {
  clearInterval(G.timerInterval);
  G.timeLeft = questionTime();
  updateTimerUI();

  G.timerInterval = setInterval(() => {
    G.timeLeft--;
    updateTimerUI();
    if (G.timeLeft <= 0) {
      clearInterval(G.timerInterval);
      onTimeout();
    }
  }, 1000);
}

function updateTimerUI() {
  const fill = document.getElementById('timer-fill');
  const num = document.getElementById('timer-num');
  if (!fill || !num) return;
  const pct = (G.timeLeft / questionTime()) * 100;
  fill.style.width = pct + '%';
  num.textContent = G.timeLeft;
  fill.className = 'q-timer-fill' +
    (pct < 30 ? ' danger' : pct < 55 ? ' warning' : '');
}

function onTimeout() {
  if (G.answering) return;
  G.answering = true;
  G.combo = 0;
  setLog('⏰ 時間到！怪物趁機攻擊！', 'bad');
  updateComboUI();
  setTimeout(() => {
    monsterAttacks();
    afterExchange();
  }, 500);
}

// ── 玩家回答 ─────────────────────────────────────────
function answer(idx) {
  if (G.answering) return;
  G.answering = true;
  clearInterval(G.timerInterval);

  // 鎖定所有按鈕
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

  const correct = idx === G.question.ans;

  // 標記正確/錯誤
  document.querySelectorAll('.option-btn').forEach((b, i) => {
    if (i === G.question.ans) b.classList.add('correct');
    else if (i === idx && !correct) b.classList.add('wrong');
  });

  if (correct) {
    G.totalCorrect++;
    G.combo++;
    const comboBonus = G.combo >= 3 ? Math.floor(G.combo * 0.5) : 0;
    const dmg = G.player.attack + comboBonus;
    const msg = G.combo >= 3 ? `✨ 連擊！造成 ${dmg} 傷害！` : `⚔️ 答對！造成 ${dmg} 傷害！`;
    setLog(msg, 'good');
    updateComboUI();
    setTimeout(() => {
      playerAttacks(dmg);
      afterExchange();
    }, 600);
  } else {
    G.combo = 0;
    updateComboUI();
    setLog(`❌ 答錯！${G.monster.name} 發動攻擊！`, 'bad');
    setTimeout(() => {
      monsterAttacks();
      afterExchange();
    }, 600);
  }

  checkBadges();
}

// ── 玩家攻擊怪物 ─────────────────────────────────────
function playerAttacks(dmg) {
  G.monster.hp = Math.max(0, G.monster.hp - dmg);
  // 動畫
  const sprite = document.getElementById('player-sprite');
  const monsterEl = document.getElementById('fighter-monster');
  if (sprite) sprite.classList.add('attack-flash');
  if (monsterEl) monsterEl.classList.add('shake');
  setTimeout(() => {
    if (sprite) sprite.classList.remove('attack-flash');
    if (monsterEl) monsterEl.classList.remove('shake');
  }, 400);
  showDmgPopup(dmg, 'monster-dmg');
  updateMonsterHpUI();
}

// ── 怪物攻擊玩家 ─────────────────────────────────────
function monsterAttacks() {
  if (G.player.shielded) {
    G.player.shielded = false;
    setLog('🛡️ 護盾擋下了攻擊！', 'good');
    return;
  }
  G.lastBattleNoDamage = false;
  const dmg = G.monster.attack;
  G.player.hp = Math.max(0, G.player.hp - dmg);
  const playerEl = document.getElementById('fighter-player');
  if (playerEl) playerEl.classList.add('shake');
  setTimeout(() => { if (playerEl) playerEl.classList.remove('shake'); }, 400);
  showDmgPopup(dmg, 'player-dmg');
  updatePlayerHpUI();
}

// ── 更新 HP 顯示 ─────────────────────────────────────
function updatePlayerHpUI() {
  const bar = document.getElementById('player-hp-bar');
  const txt = document.getElementById('player-hp-text');
  const { hp, maxHp } = G.player;
  if (bar) {
    const pct = hp / maxHp;
    bar.style.width = (pct * 100) + '%';
    bar.className = 'hp-bar ' + hpBarClass(pct);
  }
  if (txt) txt.textContent = `${hp} / ${maxHp}`;
}

function updateMonsterHpUI() {
  const bar = document.getElementById('monster-hp-bar');
  const txt = document.getElementById('monster-hp-text');
  const { hp, maxHp } = G.monster;
  if (bar) {
    const pct = hp / maxHp;
    bar.style.width = (pct * 100) + '%';
    bar.className = 'hp-bar ' + hpBarClass(pct);
  }
  if (txt) txt.textContent = `${hp} / ${maxHp}`;
}

function updateComboUI() {
  const el = document.getElementById('combo-display');
  if (!el) return;
  if (G.combo >= 2) {
    el.textContent = `🔥 ${G.combo} 連擊！`;
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}

// ── 傷害彈出數字 ─────────────────────────────────────
function showDmgPopup(dmg, className) {
  const arena = document.getElementById('arena');
  if (!arena) return;
  const popup = document.createElement('div');
  popup.className = `dmg-popup ${className}`;
  popup.textContent = `-${dmg}`;
  popup.style.left = className === 'monster-dmg' ? '65%' : '15%';
  popup.style.top = '40%';
  arena.appendChild(popup);
  setTimeout(() => popup.remove(), 1200);
}

// ── 戰鬥 log ─────────────────────────────────────────
function setLog(msg, type = 'info') {
  const el = document.getElementById('battle-log');
  if (el) {
    el.textContent = msg;
    el.className = `battle-log ${type}`;
  }
}

// ── 每輪結束後處理 ───────────────────────────────────
function afterExchange() {
  // 怪物死了
  if (G.monster.hp <= 0) {
    clearInterval(G.timerInterval);
    setTimeout(() => onMonsterDead(), 500);
    return;
  }
  // 玩家死了
  if (G.player.hp <= 0) {
    clearInterval(G.timerInterval);
    setTimeout(() => renderGameOver(), 500);
    return;
  }
  // 繼續下一題
  setTimeout(() => {
    loadNextQuestion();
    updateQuestionUI();
    startTimer();
  }, 800);
}

// ── 更新題目 UI（不重新渲染整個畫面）────────────────
function updateQuestionUI() {
  const catEl = document.getElementById('q-cat');
  const qEl = document.getElementById('question-text');
  const grid = document.getElementById('options-grid');
  if (!catEl || !qEl || !grid) return;

  catEl.className = `q-category ${CATEGORY_CLASS[G.category]}`;
  catEl.textContent = CATEGORY_NAMES[G.category];
  qEl.textContent = G.question.q;
  grid.innerHTML = G.question.opts.map((opt, i) => `
    <button class="option-btn" data-idx="${i}" onclick="answer(${i})">
      <span class="option-label">${'ABCD'[i]}</span>
      ${opt}
    </button>
  `).join('');

  setLog('選擇答案攻擊怪物！', 'info');
}

// ── 怪物被擊敗 ───────────────────────────────────────
function onMonsterDead() {
  let coins = G.monster.reward;
  if (G.player.doubleGold) {
    coins *= 2;
    G.player.doubleGold = false;
    notify('🍀 財富護符：金幣雙倍！', 'success');
  }
  G.player.coins += coins;
  G.earnedThisBattle = coins;
  G.score += coins + G.battlesWon * 10;
  G.battlesWon++;
  G.player.level++;

  if (G.monster.isBoss) earnBadge('boss_slayer');
  checkBadges();
  saveHighScore();
  renderResult();
}

// ── 前往下一關 ───────────────────────────────────────
function nextLevel() {
  // 每 3 關進商店
  if (G.battlesWon % 3 === 0) {
    renderShop();
  } else {
    startBattle();
  }
}

// ── 繼續冒險（從商店） ────────────────────────────────
function continueAfterShop() {
  startBattle();
}

// ── 購買道具 ─────────────────────────────────────────
function buyItem(id) {
  const item = SHOP_ITEMS.find(i => i.id === id);
  if (!item) return;

  const bought = G.player.itemsBought[id] || 0;
  if (bought >= item.max) { notify('此道具已達購買上限', 'error'); return; }
  if (G.player.coins < item.cost) { notify('金幣不足！', 'error'); return; }

  G.player.coins -= item.cost;
  G.player.itemsBought[id] = bought + 1;

  switch (id) {
    case 'potion':
      G.player.hp = Math.min(G.player.maxHp, G.player.hp + 50);
      notify('🧪 恢復 50 HP！', 'success');
      break;
    case 'sword':
      G.player.attack += 15;
      notify(`⚔️ 攻擊力提升至 ${G.player.attack}！`, 'success');
      break;
    case 'shield':
      G.player.shielded = true;
      notify('🛡️ 護盾已激活！', 'success');
      break;
    case 'scroll':
      G.player.extraTime += 10;
      notify('📜 答題時間 +10 秒！', 'success');
      break;
    case 'elixir':
      G.player.hp = G.player.maxHp;
      notify('💊 HP 完全恢復！', 'success');
      break;
    case 'doubleGold':
      G.player.doubleGold = true;
      notify('🍀 下一場金幣雙倍！', 'success');
      break;
  }

  checkBadges();
  renderShop();
}

// ── 啟動遊戲 ─────────────────────────────────────────
renderStart();
