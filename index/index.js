document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const loginButton = document.querySelector('.login-button');
    const usernameElement = document.querySelector('.username');
    const logoutButton = document.querySelector('.logout-button');

    if (loggedInUser && loggedInUser.isLoggedIn) {
        loginButton.style.display = 'none';
        usernameElement.textContent = loggedInUser.username;
        usernameElement.style.display = 'inline-block';
        logoutButton.style.display = 'inline-block';

        logoutButton.addEventListener('click', function () {
            localStorage.removeItem('loggedInUser');
            window.location.href = '../login/login.html';
        });
    } else {
        usernameElement.style.display = 'none';
        logoutButton.style.display = 'none';
    }

    const moles = document.querySelectorAll('.mole');
    const holes = document.querySelectorAll('.circle');
    const scoreDisplay = document.getElementById('score-value');
    const playButton = document.getElementById('play-button');
    const livesDisplay = document.getElementById('lives');
    let score = 0;
    let lives = 3;
    let gameOver = true;
    let currentWave = 1;
    let molesInWave = 10;
    let moleSpeed = { min: 1000, max: 2000 };
    let catChance = 0;

    function randomTime(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    function randomMole(moles) {
        const idx = Math.floor(Math.random() * moles.length);
        return moles[idx];
    }

    function showMole() {
        if (gameOver) return;

        const time = randomTime(moleSpeed.min, moleSpeed.max);
        const mole = randomMole(moles);

        if (Math.random() < catChance) {
            mole.classList.add('cat');
        } else {
            mole.classList.remove('cat');
        }

        mole.classList.add('show');
        setTimeout(() => {
            mole.classList.remove('show', 'cat');
            molesInWave--;
            if (molesInWave > 0) {
                showMole();
            } else {
                endWave();
            }
        }, time);
    }

    function updateLives() {
        livesDisplay.innerHTML = '❤️'.repeat(lives);
    }

    function endWave() {
        currentWave++;
        updateWaveDisplay();
        if (lives < 3) {
            lives++;
            updateLives();
        }
        molesInWave = 10 + currentWave * 2;
        moleSpeed.min = Math.max(500, 1000 - currentWave * 50);
        moleSpeed.max = Math.max(1000, 2000 - currentWave * 100);
        catChance = Math.min(0.1, currentWave * 0.01);

        setTimeout(() => {
            if (!gameOver) {
                showMole();
            }
        }, 3000);
    }

    function updateWaveDisplay() {
        const waveDisplay = document.getElementById('wave-display');
        if (!waveDisplay) {
            const waveElement = document.createElement('div');
            waveElement.id = 'wave-display';
            waveElement.style.fontSize = '24px';
            waveElement.style.fontWeight = 'bold';
            waveElement.style.color = 'white';
            waveElement.style.marginBottom = '10px';
            document.getElementById('game-container').insertBefore(waveElement, scoreDisplay.parentNode);
        }
        document.getElementById('wave-display').textContent = `Wave: ${currentWave}`;
    }

    holes.forEach(hole => {
        hole.addEventListener('click', () => {
            if (gameOver) return;
            const mole = hole.querySelector('.mole');
            if (mole.classList.contains('show')) {
                if (mole.classList.contains('cat')) {
                    endGame();
                } else {
                    score++;
                    mole.classList.remove('show');
                    scoreDisplay.textContent = score;
                }
            } else {
                lives--;
                updateLives();
                if (lives === 0) {
                    endGame();
                }
            }
        });
    });

    function startGame() {
        if (loggedInUser && loggedInUser.isLoggedIn) {
            score = 0;
            lives = 3;
            currentWave = 1;
            molesInWave = 10;
            moleSpeed = { min: 1000, max: 2000 };
            catChance = 0;
            gameOver = false;
            scoreDisplay.textContent = '0';
            updateLives();
            updateWaveDisplay();
            playButton.style.display = 'none';
            showMole();
        } else {
            alert("Please log in to play the game!");
            window.location.href = '../login/login.html';
        }
    }

    function endGame() {
        gameOver = true;
        playButton.style.display = 'inline-block';
        playButton.textContent = 'Play Again';
        saveScore();
    }

    function saveScore() {
        if (loggedInUser && loggedInUser.isLoggedIn) {
            const username = loggedInUser.username;
            let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
            leaderboard.push({ username, score });
            leaderboard.sort((a, b) => b.score - a.score);
            leaderboard = leaderboard.slice(0, 10);
            localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        }
    }

    playButton.addEventListener('click', startGame);
});