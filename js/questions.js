// 題庫 — 各科目、各難度
// difficulty: 1=簡單, 2=中等, 3=困難

const QUESTIONS = {
  math: [
    // 簡單
    { q: "2 + 3 × 4 = ?", opts: ["20", "14", "24", "10"], ans: 1, diff: 1 },
    { q: "36 ÷ 6 + 5 = ?", opts: ["11", "10", "12", "9"], ans: 0, diff: 1 },
    { q: "下列哪個是質數？", opts: ["9", "15", "17", "21"], ans: 2, diff: 1 },
    { q: "三角形內角和為多少度？", opts: ["90°", "180°", "270°", "360°"], ans: 1, diff: 1 },
    { q: "5² = ?", opts: ["10", "15", "25", "50"], ans: 2, diff: 1 },
    { q: "一個正方形邊長為6，面積是多少？", opts: ["12", "24", "36", "48"], ans: 2, diff: 1 },
    { q: "|-8| = ?", opts: ["-8", "0", "8", "64"], ans: 2, diff: 1 },
    { q: "0.5 × 0.5 = ?", opts: ["0.1", "0.25", "1", "2.5"], ans: 1, diff: 1 },
    // 中等
    { q: "√144 = ?", opts: ["11", "12", "13", "14"], ans: 1, diff: 2 },
    { q: "3x - 7 = 14，x = ?", opts: ["5", "6", "7", "8"], ans: 2, diff: 2 },
    { q: "等差數列 2, 5, 8, 11...，第10項是？", opts: ["28", "29", "30", "31"], ans: 1, diff: 2 },
    { q: "圓周率 π ≈ ?", opts: ["3.14", "3.41", "3.12", "3.21"], ans: 0, diff: 2 },
    { q: "一個圓半徑為 5，面積是？（π=3.14）", opts: ["31.4", "62.8", "78.5", "157"], ans: 2, diff: 2 },
    { q: "2³ + 3² = ?", opts: ["13", "17", "25", "35"], ans: 1, diff: 2 },
    { q: "x² = 25 時，x 的正數解為？", opts: ["4", "5", "6", "7"], ans: 1, diff: 2 },
    // 困難
    { q: "若 f(x)=2x²-3x+1，f(2)=？", opts: ["1", "2", "3", "4"], ans: 2, diff: 3 },
    { q: "1 + 2 + 3 + ... + 100 = ?", opts: ["4950", "5000", "5050", "5100"], ans: 2, diff: 3 },
    { q: "直角三角形兩股為 3、4，斜邊為？", opts: ["4", "5", "6", "7"], ans: 1, diff: 3 },
    { q: "(a+b)²展開等於？", opts: ["a²+b²", "a²+ab+b²", "a²+2ab+b²", "2a²+2b²"], ans: 2, diff: 3 },
  ],

  english: [
    // 簡單
    { q: "Which word means 'fast'?", opts: ["Slow", "Quick", "Quiet", "Dark"], ans: 1, diff: 1 },
    { q: "「圖書館」的英文是？", opts: ["Library", "Laundry", "Lottery", "Laboratory"], ans: 0, diff: 1 },
    { q: "He ___ to school every day.", opts: ["go", "goes", "going", "gone"], ans: 1, diff: 1 },
    { q: "「beautiful」的中文意思是？", opts: ["美麗的", "快樂的", "聰明的", "強壯的"], ans: 0, diff: 1 },
    { q: "Which is a vegetable?", opts: ["Apple", "Banana", "Carrot", "Grape"], ans: 2, diff: 1 },
    { q: "「telephone」的中文是？", opts: ["電視", "電話", "電腦", "電燈"], ans: 1, diff: 1 },
    { q: "12 months = 1 ___", opts: ["Week", "Day", "Year", "Century"], ans: 2, diff: 1 },
    // 中等
    { q: "She ___ studying when I called.", opts: ["is", "was", "were", "be"], ans: 1, diff: 2 },
    { q: "The opposite of 'difficult' is?", opts: ["Hard", "Tough", "Easy", "Complex"], ans: 2, diff: 2 },
    { q: "I have lived here ___ 5 years.", opts: ["since", "for", "ago", "before"], ans: 1, diff: 2 },
    { q: "Which is NOT a pronoun?", opts: ["He", "She", "Run", "They"], ans: 2, diff: 2 },
    { q: "「approximately」的中文意思是？", opts: ["絕對地", "大約地", "偶爾地", "永遠地"], ans: 1, diff: 2 },
    // 困難
    { q: "If I ___ rich, I would travel the world.", opts: ["am", "was", "were", "be"], ans: 2, diff: 3 },
    { q: "「Perseverance」means?", opts: ["Laziness", "Persistence", "Pleasure", "Patience"], ans: 1, diff: 3 },
    { q: "The book ___ by the author last year.", opts: ["write", "writes", "was written", "is writing"], ans: 2, diff: 3 },
    { q: "Synonym of 'magnificent'?", opts: ["Tiny", "Splendid", "Dull", "Ordinary"], ans: 1, diff: 3 },
  ],

  science: [
    // 簡單
    { q: "水的化學式是？", opts: ["CO₂", "H₂O", "O₂", "H₂"], ans: 1, diff: 1 },
    { q: "植物進行光合作用需要什麼？", opts: ["氧氣", "二氧化碳", "氮氣", "氫氣"], ans: 1, diff: 1 },
    { q: "人體最大的器官是？", opts: ["心臟", "肺臟", "皮膚", "肝臟"], ans: 2, diff: 1 },
    { q: "聲音在哪種介質中傳播最快？", opts: ["空氣", "水", "真空", "固體"], ans: 3, diff: 1 },
    { q: "地球繞太陽公轉一圈約需多少天？", opts: ["180天", "265天", "365天", "400天"], ans: 2, diff: 1 },
    { q: "電池的兩端分別是什麼？", opts: ["正極和負極", "左極和右極", "上極和下極", "內極和外極"], ans: 0, diff: 1 },
    // 中等
    { q: "下列哪種物質是鹼性？", opts: ["醋", "檸檬汁", "小蘇打水", "鹽酸"], ans: 2, diff: 2 },
    { q: "DNA 位在細胞的哪個部位？", opts: ["細胞膜", "細胞質", "細胞核", "粒線體"], ans: 2, diff: 2 },
    { q: "光在真空中的速度約為？", opts: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], ans: 1, diff: 2 },
    { q: "元素週期表中，氫的原子序是？", opts: ["0", "1", "2", "8"], ans: 1, diff: 2 },
    { q: "下列哪種力讓月球繞地球轉？", opts: ["磁力", "摩擦力", "萬有引力", "靜電力"], ans: 2, diff: 2 },
    // 困難
    { q: "光合作用的方程式：6CO₂ + 6H₂O → ?", opts: ["6O₂+C₆H₁₂O₆", "H₂O₂+O₂", "CO+H₂", "CH₄+O₂"], ans: 0, diff: 3 },
    { q: "牛頓第二運動定律：F = ?", opts: ["m+a", "m-a", "ma", "m/a"], ans: 2, diff: 3 },
    { q: "下列哪個是非金屬元素？", opts: ["Fe（鐵）", "Cu（銅）", "S（硫）", "Al（鋁）"], ans: 2, diff: 3 },
    { q: "人體血液中，氧氣主要由什麼攜帶？", opts: ["血漿", "白血球", "血小板", "血紅素"], ans: 3, diff: 3 },
  ],

  history: [
    // 簡單
    { q: "台灣光復是哪一年？", opts: ["1943", "1945", "1947", "1949"], ans: 1, diff: 1 },
    { q: "中華民國憲法在哪一年公布實施？", opts: ["1945", "1946", "1947", "1948"], ans: 2, diff: 1 },
    { q: "鄭成功來台趕走哪個國家的勢力？", opts: ["葡萄牙", "西班牙", "荷蘭", "英國"], ans: 2, diff: 1 },
    { q: "世界上最早發明印刷術的是哪個民族？", opts: ["埃及人", "羅馬人", "中國人", "希臘人"], ans: 2, diff: 1 },
    { q: "秦始皇統一中國是哪一年？", opts: ["前500年", "前300年", "前221年", "前100年"], ans: 2, diff: 1 },
    // 中等
    { q: "工業革命最早發生在哪個國家？", opts: ["法國", "德國", "美國", "英國"], ans: 3, diff: 2 },
    { q: "下列哪位是文藝復興時期的藝術家？", opts: ["牛頓", "達文西", "愛因斯坦", "馬可波羅"], ans: 1, diff: 2 },
    { q: "第一次世界大戰起始於哪一年？", opts: ["1912", "1914", "1916", "1918"], ans: 1, diff: 2 },
    { q: "古埃及的金字塔主要用途是？", opts: ["倉庫", "神廟", "陵墓", "天文台"], ans: 2, diff: 2 },
    // 困難
    { q: "馬關條約簽訂後，台灣割讓給哪個國家？", opts: ["英國", "美國", "日本", "俄國"], ans: 2, diff: 3 },
    { q: "法國大革命的口號不包含哪項？", opts: ["自由", "平等", "民主", "博愛"], ans: 2, diff: 3 },
    { q: "「布列頓森林體系」確立了哪種貨幣為國際準備貨幣？", opts: ["英鎊", "法郎", "美元", "馬克"], ans: 2, diff: 3 },
  ],
};

const CATEGORY_NAMES = {
  math: "數學",
  english: "英文",
  science: "自然",
  history: "社會",
};

const CATEGORY_CLASS = {
  math: "math",
  english: "english",
  science: "science",
  history: "history",
};

/**
 * 根據難度取得題目
 * @param {string} category
 * @param {number} difficulty 1~3
 * @returns {object} question
 */
function getQuestion(category, difficulty) {
  const pool = QUESTIONS[category].filter(q => q.diff <= difficulty);
  const weightedPool = pool.flatMap(q => {
    // 難度接近目標的題目出現機率更高
    const weight = q.diff === difficulty ? 3 : (q.diff === difficulty - 1 ? 2 : 1);
    return Array(weight).fill(q);
  });
  return weightedPool[Math.floor(Math.random() * weightedPool.length)];
}

/**
 * 隨機取得一個科目
 */
function randomCategory() {
  const cats = Object.keys(QUESTIONS);
  return cats[Math.floor(Math.random() * cats.length)];
}
