// =====================================================
//  Firebase 設定檔
//  請參考 README.md 的「Firebase 設定教學」填入你自己的設定
// =====================================================

// 如果你還沒有 Firebase 專案，排行榜會自動改用本地 localStorage
// 遊戲不會因此出錯

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

// 只有在填入真實設定後才初始化
if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
  firebase.initializeApp(firebaseConfig);
}
