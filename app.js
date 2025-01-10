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

    for (let i = 0; i < diceCount; i++) {
        const roll = Math.floor(Math.random() * diceSides) + 1;
        results.push(roll);
        total += roll;
    }

    document.getElementById("result").textContent = `結果: ${results.join(", ")}`;
    document.getElementById("total").textContent = `合計: ${total}`;
}
