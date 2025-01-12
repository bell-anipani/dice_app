// Firebase SDKのインポート
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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
const correctPassword = "anipani";
let userName = ""; // 選択されたプレイヤー名
let userColor = "#000000"; // デフォルトの色

window.login = function () {
    const inputPassword = document.getElementById("password").value;
    const inputName = document.getElementById("name").value;
    const errorElement = document.getElementById("error");

    if (inputPassword === correctPassword) {
        userName = inputName || "匿名";
        document.getElementById("login").style.display = "none";
        document.getElementById("app").style.display = "block";
        document.getElementById("userNameInput").value = userName; // 初期値設定
    } else {
        errorElement.textContent = "パスワードが間違っています。";
    }
};

// チェックボックス挙動
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

    if (userInputCheckbox) {
        userName = document.getElementById("userNameInput").value || "匿名";
        userColor = "#000000"; // 名前入力はデフォルト色
    } else if (userListCheckbox) {
        const selectedOption = document.getElementById("userNameList").selectedOptions[0];
        userName = selectedOption.value || "匿名";
        userColor = selectedOption.getAttribute("data-color") || "#000000";
    }

    if (diceSides <= 0 || diceCount <= 0) {
        document.getElementById("result").textContent = "面数と個数は正の数を入力してください。";
        document.getElementById("total").textContent = "合計: -";
        return;
    }

    let results = [];
    let total = 0;

    // ダイスを振る
    for (let i = 0; i < diceCount; i++) {
        const roll = Math.floor(Math.random() * diceSides) + 1;
        results.push(roll);
        total += roll;
    }

    // 結果を表示
    document.getElementById("result").textContent = `結果: ${results.join(", ")}`;
    document.getElementById("total").textContent = `合計: ${total}`;

    // ログメッセージ作成
    const logMessage = `<span style="color: ${userColor};">ダイス結果 {${userName}}:</span> ${results.join(", ")} (合計: ${total})`;

    // Firebaseに保存
    const logsRef = ref(database, "logs");
    push(logsRef, {
        message: logMessage,
        timestamp: Date.now()
    });
};

// Firebaseデータ監視
const logsRef = ref(database, "logs");
let logs = [];

onValue(logsRef, (snapshot) => {
    logs = [];
    snapshot.forEach((childSnapshot) => {
        const log = childSnapshot.val();
        logs.push(log.message);
    });
    updateLogWindow(logs);
});

// ログ窓の更新
function updateLogWindow(logs) {
    const logTextArea = document.getElementById("logWindow");
    logTextArea.innerHTML = logs.join("<br>");
    logTextArea.scrollTop = logTextArea.scrollHeight; // スクロールを最下部に移動
}

// すべてのログを削除
window.clearAllLogs = function () {
    if (confirm("すべてのログを削除しますか？")) {
        remove(logsRef).then(() => {
            logs = [];
            updateLogWindow(logs);
        }).catch(error => {
            console.error("ログ削除中にエラーが発生しました:", error);
        });
    }
};
