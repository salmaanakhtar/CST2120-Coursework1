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

    // Game logic
    const moles = document.querySelectorAll('.mole');
    const holes = document.querySelectorAll('.circle');
    const scoreDisplay = document.getElementById('score-value');
    const playButton = document.getElementById('play-button');
    const livesDisplay = document.getElementById('lives');
    let score = 0;
    let lives = 3;
    let gameOver = true;

    function randomTime(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    function randomMole(moles) {
        const idx = Math.floor(Math.random() * moles.length);
        return moles[idx];
    }

    function showMole() {
        const time = randomTime(500, 1500);
        const mole = randomMole(moles);
        mole.classList.add('show');
        setTimeout(() => {
            mole.classList.remove('show');
            if (!gameOver) showMole();
        }, time);
    }

    function updateLives() {
        livesDisplay.innerHTML = '❤️'.repeat(lives);
    }

    holes.forEach(hole => {
        hole.addEventListener('click', () => {
            if (gameOver) return;
            const mole = hole.querySelector('.mole');
            if (mole.classList.contains('show')) {
                score++;
                mole.classList.remove('show');
                scoreDisplay.textContent = score;
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
        if(!loggedInUser || !loggedInUser.isLoggedIn) {
            score = 0;
            lives = 3;
            gameOver = false;
            scoreDisplay.textContent = '0';
            updateLives();
            playButton.style.display = 'none';
            showMole();
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