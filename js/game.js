// =====================================================
//  勇者大挑戰 — 知識冒險  |  game.js
// =====================================================

const VERSION = 'v1.0.0';

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

// ── 稱號系統 ──────────────────────────────────────────
const TITLES = [
  { minLv: 1,  title: '學徒勇者', icon: '🌱' },
  { minLv: 4,  title: '見習騎士', icon: '⚔️' },
  { minLv: 7,  title: '魔法學徒', icon: '🔮' },
  { minLv: 11, title: '精英戰士', icon: '🌟' },
  { minLv: 16, title: '傳說英雄', icon: '👑' },
];

function getTitle(level) {
  let t = TITLES[0];
  for (const ti of TITLES) { if (level >= ti.minLv) t = ti; }
  return t;
}

// ── 角色外觀 ──────────────────────────────────────────
const SKINS = [
  { id: 'mage',   emoji: '🧙', name: '法師',     unlock: '預設解鎖' },
  { id: 'knight', emoji: '🛡️', name: '騎士',     unlock: '達到等級 5' },
  { id: 'archer', emoji: '🏹', name: '弓手',     unlock: '擊敗 10 隻怪物' },
  { id: 'elf',    emoji: '🧝', name: '精靈',     unlock: '獲得「無傷過關」徽章' },
  { id: 'dark',   emoji: '🧟', name: '暗黑英雄', unlock: '擊敗巨龍王' },
];

function isSkinUnlocked(skinId, stats) {
  switch (skinId) {
    case 'mage':   return true;
    case 'knight': return stats.maxLevel >= 5;
    case 'archer': return stats.totalKills >= 10;
    case 'elf':    return stats.earnedBadges.has('no_damage');
    case 'dark':   return stats.earnedBadges.has('boss_slayer');
    default:       return false;
  }
}

// ── 商店道具 ──────────────────────────────────────────
const SHOP_ITEMS = [
  { id: 'potion',     name: '生命藥水',   icon: '🧪', cost: 30,  desc: '立即恢復 50 點 HP', max: 99 },
  { id: 'sword',      name: '鋼鐵之劍',   icon: '⚔️',  cost: 60,  desc: '永久提升 15 點攻擊力', max: 3 },
  { id: 'shield',     name: '魔法護盾',   icon: '🛡️',  cost: 45,  desc: '下一次受傷免疫（一次性）', max: 3 },
  { id: 'scroll',     name: '時間之書',   icon: '📜',  cost: 40,  desc: '本場答題時間 +10 秒', max: 2 },
  { id: 'elixir',     name: '滿血靈藥',   icon: '💊',  cost: 100, desc: '完全恢復所有 HP', max: 1 },
  { id: 'doubleGold', name: '財富護符',   icon: '🍀',  cost: 80,  desc: '下一場戰鬥金幣獲得翻倍', max: 2 },
];

// ── 成就徽章 ──────────────────────────────────────────
const BADGES = [
  { id: 'first_win',    icon: '⚔️',  name: '初戰告捷',  desc: '贏得第一場戰鬥' },
  { id: 'combo5',       icon: '🔥',  name: '連擊高手',  desc: '達成 5 連擊' },
  { id: 'combo10',      icon: '💥',  name: '狂熱者',    desc: '達成 10 連擊' },
  { id: 'no_damage',    icon: '🛡️',  name: '無傷過關',  desc: '未受傷通關一場戰鬥' },
  { id: 'boss_slayer',  icon: '🐉',  name: '屠龍英雄',  desc: '擊敗巨龍王' },
  { id: 'rich',         icon: '💰',  name: '土豪冒險者', desc: '累積超過 300 枚金幣' },
  { id: 'scholar',      icon: '📚',  name: '學識淵博',  desc: '答對 20 題以上' },
  { id: 'perfect10',    icon: '🎯',  name: '完美答題',  desc: '連續答對 10 題' },
  { id: 'conqueror10',  icon: '🏆',  name: '關卡征服者', desc: '通過 10 關' },
  { id: 'lightning',    icon: '⚡',  name: '閃電答題',  desc: '5 秒內答對一題' },
  { id: 'all_subjects', icon: '🎓',  name: '全科學者',  desc: '五科各答對一題' },
  { id: 'night_owl',    icon: '🌙',  name: '夜行者',    desc: '下午 6 點後遊玩' },
  { id: 'killer20',     icon: '🔟',  name: '屠殺者',    desc: '擊敗 20 隻怪物' },
  { id: 'chinese_pro',  icon: '📖',  name: '國文達人',  desc: '答對 10 題國文' },
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
    skin: 'mage',
    shielded: false,
    doubleGold: false,
    extraTime: 0,
    itemsBought: {},
  },
  monster: null,
  question: null,
  category: null,
  combo: 0,
  score: 0,
  battlesWon: 0,
  totalCorrect: 0,
  totalKills: 0,
  earnedThisBattle: 0,
  playerHpAtBattleStart: 100,
  timerInterval: null,
  timeLeft: 30,
  answering: false,
  earnedBadges: new Set(),
  questionHistory: [],
  lastBattleNoDamage: false,
  maxLevel: 1,
  subjectsAnswered: new Set(),
  chineseCorrect: 0,
  questionStartTime: null,
});

let G = INITIAL_STATE();

// ── 永久統計（跨局存 localStorage） ──────────────────
function loadPersistentStats() {
  try {
    return JSON.parse(localStorage.getItem('persistentStats') || '{}');
  } catch { return {}; }
}
function savePersistentStats(stats) {
  localStorage.setItem('persistentStats', JSON.stringify(stats));
}

// ── 工具函式 ──────────────────────────────────────────
const app = () => document.getElementById('app');

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

function saveHighScore() {
  const prev = parseInt(localStorage.getItem('hiscore') || '0');
  if (G.score > prev) localStorage.setItem('hiscore', G.score);
}

function getHighScore() {
  return parseInt(localStorage.getItem('hiscore') || '0');
}

function getPlayerName() {
  return localStorage.getItem('playerName') || '';
}

function setPlayerName(name) {
  localStorage.setItem('playerName', name.trim());
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
  if (G.battlesWon >= 1)      earnBadge('first_win');
  if (G.combo >= 5)            earnBadge('combo5');
  if (G.combo >= 10)           earnBadge('combo10');
  if (G.combo >= 10)           earnBadge('perfect10');
  if (G.lastBattleNoDamage)    earnBadge('no_damage');
  if (G.player.coins >= 300)   earnBadge('rich');
  if (G.totalCorrect >= 20)    earnBadge('scholar');
  if (G.battlesWon >= 10)      earnBadge('conqueror10');
  if (G.totalKills >= 20)      earnBadge('killer20');
  if (G.chineseCorrect >= 10)  earnBadge('chinese_pro');
  if (G.subjectsAnswered.size >= 5) earnBadge('all_subjects');
  const hour = new Date().getHours();
  if (hour >= 18)              earnBadge('night_owl');
}

// ── HP 顯示 ──────────────────────────────────────────
function hpBarClass(pct) {
  if (pct > 0.5) return '';
  if (pct > 0.25) return 'mid';
  return 'low';
}

// ── 怪物選擇 ──────────────────────────────────────────
function pickMonster(level) {
  if (level % 7 === 0) return { ...MONSTERS[6], hp: MONSTERS[6].maxHp };
  const diff = level <= 2 ? 1 : level <= 5 ? 2 : 3;
  const pool = MONSTERS.filter(m => m.diff === diff && !m.isBoss);
  const m = pool[Math.floor(Math.random() * pool.length)];
  const scale = 1 + (level - 1) * 0.12;
  return { ...m, hp: Math.floor(m.maxHp * scale), maxHp: Math.floor(m.maxHp * scale) };
}

function levelDifficulty(level) {
  if (level <= 2) return 1;
  if (level <= 5) return 2;
  return 3;
}

function questionTime() { return 30 + G.player.extraTime; }

function currentSkinEmoji() {
  const skin = SKINS.find(s => s.id === G.player.skin) || SKINS[0];
  return skin.emoji;
}

// ── 每日簽到 ──────────────────────────────────────────
function checkDailyBonus() {
  const today = new Date().toDateString();
  const lastLogin = localStorage.getItem('lastLogin') || '';
  const streak = parseInt(localStorage.getItem('loginStreak') || '0');
  if (lastLogin === today) return;

  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const newStreak = lastLogin === yesterday ? streak + 1 : 1;
  localStorage.setItem('lastLogin', today);
  localStorage.setItem('loginStreak', newStreak);

  let bonus = 20;
  let msg = `每日簽到！獲得 💰 ${bonus} 金幣`;
  if (newStreak >= 7) { bonus = 150; msg = `🎉 連續簽到 ${newStreak} 天！獲得 💰 ${bonus} 金幣！`; }
  else if (newStreak >= 3) { bonus = 50; msg = `🔥 連續簽到 ${newStreak} 天！獲得 💰 ${bonus} 金幣！`; }

  // 存起來讓開始畫面顯示
  localStorage.setItem('pendingBonus', JSON.stringify({ bonus, msg, streak: newStreak }));
}

function claimDailyBonus() {
  const pending = JSON.parse(localStorage.getItem('pendingBonus') || 'null');
  if (!pending) return;
  G.player.coins += pending.bonus;
  localStorage.removeItem('pendingBonus');
  notify(pending.msg, 'success');
  renderStart();
}

// ── 排行榜（本地 Top 5） ──────────────────────────────
function saveScoreLocally(name, score) {
  let board = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  board.push({ name: name || '無名英雄', score, date: new Date().toLocaleDateString() });
  board.sort((a, b) => b.score - a.score);
  board = board.slice(0, 10);
  localStorage.setItem('leaderboard', JSON.stringify(board));
  return board;
}

function getLocalLeaderboard() {
  return JSON.parse(localStorage.getItem('leaderboard') || '[]');
}

// Firebase 提交分數（若已設定）
async function submitToFirebase(name, score) {
  try {
    if (typeof firebase === 'undefined' || !firebase.apps.length) return;
    const db = firebase.firestore();
    await db.collection('scores').add({
      name: name || '無名英雄',
      score,
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (e) { /* Firebase 未設定時靜默失敗 */ }
}

async function loadFirebaseLeaderboard() {
  try {
    if (typeof firebase === 'undefined' || !firebase.apps.length) return null;
    const db = firebase.firestore();
    const snap = await db.collection('scores').orderBy('score', 'desc').limit(10).get();
    return snap.docs.map(d => ({ ...d.data(), date: d.data().date?.toDate?.()?.toLocaleDateString() || '' }));
  } catch (e) { return null; }
}

// ═══════════════════════════════════════════════════════
//  渲染函式
// ═══════════════════════════════════════════════════════

// ── 開始畫面 ──────────────────────────────────────────
function renderStart() {
  const pending = JSON.parse(localStorage.getItem('pendingBonus') || 'null');
  const streak  = parseInt(localStorage.getItem('loginStreak') || '0');
  const localBoard = getLocalLeaderboard();

  app().innerHTML = `
    <div id="screen-start">
      <div class="hero-emoji">🗡️</div>
      <div class="game-title">勇者大挑戰</div>
      <div class="game-subtitle">知識冒險 RPG</div>
      <div class="version-badge">${VERSION}</div>

      ${pending ? `
        <div class="daily-bonus-banner" onclick="claimDailyBonus()">
          <div class="daily-bonus-icon">🎁</div>
          <div>
            <div class="daily-bonus-title">每日簽到獎勵！</div>
            <div class="daily-bonus-sub">點擊領取 💰 ${pending.bonus} 金幣（連續 ${pending.streak} 天）</div>
          </div>
        </div>
      ` : streak > 0 ? `<div class="streak-info">🔥 已連續簽到 ${streak} 天</div>` : ''}

      <!-- 高分排行榜 -->
      <div class="start-leaderboard">
        <div class="start-lb-title">🏆 高分排行榜</div>
        <div id="lb-content">
          ${renderBoardRows(localBoard)}
          <div class="lb-loading">🌐 載入全球排行中...</div>
        </div>
      </div>

      <button class="btn btn-primary btn-full" style="max-width:320px" onclick="startGame()">
        ⚔️ 開始冒險
      </button>
    </div>
  `;

  // 非同步載入 Firebase 排行榜，載入後更新
  loadFirebaseLeaderboard().then(fireBoard => {
    const el = document.getElementById('lb-content');
    if (!el) return; // 使用者已離開此頁面
    if (fireBoard !== null) {
      // Firebase 成功回傳（即使是空的），顯示全球排行
      el.innerHTML = renderBoardRows(fireBoard) +
        '<div class="lb-source">🌐 全球排行</div>';
    } else {
      // Firebase 失敗（未設定或網路錯誤），降級顯示本地紀錄
      el.innerHTML = renderBoardRows(localBoard) +
        '<div class="lb-source">💾 本地紀錄</div>';
    }
  });
}

function renderBoardRows(board) {
  if (!board || board.length === 0) {
    return '<div class="lb-empty">還沒有紀錄，快去挑戰！</div>';
  }
  return board.slice(0, 5).map((e, i) => `
    <div class="lb-row ${['gold','silver','bronze'][i] || ''}">
      <span class="lb-rank">${['🥇','🥈','🥉'][i] || `#${i+1}`}</span>
      <span class="lb-name">${e.name}</span>
      <span class="lb-score">⭐ ${e.score}</span>
      ${e.date ? `<span class="lb-date">${e.date}</span>` : ''}
    </div>`).join('');
}
    </div>
  `;
}

// ── 排行榜畫面 ────────────────────────────────────────
async function renderLeaderboard() {
  app().innerHTML = `
    <div id="screen-leaderboard">
      <div style="text-align:center;padding:40px">
        <div style="font-size:2rem;margin-bottom:12px">🏆</div>
        <div style="color:var(--muted)">載入中...</div>
      </div>
    </div>
  `;

  const fireboardData = await loadFirebaseLeaderboard();
  const localBoard = getLocalLeaderboard();
  const board = fireboardData || localBoard;
  const isOnline = !!fireboardData;

  app().innerHTML = `
    <div id="screen-leaderboard">
      <div style="text-align:center;padding-top:24px;padding-bottom:8px">
        <div style="font-size:2.5rem">🏆</div>
        <div style="font-family:'Press Start 2P',monospace;font-size:0.7rem;color:var(--accent);margin:8px 0">
          排行榜
        </div>
        <div style="font-size:0.75rem;color:var(--muted)">
          ${isOnline ? '🌐 全球排行' : '💾 本地紀錄'}
        </div>
      </div>

      <div class="leaderboard-list">
        ${board.length === 0 ? '<div class="lb-empty">還沒有紀錄，快去挑戰！</div>' :
          board.map((entry, i) => `
            <div class="lb-row ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}">
              <span class="lb-rank">${['🥇','🥈','🥉'][i] || `#${i+1}`}</span>
              <span class="lb-name">${entry.name}</span>
              <span class="lb-score">⭐ ${entry.score}</span>
            </div>
          `).join('')}
      </div>

      <button class="btn btn-secondary btn-full" onclick="renderStart()" style="margin:16px">← 返回</button>
    </div>
  `;
}

// ── 戰鬥畫面 ──────────────────────────────────────────
function renderBattle() {
  const { player: p, monster: m, combo } = G;
  const pHpPct = p.hp / p.maxHp;
  const mHpPct = m.hp / m.maxHp;
  const titleInfo = getTitle(p.level);

  app().innerHTML = `
    <div id="screen-battle">

      <!-- Header -->
      <div class="battle-header">
        <div class="header-stat">
          <span class="icon">💰</span>
          <span class="val">${p.coins}</span>
        </div>
        <div style="text-align:center">
          <div class="level-badge">LV ${p.level}</div>
          <div class="title-badge">${titleInfo.icon} ${titleInfo.title}</div>
        </div>
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
          <div class="fighter-sprite" id="player-sprite">${currentSkinEmoji()}</div>
          <div class="fighter-name">${getPlayerName() || '勇者'}${p.shielded ? ' 🛡️' : ''}</div>
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
  const stats = { maxLevel: G.maxLevel, totalKills: G.totalKills, earnedBadges: G.earnedBadges };

  app().innerHTML = `
    <div id="screen-shop">
      <div class="shop-header">
        <h2>🏪 商店</h2>
        <div>第 ${p.level} 關前的補給</div>
        <div class="shop-coins">💰 ${p.coins} 枚金幣</div>
      </div>

      <!-- Tabs -->
      <div class="shop-tabs">
        <button class="shop-tab active" id="tab-items" onclick="switchShopTab('items')">道具</button>
        <button class="shop-tab" id="tab-skins" onclick="switchShopTab('skins')">外觀</button>
      </div>

      <!-- Items Tab -->
      <div id="shop-tab-items">
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
                  ${maxed ? '<span style="color:var(--muted);font-size:0.7rem;margin-left:auto">已達上限</span>' : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Skins Tab -->
      <div id="shop-tab-skins" style="display:none">
        <div class="shop-grid">
          ${SKINS.map(skin => {
            const unlocked = isSkinUnlocked(skin.id, stats);
            const active = p.skin === skin.id;
            return `
              <div class="shop-item skin-item ${!unlocked ? 'disabled' : ''} ${active ? 'purchased' : ''}"
                onclick="${unlocked && !active ? `selectSkin('${skin.id}')` : ''}">
                <div class="shop-item-icon">${skin.emoji}</div>
                <div class="shop-item-name">${skin.name}</div>
                <div class="shop-item-desc">${unlocked ? (active ? '✅ 使用中' : '已解鎖') : `🔒 ${skin.unlock}`}</div>
                <div class="shop-item-cost" style="color:${active ? 'var(--green)' : unlocked ? 'var(--accent)' : 'var(--muted)'}">
                  ${active ? '當前角色' : unlocked ? '點擊選擇' : '尚未解鎖'}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="shop-player-stats">
        <h3>勇者狀態</h3>
        <div class="stat-row"><span>❤️ 生命值</span><span class="stat-val">${p.hp} / ${p.maxHp}</span></div>
        <div class="stat-row"><span>⚔️ 攻擊力</span><span class="stat-val">${p.attack}</span></div>
        <div class="stat-row"><span>🛡️ 護盾</span><span class="stat-val">${p.shielded ? '已激活' : '無'}</span></div>
        <div class="stat-row"><span>🌟 得分</span><span class="stat-val">${G.score}</span></div>
      </div>

      <button class="btn btn-primary btn-full" onclick="continueAfterShop()">
        ⚔️ 繼續冒險 (第 ${p.level} 關)
      </button>
    </div>
  `;
}

function switchShopTab(tab) {
  document.getElementById('shop-tab-items').style.display = tab === 'items' ? '' : 'none';
  document.getElementById('shop-tab-skins').style.display = tab === 'skins' ? '' : 'none';
  document.getElementById('tab-items').classList.toggle('active', tab === 'items');
  document.getElementById('tab-skins').classList.toggle('active', tab === 'skins');
}

function selectSkin(skinId) {
  G.player.skin = skinId;
  const skin = SKINS.find(s => s.id === skinId);
  notify(`✨ 已切換為 ${skin.name}！`, 'success');
  renderShop();
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
async function renderGameOver() {
  saveHighScore();
  const name = getPlayerName();
  const board = saveScoreLocally(name, G.score);
  submitToFirebase(name, G.score); // 非同步，靜默

  const myRank = board.findIndex(e => e.name === (name || '無名英雄') && e.score === G.score) + 1;

  app().innerHTML = `
    <div id="screen-gameover">
      <div class="gameover-emoji">💀</div>
      <div class="gameover-title">GAME OVER</div>
      <p style="color:var(--muted);margin:8px 0">你被 ${G.monster.name} 擊倒了...</p>
      ${myRank > 0 ? `<p style="color:var(--accent);font-weight:700">🏆 本局排名：#${myRank}</p>` : ''}

      <div class="result-stats">
        <div class="result-stat-row"><span>最終得分</span><span class="rsv">⭐ ${G.score}</span></div>
        <div class="result-stat-row"><span>通關數</span><span class="rsv">${G.battlesWon} 關</span></div>
        <div class="result-stat-row"><span>答對題數</span><span class="rsv">${G.totalCorrect} 題</span></div>
        <div class="result-stat-row"><span>擊敗怪物</span><span class="rsv">${G.totalKills} 隻</span></div>
        <div class="result-stat-row"><span>歷史最高分</span><span class="rsv">⭐ ${getHighScore()}</span></div>
      </div>

      <!-- 本地排行榜 -->
      <div class="leaderboard-list" style="width:100%;max-width:360px">
        <div style="font-size:0.8rem;color:var(--muted);margin-bottom:8px;text-align:center">💾 本地排行榜 Top 5</div>
        ${board.slice(0, 5).map((entry, i) => `
          <div class="lb-row ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}
            ${entry.score === G.score && entry.name === (name||'無名英雄') ? 'current-player' : ''}">
            <span class="lb-rank">${['🥇','🥈','🥉'][i] || `#${i+1}`}</span>
            <span class="lb-name">${entry.name}</span>
            <span class="lb-score">⭐ ${entry.score}</span>
          </div>
        `).join('')}
      </div>

      ${G.earnedBadges.size > 0 ? `
        <div class="badges-section" style="max-width:360px">
          <h3>本局獲得徽章</h3>
          <div class="badges-grid">
            ${[...G.earnedBadges].map(id => {
              const b = BADGES.find(b => b.id === id);
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
  // 保留名字輸入框的值（不影響 localStorage）
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

  let q, tries = 0;
  do {
    q = getQuestion(G.category, diff);
    tries++;
  } while (G.questionHistory.includes(q.q) && tries < 20);

  G.question = q;
  G.questionHistory = [...G.questionHistory.slice(-9), q.q];
  G.answering = false;
  G.questionStartTime = Date.now();
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

  const elapsed = (Date.now() - G.questionStartTime) / 1000;

  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

  const correct = idx === G.question.ans;

  document.querySelectorAll('.option-btn').forEach((b, i) => {
    if (i === G.question.ans) b.classList.add('correct');
    else if (i === idx && !correct) b.classList.add('wrong');
  });

  if (correct) {
    G.totalCorrect++;
    G.combo++;
    G.subjectsAnswered.add(G.category);
    if (G.category === 'chinese') G.chineseCorrect++;
    if (elapsed <= 5) earnBadge('lightning');

    const comboBonus = G.combo >= 3 ? Math.floor(G.combo * 0.5) : 0;
    const dmg = G.player.attack + comboBonus;
    const msg = G.combo >= 3 ? `✨ ${G.combo}連擊！造成 ${dmg} 傷害！` : `⚔️ 答對！造成 ${dmg} 傷害！`;
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

function updatePlayerHpUI() {
  const bar = document.getElementById('player-hp-bar');
  const txt = document.getElementById('player-hp-text');
  const { hp, maxHp } = G.player;
  if (bar) { const pct = hp / maxHp; bar.style.width = (pct * 100) + '%'; bar.className = 'hp-bar ' + hpBarClass(pct); }
  if (txt) txt.textContent = `${hp} / ${maxHp}`;
}

function updateMonsterHpUI() {
  const bar = document.getElementById('monster-hp-bar');
  const txt = document.getElementById('monster-hp-text');
  const { hp, maxHp } = G.monster;
  if (bar) { const pct = hp / maxHp; bar.style.width = (pct * 100) + '%'; bar.className = 'hp-bar ' + hpBarClass(pct); }
  if (txt) txt.textContent = `${hp} / ${maxHp}`;
}

function updateComboUI() {
  const el = document.getElementById('combo-display');
  if (!el) return;
  if (G.combo >= 2) { el.textContent = `🔥 ${G.combo} 連擊！`; el.classList.remove('hidden'); }
  else { el.classList.add('hidden'); }
}

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

function setLog(msg, type = 'info') {
  const el = document.getElementById('battle-log');
  if (el) { el.textContent = msg; el.className = `battle-log ${type}`; }
}

function afterExchange() {
  if (G.monster.hp <= 0) {
    clearInterval(G.timerInterval);
    setTimeout(() => onMonsterDead(), 500);
    return;
  }
  if (G.player.hp <= 0) {
    clearInterval(G.timerInterval);
    setTimeout(() => renderGameOver(), 500);
    return;
  }
  setTimeout(() => {
    loadNextQuestion();
    updateQuestionUI();
    startTimer();
  }, 800);
}

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
  G.totalKills++;
  G.player.level++;
  G.maxLevel = Math.max(G.maxLevel, G.player.level);

  if (G.monster.isBoss) earnBadge('boss_slayer');
  checkBadges();
  saveHighScore();
  renderResult();
}

function nextLevel() {
  if (G.battlesWon % 3 === 0) renderShop();
  else startBattle();
}

function continueAfterShop() { startBattle(); }

function buyItem(id) {
  const item = SHOP_ITEMS.find(i => i.id === id);
  if (!item) return;
  const bought = G.player.itemsBought[id] || 0;
  if (bought >= item.max) { notify('此道具已達購買上限', 'error'); return; }
  if (G.player.coins < item.cost) { notify('金幣不足！', 'error'); return; }

  G.player.coins -= item.cost;
  G.player.itemsBought[id] = bought + 1;

  switch (id) {
    case 'potion':     G.player.hp = Math.min(G.player.maxHp, G.player.hp + 50); notify('🧪 恢復 50 HP！', 'success'); break;
    case 'sword':      G.player.attack += 15; notify(`⚔️ 攻擊力提升至 ${G.player.attack}！`, 'success'); break;
    case 'shield':     G.player.shielded = true; notify('🛡️ 護盾已激活！', 'success'); break;
    case 'scroll':     G.player.extraTime += 10; notify('📜 答題時間 +10 秒！', 'success'); break;
    case 'elixir':     G.player.hp = G.player.maxHp; notify('💊 HP 完全恢復！', 'success'); break;
    case 'doubleGold': G.player.doubleGold = true; notify('🍀 下一場金幣雙倍！', 'success'); break;
  }

  checkBadges();
  renderShop();
}

// ── 啟動 ─────────────────────────────────────────────
checkDailyBonus();
renderStart();
