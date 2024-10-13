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
    let score = 0;
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

    holes.forEach(hole => {
        hole.addEventListener('click', () => {
            if (gameOver) return;
            const mole = hole.querySelector('.mole');
            if (mole.classList.contains('show')) {
                score++;
                mole.classList.remove('show');
            } else {
                score = Math.max(0, score - 1);
            }
            scoreDisplay.textContent = score;
        });
    });

    function startGame() {
        scoreDisplay.textContent = '0';
        score = 0;
        gameOver = false;
        playButton.style.display = 'none';
        showMole();
        setTimeout(() => {
            gameOver = true;
            playButton.style.display = 'inline-block';
            playButton.textContent = 'Play Again';
        }, 60000);
    }

    playButton.addEventListener('click', startGame);
});