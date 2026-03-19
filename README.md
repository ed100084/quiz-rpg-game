# 勇者大挑戰 - 知識冒險 RPG

一款專為國中生設計的網頁知識問答 RPG 遊戲，透過回答各科問題來攻擊怪物、過關斬將！

## 遊玩方式

1. 直接用瀏覽器開啟 `index.html`，或前往 GitHub Pages 連結
2. 輸入你的名字，點擊「開始冒險」
3. 選擇正確答案攻擊怪物
4. 擊敗怪物賺取金幣，在商店購買道具升級

## 遊戲特色

- **5 大科目題庫**：數學、英文、自然、社會、國文，共 140+ 題
- **動態難度**：關卡越深，題目越難，怪物越強
- **稱號系統**：依等級解鎖稱號（學徒勇者 → 傳說英雄）
- **角色外觀**：透過遊玩成就解鎖 5 種角色造型
- **連擊系統**：連續答對傷害加成，最高顯示連擊數
- **商店系統**：每 3 關進入商店，購買 6 種道具升級
- **Boss 戰**：每 7 關出現巨龍王 👑
- **成就徽章**：14 種成就等你解鎖
- **每日簽到**：每天登入可領金幣，連續 7 天有特殊獎勵
- **排行榜**：本地 Top 10，連接 Firebase 後可查全球排名

## 多人支援

不同裝置連上遊戲後，各自擁有獨立的本地進度（localStorage 隔離）。
若想讓所有玩家共享一份**全球排行榜**，請依下方教學設定 Firebase。

## Firebase 全球排行榜設定（選用）

若不設定，遊戲正常運作，排行榜改用本地 localStorage。

### 步驟

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊「新增專案」，輸入專案名稱
3. 進入專案後，點擊左側「Firestore Database」→「建立資料庫」
   - 選擇「以測試模式開始」（開發階段）
4. 點擊左側齒輪 → 「專案設定」→「您的應用程式」→ 新增網頁應用程式
5. 複製 `firebaseConfig` 物件
6. 開啟 `js/firebase-config.js`，將對應欄位填入：

```js
const firebaseConfig = {
  apiKey:            "你的 apiKey",
  authDomain:        "你的 authDomain",
  projectId:         "你的 projectId",
  storageBucket:     "你的 storageBucket",
  messagingSenderId: "你的 messagingSenderId",
  appId:             "你的 appId",
};
```

7. 儲存後重新整理頁面，遊戲結束後分數會自動上傳！

## 技術棧

- 純 HTML / CSS / JavaScript（無框架依賴）
- Google Fonts（Press Start 2P + Noto Sans TC）
- localStorage 儲存本地進度與排行榜
- Firebase Firestore（選用，全球排行榜）

## 檔案結構

```
├── index.html              # 主入口
├── style.css               # 像素 RPG 風格 UI
└── js/
    ├── questions.js        # 題庫（140+ 題）
    ├── game.js             # 遊戲引擎
    └── firebase-config.js  # Firebase 設定（請自行填入）
```
