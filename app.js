// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyBFfOtB77exnq23yp_E7zEWhhZ8td2lpOk",
  authDomain: "dice-app-firebase.firebaseapp.com",
  databaseURL: "https://dice-app-firebase-default-rtdb.firebaseio.com",
  projectId: "dice-app-firebase",
  storageBucket: "dice-app-firebase.firebasestorage.app",
  messagingSenderId: "1004350981299",
  appId: "1:1004350981299:web:7acdf9960343a1d755dcc6",
  measurementId: "G-JRD8VE3572"
};

// Firebase初期化
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// パスワード認証
const correctPassword = "anipani"; // 設定したいパスワードをここに記載

function login() {
    const inputPassword = document.getElementById("password").value;
    const errorElement = document.getElementById("error");

    if (inputPassword === correctPassword) {
        document.getElementById("login").style.display = "none";
        document.getElementById("app").style.display = "block";
    } else {
        errorElement.textContent = "パスワードが間違っています。";
    }
}

// ダイスロール機能
function rollDice() {
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
    const diceRollRef = database.ref("diceRolls").push();
    diceRollRef.set({
        results: results,
        total: total,
        timestamp: Date.now()
    });
}

// Firebaseのデータ変更を監視して最新の結果を全員に反映
const diceRollsRef = database.ref("diceRolls");

diceRollsRef.on("value", (snapshot) => {
    const data = snapshot.val();
    if (data) {
        const latestRoll = Object.values(data).pop(); // 最新のロールを取得
        document.getElementById("result").textContent = `結果: ${latestRoll.results.join(", ")}`;
        document.getElementById("total").textContent = `合計: ${latestRoll.total}`;
    }
});
