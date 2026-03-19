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
    { q: "12 的因數有幾個？", opts: ["4", "5", "6", "7"], ans: 2, diff: 1 },
    { q: "4³ = ?", opts: ["12", "16", "32", "64"], ans: 3, diff: 1 },
    { q: "一個長方形長8、寬5，面積是？", opts: ["26", "40", "13", "80"], ans: 1, diff: 1 },
    { q: "下列哪個不是偶數？", opts: ["14", "22", "37", "48"], ans: 2, diff: 1 },
    { q: "15 的最大公因數（GCD）和 25 的 GCD 是？", opts: ["1", "3", "5", "15"], ans: 2, diff: 1 },
    { q: "3/4 + 1/4 = ?", opts: ["4/8", "4/4", "1", "2"], ans: 2, diff: 1 },
    { q: "一個圓的直徑為10，半徑為？", opts: ["5", "10", "20", "100"], ans: 0, diff: 1 },
    { q: "100 - 37 × 2 = ?", opts: ["26", "126", "63", "74"], ans: 0, diff: 1 },
    // 中等
    { q: "√144 = ?", opts: ["11", "12", "13", "14"], ans: 1, diff: 2 },
    { q: "3x - 7 = 14，x = ?", opts: ["5", "6", "7", "8"], ans: 2, diff: 2 },
    { q: "等差數列 2, 5, 8, 11...，第10項是？", opts: ["28", "29", "30", "31"], ans: 1, diff: 2 },
    { q: "圓周率 π ≈ ?", opts: ["3.14", "3.41", "3.12", "3.21"], ans: 0, diff: 2 },
    { q: "一個圓半徑為 5，面積是？（π=3.14）", opts: ["31.4", "62.8", "78.5", "157"], ans: 2, diff: 2 },
    { q: "2³ + 3² = ?", opts: ["13", "17", "25", "35"], ans: 1, diff: 2 },
    { q: "x² = 25 時，x 的正數解為？", opts: ["4", "5", "6", "7"], ans: 1, diff: 2 },
    { q: "下列哪個是完全平方數？", opts: ["50", "72", "81", "90"], ans: 2, diff: 2 },
    { q: "一個梯形上底4、下底8、高5，面積是？", opts: ["25", "30", "60", "20"], ans: 1, diff: 2 },
    { q: "2/3 ÷ 4/9 = ?", opts: ["8/27", "3/2", "2/9", "6/12"], ans: 1, diff: 2 },
    { q: "等比數列 3, 6, 12...，第5項是？", opts: ["24", "36", "48", "96"], ans: 2, diff: 2 },
    { q: "一元二次方程式 x²-5x+6=0 的解為？", opts: ["1,6", "2,3", "-2,-3", "1,5"], ans: 1, diff: 2 },
    // 困難
    { q: "若 f(x)=2x²-3x+1，f(2)=？", opts: ["1", "2", "3", "4"], ans: 2, diff: 3 },
    { q: "1 + 2 + 3 + ... + 100 = ?", opts: ["4950", "5000", "5050", "5100"], ans: 2, diff: 3 },
    { q: "直角三角形兩股為 3、4，斜邊為？", opts: ["4", "5", "6", "7"], ans: 1, diff: 3 },
    { q: "(a+b)²展開等於？", opts: ["a²+b²", "a²+ab+b²", "a²+2ab+b²", "2a²+2b²"], ans: 2, diff: 3 },
    { q: "sin 30° = ?", opts: ["1/2", "√2/2", "√3/2", "1"], ans: 0, diff: 3 },
    { q: "下列哪個是無理數？", opts: ["0.5", "√4", "√2", "3/7"], ans: 2, diff: 3 },
    { q: "等差數列前n項和公式為？", opts: ["na₁", "n(a₁+aₙ)/2", "n²a₁", "naₙ/2"], ans: 1, diff: 3 },
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
    { q: "「hospital」的中文是？", opts: ["學校", "飯店", "醫院", "工廠"], ans: 2, diff: 1 },
    { q: "What color is the sky?", opts: ["Green", "Red", "Blue", "Yellow"], ans: 2, diff: 1 },
    { q: "星期三的英文是？", opts: ["Monday", "Tuesday", "Wednesday", "Thursday"], ans: 2, diff: 1 },
    { q: "Which is an animal?", opts: ["Table", "Chair", "Tiger", "River"], ans: 2, diff: 1 },
    { q: "「delicious」最接近的意思是？", opts: ["好吃的", "漂亮的", "危險的", "安靜的"], ans: 0, diff: 1 },
    { q: "We ___ happy yesterday.", opts: ["are", "is", "were", "be"], ans: 2, diff: 1 },
    // 中等
    { q: "She ___ studying when I called.", opts: ["is", "was", "were", "be"], ans: 1, diff: 2 },
    { q: "The opposite of 'difficult' is?", opts: ["Hard", "Tough", "Easy", "Complex"], ans: 2, diff: 2 },
    { q: "I have lived here ___ 5 years.", opts: ["since", "for", "ago", "before"], ans: 1, diff: 2 },
    { q: "Which is NOT a pronoun?", opts: ["He", "She", "Run", "They"], ans: 2, diff: 2 },
    { q: "「approximately」的中文意思是？", opts: ["絕對地", "大約地", "偶爾地", "永遠地"], ans: 1, diff: 2 },
    { q: "The book is ___ than I expected.", opts: ["more interesting", "most interesting", "interestinger", "interest"], ans: 0, diff: 2 },
    { q: "She ___ the piano since age 6.", opts: ["plays", "played", "has played", "is playing"], ans: 2, diff: 2 },
    { q: "Which sentence is correct?", opts: ["He don't like it.", "He doesn't likes it.", "He doesn't like it.", "He not like it."], ans: 2, diff: 2 },
    { q: "「Ambitious」的意思是？", opts: ["懶惰的", "膽怯的", "有抱負的", "誠實的"], ans: 2, diff: 2 },
    { q: "___ you mind closing the window?", opts: ["Will", "Would", "Should", "Could"], ans: 1, diff: 2 },
    // 困難
    { q: "If I ___ rich, I would travel the world.", opts: ["am", "was", "were", "be"], ans: 2, diff: 3 },
    { q: "「Perseverance」means?", opts: ["Laziness", "Persistence", "Pleasure", "Patience"], ans: 1, diff: 3 },
    { q: "The book ___ by the author last year.", opts: ["write", "writes", "was written", "is writing"], ans: 2, diff: 3 },
    { q: "Synonym of 'magnificent'?", opts: ["Tiny", "Splendid", "Dull", "Ordinary"], ans: 1, diff: 3 },
    { q: "Not only ___ he smart, but also kind.", opts: ["is", "was", "are", "were"], ans: 0, diff: 3 },
    { q: "「Ephemeral」means?", opts: ["Permanent", "Short-lived", "Ancient", "Massive"], ans: 1, diff: 3 },
    { q: "Had I known earlier, I ___ helped.", opts: ["would have", "will have", "would", "could"], ans: 0, diff: 3 },
  ],

  science: [
    // 簡單
    { q: "水的化學式是？", opts: ["CO₂", "H₂O", "O₂", "H₂"], ans: 1, diff: 1 },
    { q: "植物進行光合作用需要什麼？", opts: ["氧氣", "二氧化碳", "氮氣", "氫氣"], ans: 1, diff: 1 },
    { q: "人體最大的器官是？", opts: ["心臟", "肺臟", "皮膚", "肝臟"], ans: 2, diff: 1 },
    { q: "聲音在哪種介質中傳播最快？", opts: ["空氣", "水", "真空", "固體"], ans: 3, diff: 1 },
    { q: "地球繞太陽公轉一圈約需多少天？", opts: ["180天", "265天", "365天", "400天"], ans: 2, diff: 1 },
    { q: "電池的兩端分別是什麼？", opts: ["正極和負極", "左極和右極", "上極和下極", "內極和外極"], ans: 0, diff: 1 },
    { q: "下列哪種是植物？", opts: ["珊瑚", "海葵", "水草", "水母"], ans: 2, diff: 1 },
    { q: "空氣中含量最多的氣體是？", opts: ["氧氣", "二氧化碳", "氮氣", "氫氣"], ans: 2, diff: 1 },
    { q: "鑽石的主要成分是？", opts: ["矽", "碳", "鐵", "鈣"], ans: 1, diff: 1 },
    { q: "月球繞地球公轉一圈約需多少天？", opts: ["7天", "14天", "27天", "365天"], ans: 2, diff: 1 },
    { q: "下列哪個是可再生能源？", opts: ["煤炭", "石油", "天然氣", "太陽能"], ans: 3, diff: 1 },
    // 中等
    { q: "下列哪種物質是鹼性？", opts: ["醋", "檸檬汁", "小蘇打水", "鹽酸"], ans: 2, diff: 2 },
    { q: "DNA 位在細胞的哪個部位？", opts: ["細胞膜", "細胞質", "細胞核", "粒線體"], ans: 2, diff: 2 },
    { q: "光在真空中的速度約為？", opts: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], ans: 1, diff: 2 },
    { q: "元素週期表中，氫的原子序是？", opts: ["0", "1", "2", "8"], ans: 1, diff: 2 },
    { q: "下列哪種力讓月球繞地球轉？", opts: ["磁力", "摩擦力", "萬有引力", "靜電力"], ans: 2, diff: 2 },
    { q: "食物中提供熱量的三大營養素不包含？", opts: ["醣類", "脂肪", "蛋白質", "維生素"], ans: 3, diff: 2 },
    { q: "下列哪個是化學變化？", opts: ["水結冰", "紙張燃燒", "鐵塊切割", "糖溶於水"], ans: 1, diff: 2 },
    { q: "人體血型系統中，何種血型稱為「萬能供血者」？", opts: ["A型", "B型", "AB型", "O型"], ans: 3, diff: 2 },
    { q: "牛頓第一運動定律又稱為？", opts: ["重力定律", "慣性定律", "加速度定律", "作用力定律"], ans: 1, diff: 2 },
    { q: "地球磁場的北磁極位於地理上的哪個方向？", opts: ["北方", "南方", "東方", "西方"], ans: 1, diff: 2 },
    // 困難
    { q: "光合作用的方程式：6CO₂ + 6H₂O → ?", opts: ["6O₂+C₆H₁₂O₆", "H₂O₂+O₂", "CO+H₂", "CH₄+O₂"], ans: 0, diff: 3 },
    { q: "牛頓第二運動定律：F = ?", opts: ["m+a", "m-a", "ma", "m/a"], ans: 2, diff: 3 },
    { q: "下列哪個是非金屬元素？", opts: ["Fe（鐵）", "Cu（銅）", "S（硫）", "Al（鋁）"], ans: 2, diff: 3 },
    { q: "人體血液中，氧氣主要由什麼攜帶？", opts: ["血漿", "白血球", "血小板", "血紅素"], ans: 3, diff: 3 },
    { q: "電功率的計算公式是？", opts: ["P=IV", "P=I/V", "P=V/I", "P=I+V"], ans: 0, diff: 3 },
    { q: "下列哪個粒子帶負電？", opts: ["質子", "中子", "電子", "原子核"], ans: 2, diff: 3 },
    { q: "孟德爾遺傳定律中，顯性基因以何表示？", opts: ["小寫字母", "大寫字母", "數字", "符號"], ans: 1, diff: 3 },
  ],

  history: [
    // 簡單
    { q: "台灣光復是哪一年？", opts: ["1943", "1945", "1947", "1949"], ans: 1, diff: 1 },
    { q: "中華民國憲法在哪一年公布實施？", opts: ["1945", "1946", "1947", "1948"], ans: 2, diff: 1 },
    { q: "鄭成功來台趕走哪個國家的勢力？", opts: ["葡萄牙", "西班牙", "荷蘭", "英國"], ans: 2, diff: 1 },
    { q: "世界上最早發明印刷術的是哪個民族？", opts: ["埃及人", "羅馬人", "中國人", "希臘人"], ans: 2, diff: 1 },
    { q: "秦始皇統一中國是哪一年？", opts: ["前500年", "前300年", "前221年", "前100年"], ans: 2, diff: 1 },
    { q: "台灣最早的原住民族屬於哪個語系？", opts: ["印歐語系", "南島語系", "漢藏語系", "阿爾泰語系"], ans: 1, diff: 1 },
    { q: "聯合國成立於哪一年？", opts: ["1941", "1943", "1945", "1947"], ans: 2, diff: 1 },
    { q: "古希臘的民主政治發源地是？", opts: ["斯巴達", "雅典", "科林斯", "底比斯"], ans: 1, diff: 1 },
    // 中等
    { q: "工業革命最早發生在哪個國家？", opts: ["法國", "德國", "美國", "英國"], ans: 3, diff: 2 },
    { q: "下列哪位是文藝復興時期的藝術家？", opts: ["牛頓", "達文西", "愛因斯坦", "馬可波羅"], ans: 1, diff: 2 },
    { q: "第一次世界大戰起始於哪一年？", opts: ["1912", "1914", "1916", "1918"], ans: 1, diff: 2 },
    { q: "古埃及的金字塔主要用途是？", opts: ["倉庫", "神廟", "陵墓", "天文台"], ans: 2, diff: 2 },
    { q: "「絲路」連接中國與哪個地區？", opts: ["非洲", "歐洲與中亞", "東南亞", "美洲"], ans: 1, diff: 2 },
    { q: "鴉片戰爭後，清朝與英國簽訂了哪個條約？", opts: ["北京條約", "南京條約", "馬關條約", "天津條約"], ans: 1, diff: 2 },
    { q: "法國大革命發生於哪一年？", opts: ["1688", "1776", "1789", "1848"], ans: 2, diff: 2 },
    { q: "「文藝復興」最早從哪個城市興起？", opts: ["巴黎", "威尼斯", "佛羅倫斯", "羅馬"], ans: 2, diff: 2 },
    // 困難
    { q: "馬關條約簽訂後，台灣割讓給哪個國家？", opts: ["英國", "美國", "日本", "俄國"], ans: 2, diff: 3 },
    { q: "法國大革命的口號不包含哪項？", opts: ["自由", "平等", "民主", "博愛"], ans: 2, diff: 3 },
    { q: "「布列頓森林體系」確立了哪種貨幣為國際準備貨幣？", opts: ["英鎊", "法郎", "美元", "馬克"], ans: 2, diff: 3 },
    { q: "冷戰期間，北大西洋公約組織（NATO）成立於？", opts: ["1945", "1947", "1949", "1955"], ans: 2, diff: 3 },
    { q: "「光榮革命」發生在哪個國家？", opts: ["法國", "英國", "美國", "德國"], ans: 1, diff: 3 },
    { q: "甲午戰爭（中日甲午戰爭）發生在哪一年？", opts: ["1884", "1894", "1904", "1914"], ans: 1, diff: 3 },
  ],

  chinese: [
    // 簡單
    { q: "「囫圇吞棗」的意思是？", opts: ["仔細品嚐", "不求甚解", "慢慢進食", "挑食偏食"], ans: 1, diff: 1 },
    { q: "「一石二鳥」相當於英文的哪個說法？", opts: ["Bite the bullet", "Kill two birds with one stone", "Hit the nail", "Miss the boat"], ans: 1, diff: 1 },
    { q: "「亡羊補牢」後面接的是？", opts: ["為時已晚", "猶未遲也", "無濟於事", "後悔莫及"], ans: 1, diff: 1 },
    { q: "下列哪個字的注音是「ㄇㄣˊ」？", opts: ["門", "問", "聞", "悶"], ans: 0, diff: 1 },
    { q: "「明察秋毫」中的「秋毫」指的是？", opts: ["秋天的稻穗", "秋天動物的細毛", "秋天的落葉", "秋天的天空"], ans: 1, diff: 1 },
    { q: "「狐假虎威」中，狐狸靠什麼嚇退百獸？", opts: ["自己的力量", "借助老虎的威勢", "智慧", "速度"], ans: 1, diff: 1 },
    { q: "「疑」的部首是？", opts: ["匕", "矢", "疋", "匹"], ans: 2, diff: 1 },
    { q: "「破釜沉舟」比喻什麼？", opts: ["準備充分", "下定決心不退縮", "輕鬆取勝", "放棄計畫"], ans: 1, diff: 1 },
    { q: "「魚目混珠」的意思是？", opts: ["魚和珍珠放在一起", "以假冒真", "見多識廣", "眼力很好"], ans: 1, diff: 1 },
    // 中等
    { q: "李白是哪個朝代的詩人？", opts: ["漢朝", "唐朝", "宋朝", "明朝"], ans: 1, diff: 2 },
    { q: "「人之初，性本善」出自哪本書？", opts: ["論語", "孟子", "三字經", "千字文"], ans: 2, diff: 2 },
    { q: "「四書」不包含下列哪本？", opts: ["論語", "孟子", "詩經", "中庸"], ans: 2, diff: 2 },
    { q: "「溫故知新」出自哪部典籍？", opts: ["孟子", "論語", "老子", "莊子"], ans: 1, diff: 2 },
    { q: "杜甫的詩風格通常被形容為？", opts: ["飄逸浪漫", "清新自然", "沉鬱頓挫", "豪放粗獷"], ans: 2, diff: 2 },
    { q: "「邯鄲學步」說的是哪個地方的走路方式？", opts: ["邯鄲", "燕國", "齊國", "楚國"], ans: 0, diff: 2 },
    { q: "「朝三暮四」原來說的是用什麼餵養猴子？", opts: ["香蕉", "橡實", "蘋果", "堅果"], ans: 1, diff: 2 },
    // 困難
    { q: "「曲高和寡」的「和」，讀作？", opts: ["ㄏㄜˊ", "ㄏㄜˋ", "ㄏㄨˋ", "ㄏㄨㄢˊ"], ans: 1, diff: 3 },
    { q: "下列哪句詩出自王維？", opts: ["床前明月光", "大漠孤煙直", "春眠不覺曉", "鋤禾日當午"], ans: 1, diff: 3 },
    { q: "「洛陽紙貴」與哪位文學家有關？", opts: ["陶淵明", "左思", "蘇東坡", "歐陽修"], ans: 1, diff: 3 },
    { q: "「浮生若夢，為歡幾何」出自哪位詩人？", opts: ["杜甫", "白居易", "李白", "王維"], ans: 2, diff: 3 },
    { q: "「字」和「詞」的差別，下列哪個說法正確？", opts: ["字即詞，無差別", "詞是由字組成的語言單位", "字比詞大", "詞只有一個字"], ans: 1, diff: 3 },
  ],
};

const CATEGORY_NAMES = {
  math: "數學",
  english: "英文",
  science: "自然",
  history: "社會",
  chinese: "國文",
};

const CATEGORY_CLASS = {
  math: "math",
  english: "english",
  science: "science",
  history: "history",
  chinese: "chinese",
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
