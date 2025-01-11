// Firebase SDKのインポート
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";

// Firebase設定
const firebaseConfig = {
    apiKey: "AIzaSyBFfOtB77exnq23yp_E7zEWhhZ8td2lpOk",
    authDomain: "dice-app-firebase.firebaseapp.com",
    databaseURL: "https://dice-app-firebase-default-rtdb.firebaseio.com",
    projectId: "dice-app-firebase",
    storageBucket: "dice-app-firebase.firebasestorage.app",
    messagingSenderId: "1004350981299",
    appId: "1:1004350981299:web:d0770ec75c0288cf55dcc6",
    measurementId: "G-0ES2C2KN9J"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app); // Databaseの取得

// パスワード認証
const correctPassword = "anipani"; // 設定したいパスワードをここに記載

// login関数をグローバルに定義
window.login = function() {
    const inputPassword = document.getElementById("password").value;
    const errorElement = document.getElementById("error");

    if (inputPassword === correctPassword) {
        document.getElementById("login").style.display = "none";
        document.getElementById("app").style.display = "block";
    } else {
        errorElement.textContent = "パスワードが間違っています。";
    }
};

// ダイスロール機能
window.rollDice = function() { // グローバルスコープに追加
    const diceSides = parseInt(document.getElementById("diceSides").value);
    const diceCount = parseInt(document.getElementById("diceCount").value);
    let results = [];
    let total = 0;

    if (diceSides <= 0 || diceCount <= 0) {
        document.getElementById("result").textContent = "面数と個数は正の数を入力してください。";
        document.getElementById("total").textContent = "合計: -";
        return;
    }

    // ダイスを振る
    for (let i = 0; i < diceCount; i++) {
        const roll = Math.floor(Math.random() * diceSides) + 1;
        results.push(roll);
        total += roll;
    }

    // 結果を画面に表示
    document.getElementById("result").textContent = `結果: ${results.join(", ")}`;
    document.getElementById("total").textContent = `合計: ${total}`;

    // Firebaseに結果を保存
    const diceRollRef = ref(database, 'diceRolls').push();
    set(diceRollRef, {
        results: results,
        total: total,
        timestamp: Date.now()
    });
};

// Firebaseのデータ変更を監視して最新の結果を全員に反映
const diceRollsRef = ref(database, 'diceRolls');

onValue(diceRollsRef, (snapshot) => {
    const data = snapshot.val();
    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = ""; // 既存の結果をクリア

    if (data) {
        // すべての結果を表示
        for (const key in data) {
            const roll = data[key];
            const resultItem = document.createElement("div");
            resultItem.textContent = `結果: ${roll.results.join(", ")} (合計: ${roll.total})`;
            resultsContainer.appendChild(resultItem);
        }
    }
});
