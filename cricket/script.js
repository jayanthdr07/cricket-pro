let state = {
    userScore: 0,
    cpuScore: 0,
    balls: 6,
    isUserBatting: true,
    target: -1,
    gameOver: false
};

function handleToss(choice) {
    const toss = Math.floor(Math.random() * 2) + 1;
    const won = (choice === toss);
    
    document.getElementById('toss-btns').classList.add('hidden');
    
    if (won) {
        updateMessage("You won the toss! Choose your play:");
        document.getElementById('choice-btns').classList.remove('hidden');
    } else {
        const cpuChoiceBatting = Math.random() < 0.5;
        state.isUserBatting = !cpuChoiceBatting;
        updateMessage(cpuChoiceBatting ? "CPU won and chose to BAT first." : "CPU won and chose to BOWL first.");
        startGameplay();
    }
}

function userChose(preference) {
    state.isUserBatting = (preference === 'BATTING');
    document.getElementById('choice-btns').classList.add('hidden');
    startGameplay();
}

function startGameplay() {
    document.getElementById('play-btns').classList.remove('hidden');
    setRole(state.isUserBatting ? "BATTING" : "BOWLING");
    addToLog(`Match started. You are ${state.isUserBatting ? 'Batting' : 'Bowling'}.`);
    updateUI();
}

function playTurn(userVal) {
    if (state.gameOver) return;

    const cpuVal = Math.floor(Math.random() * 6) + 1;
    state.balls--;

    if (state.isUserBatting) {
        if (userVal === cpuVal) {
            addToLog(`<span class="out-text">OUT!</span> You played ${userVal}, CPU bowled ${cpuVal}`);
            endInnings();
        } else {
            state.userScore += userVal;
            updateMessage(`You hit ${userVal}! (CPU: ${cpuVal})`);
            addToLog(`You hit <span class="score-text">${userVal}</span>`);
        }
    } else {
        if (userVal === cpuVal) {
            addToLog(`<span class="out-text">WICKET!</span> You bowled ${userVal}, CPU played ${cpuVal}`);
            endInnings();
        } else {
            state.cpuScore += cpuVal;
            updateMessage(`CPU scores ${cpuVal}! (You: ${userVal})`);
            addToLog(`CPU scored <span class="score-text">${cpuVal}</span>`);
        }
    }

    if (state.target !== -1) {
        if (state.isUserBatting && state.userScore > state.target) endInnings();
        if (!state.isUserBatting && state.cpuScore > state.target) endInnings();
    }

    if (state.balls === 0 && !state.gameOver) endInnings();
    updateUI();
}

function endInnings() {
    if (state.target === -1) {
        state.target = state.isUserBatting ? state.userScore : state.cpuScore;
        state.isUserBatting = !state.isUserBatting;
        state.balls = 6;
        
        document.getElementById('target-container').classList.remove('hidden');
        document.getElementById('target-val').innerText = state.target + 1;
        
        updateMessage("Innings Over! Switching sides...");
        setRole(state.isUserBatting ? "BATTING" : "BOWLING");
        addToLog(`--- Innings Over. Target: ${state.target + 1} ---`);
    } else {
        state.gameOver = true;
        declareWinner();
    }
}

function declareWinner() {
    document.getElementById('play-btns').classList.add('hidden');
    document.getElementById('reset-btn').classList.remove('hidden');
    
    let resultMsg = "";
    if (state.userScore > state.cpuScore) resultMsg = "🏆 YOU WON THE MATCH!";
    else if (state.cpuScore > state.userScore) resultMsg = "🤖 CPU WON THE MATCH!";
    else resultMsg = "🤝 IT'S A DRAW!";
    
    updateMessage(resultMsg);
    addToLog(`<strong>Result: ${resultMsg}</strong>`);
}

function updateUI() {
    document.getElementById('user-score').innerText = state.userScore;
    document.getElementById('cpu-score').innerText = state.cpuScore;
    document.getElementById('balls-left').innerText = state.balls;
}

function updateMessage(msg) { document.getElementById('message').innerText = msg; }

function setRole(role) { 
    const badge = document.getElementById('role-badge');
    badge.innerText = role;
    badge.style.background = (role === "BATTING") ? "#2ecc71" : "#3498db";
}

function addToLog(msg) {
    const log = document.getElementById('match-log');
    const entry = document.createElement('div');
    entry.style.borderBottom = "1px solid #222";
    entry.style.padding = "2px 0";
    entry.innerHTML = `• ${msg}`;
    log.prepend(entry);
}
