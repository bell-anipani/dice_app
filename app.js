// Firebase SDKのインポート
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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
let userName = ""; // 現在の選択されたプレイヤー名

// login関数をグローバルに定義
window.login = function () {
    const inputPassword = document.getElementById("password").value;
    const inputName = document.getElementById("name").value;
    const errorElement = document.getElementById("error");

    if (inputPassword === correctPassword) {
        userName = inputName || "匿名"; // 名前が空の場合はデフォルトで "匿名"
        document.getElementById("login").style.display = "none";
        document.getElementById("app").style.display = "block";
        document.getElementById("userNameInput").value = userName; // 初期値を設定
    } else {
        errorElement.textContent = "パスワードが間違っています。";
    }
};

// チェックボックスの挙動を設定
window.toggleNameInput = function (source) {
    const userInputCheckbox = document.getElementById("userNameCheckbox");
    const userListCheckbox = document.getElementById("userListCheckbox");

    if (source === "input") {
        userListCheckbox.checked = !userInputCheckbox.checked;
    } else if (source === "list") {
        userInputCheckbox.checked = !userListCheckbox.checked;
    }
};

// ダイスロール機能
window.rollDice = function () {
    const diceSides = parseInt(document.getElementById("diceSides").value);
    const diceCount = parseInt(document.getElementById("diceCount").value);
    const userInputCheckbox = document.getElementById("userNameCheckbox").checked;
    const userListCheckbox = document.getElementById("userListCheckbox").checked;

    // チェックが入っている方の名前を使用
    if (userInputCheckbox) {
        userName = document.getElementById("userNameInput").value || "匿名";
    } else if (userListCheckbox) {
        userName = document.getElementById("userNameList").value || "匿名";
    }

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
    const logMessage = `ダイス結果 {${userName}}: ${results.join(", ")} (合計: ${total})`;

    // Firebaseにログを保存
    const logsRef = ref(database, "logs");
    push(logsRef, {
        message: logMessage,
        timestamp: Date.now()
    });
};

// Firebaseのデータ変更を監視してログ窓を更新
const logsRef = ref(database, "logs");
let logs = []; // ログの配列

onValue(logsRef, (snapshot) => {
    logs = [];
    snapshot.forEach((childSnapshot) => {
        const log = childSnapshot.val();
        logs.push(log.message);
    });
    updateLogWindow(logs);
});

// ログ窓の更新関数（自動スクロール機能を追加）
function updateLogWindow(logs) {
    const logTextArea = document.getElementById("logWindow");
    logTextArea.value = logs.join("\n");
    logTextArea.scrollTop = logTextArea.scrollHeight; // スクロールを最下部に移動
}

// すべてのログを削除
window.clearAllLogs = function () {
    if (confirm("すべてのログを削除しますか？")) {
        remove(logsRef).then(() => {
            logs = []; // ローカルのログ配列もリセット
            updateLogWindow(logs); // ログ窓を空にする
        });
    }
};
