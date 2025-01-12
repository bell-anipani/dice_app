// Firebase SDKのインポート
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, push, onChildAdded, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase設定
const firebaseConfig = {
    apiKey: "AIzaSyBFfOtB77exnq23yp_E7zEWhhZ8td2lpOk",
    authDomain: "dice-app-firebase.firebaseapp.com",
    databaseURL: "https://dice-app-firebase-default-rtdb.firebaseio.com",
    projectId: "dice-app-firebase",
    storageBucket: "dice-app-firebase.firebasestorage.app",
    messagingSenderId: "1004350981299",
    appId: "1:1004350981299:web:d0770ec75c0288cf55dcc6"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

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

// ログを表示する関数
function addLogEntry(text, id) {
    const logContainer = document.getElementById("logContainer");

    // ログエントリのコンテナ作成
    const logEntry = document.createElement("div");
    logEntry.className = "log-entry";
    logEntry.dataset.id = id;

    // 削除ボタンの作成
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "削除";
    deleteButton.onclick = () => {
        if (confirm("ログを削除しますか？")) {
            const logRef = ref(database, `logs/${id}`);
            remove(logRef);
        }
    };

    // ログメッセージの追加
    const logText = document.createElement("span");
    logText.textContent = text;

    // コンテナに要素を追加
    logEntry.appendChild(deleteButton);
    logEntry.appendChild(logText);
    logContainer.appendChild(logEntry);

    // スクロールを一番下にする
    logContainer.scrollTop = logContainer.scrollHeight;
}

// ダイスロール機能
window.rollDice = function() {
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

    // ログメッセージの作成
    const logMessage = `ダイス結果: ${results.join(", ")} (合計: ${total})`;

    // Firebaseにログを保存
    const logsRef = ref(database, "logs");
    push(logsRef, {
        message: logMessage,
        timestamp: Date.now()
    });
};

// Firebaseのデータ変更を監視してログ窓を更新
const logsRef = ref(database, "logs");

onChildAdded(logsRef, (data) => {
    const log = data.val();
    addLogEntry(log.message, data.key);
});
