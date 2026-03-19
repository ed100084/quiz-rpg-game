// =====================================================
//  Firebase 設定檔（使用 Firebase Compat SDK）
// =====================================================

const firebaseConfig = {
  apiKey:            "AIzaSyAOjQPDG_e8xdhLHunQmlH-i9wnTAl_6pU",
  authDomain:        "quiz-rpg-game.firebaseapp.com",
  projectId:         "quiz-rpg-game",
  storageBucket:     "quiz-rpg-game.firebasestorage.app",
  messagingSenderId: "412644726148",
  appId:             "1:412644726148:web:0f3d05dcda744a4a80f9d1",
  measurementId:     "G-RDLRPC20DR",
};

if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
}
