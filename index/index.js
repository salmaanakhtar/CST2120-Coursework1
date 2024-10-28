// Wait for the DOM to fully load before executing the game code
document.addEventListener("DOMContentLoaded", function () {

    // User Authentication Variables
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')); // Stores user login state and info
    const loginButton = document.querySelector('.login-button');           // Reference to login button
    const usernameElement = document.querySelector('.username');           // Displays username when logged in
    const logoutButton = document.querySelector('.logout-button');         // Reference to logout button

    // Check if user is logged in and update UI accordingly
    if (loggedInUser && loggedInUser.isLoggedIn) {
        loginButton.style.display = 'none';
        usernameElement.textContent = loggedInUser.username;
        usernameElement.style.display = 'inline-block';
        logoutButton.style.display = 'inline-block';

        // Handle logout functionality
        logoutButton.addEventListener('click', function () {
            localStorage.removeItem('loggedInUser');
            window.location.href = '../login/login.html';
        });
    } else {
        usernameElement.style.display = 'none';
        logoutButton.style.display = 'none';
    }

    // Game Element References
    const moles = document.querySelectorAll('.mole');           // All mole elements
    const holes = document.querySelectorAll('.circle');         // All hole elements
    const scoreDisplay = document.getElementById('score-value'); // Score display element
    const playButton = document.getElementById('play-button');   // Start/restart button
    const livesDisplay = document.getElementById('lives');       // Lives display element
    const muteButton = document.getElementById('mute-button');   // Sound toggle button
    const muteIcon = muteButton.querySelector('.material-icons'); // Mute button icon
    
    // Game State Variables
    let score = 0;                    
    let lives = 3;                    
    let gameOver = true;              
    let currentWave = 1;              
    let molesInWave = 10;             // Number of moles to spawn in current wave
    let moleSpeed = {                 // Mole appearance duration range
        min: 1000,                    // Minimum time mole stays visible (ms)
        max: 2000                     // Maximum time mole stays visible (ms)
    };
    let catChance = 0;                // Probability of spawning a cat instead of mole
    let isMuted = false;              
    let activeMoles = 0;              
    let maxSimultaneousMoles = 1;     // Maximum moles that can appear at once
    let powerUpActive = false;        // Tracks if a power-up is currently available

    // Audio Elements
    const moleHitSound = document.getElementById('moleHitSound');    
    const missSound = document.getElementById('missSound');          
    const catHitSound = document.getElementById('catHitSound');      
    const waveEndSound = document.getElementById('waveEndSound');    

    // Sound Management Functions
    function playSound(audioElement) {
        if (!isMuted) {
            audioElement.currentTime = 0;
            audioElement.volume = 0.5;
            audioElement.play().catch(error => {
                console.log("Audio play failed:", error);
            });
        }
    }

    // Handle mute button clicks and save preference
    muteButton.addEventListener('click', () => {
        isMuted = !isMuted;
        muteIcon.textContent = isMuted ? 'volume_off' : 'volume_up';
        localStorage.setItem('gameSound', isMuted ? 'muted' : 'unmuted');
    });

    // Load saved sound preference
    function loadSoundPreference() {
        const soundPreference = localStorage.getItem('gameSound');
        if (soundPreference === 'muted') {
            isMuted = true;
            muteIcon.textContent = 'volume_off';
        }
    }
    loadSoundPreference();

    // Create and manage power-up heart item
    function createPowerUp() {
        const powerUp = document.createElement('div');
        powerUp.className = 'power-up';
        powerUp.innerHTML = '❤️';
        powerUp.style.position = 'absolute';
        powerUp.style.left = Math.random() * (window.innerWidth - 50) + 'px';
        powerUp.style.top = Math.random() * (window.innerHeight - 50) + 'px';
        powerUp.style.cursor = 'pointer';
        powerUp.style.fontSize = '2em';
        powerUp.style.animation = 'float 2s infinite ease-in-out';
        
        // Restore lives when power-up is collected
        powerUp.addEventListener('click', () => {
            lives = 3;
            updateLives();
            powerUp.remove();
            powerUpActive = false;
        });

        document.body.appendChild(powerUp);
        powerUpActive = true;

        // Remove power-up if not collected within 10 seconds
        setTimeout(() => {
            if (powerUpActive && powerUp.parentNode) {
                powerUp.remove();
                powerUpActive = false;
            }
        }, 10000);
    }

    // Generate random time for mole appearance
    function randomTime(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    // Select random available hole for mole appearance
    function randomMole(moles) {
        const availableMoles = Array.from(moles).filter(mole => 
            !mole.classList.contains('show'));
        if (availableMoles.length === 0) return null;
        const idx = Math.floor(Math.random() * availableMoles.length);
        return availableMoles[idx];
    }

    // Main game logic for showing moles
    function showMole() {
        if (gameOver) return;

        // Check if maximum simultaneous moles reached
        if (activeMoles >= maxSimultaneousMoles) {
            setTimeout(showMole, 500);
            return;
        }

        const mole = randomMole(moles);
        if (!mole) {
            setTimeout(showMole, 500);
            return;
        }

        const time = randomTime(moleSpeed.min, moleSpeed.max);

        // Determine if this mole should be a cat
        if (Math.random() < catChance) {
            mole.classList.add('cat');
        } else {
            mole.classList.remove('cat');
        }

        mole.classList.add('show');
        mole.dataset.clicked = 'false';
        activeMoles++;

        // Hide mole after time expires
        setTimeout(() => {
            if (mole.dataset.clicked === 'false' && !mole.classList.contains('cat')) {
                score = Math.max(0, score - penaltyPoints);
                scoreDisplay.textContent = score;
            }
            mole.classList.remove('show', 'cat');
            activeMoles--;
            molesInWave--;
            
            // Check if wave is complete or spawn new mole
            if (molesInWave > 0) {
                if (activeMoles < maxSimultaneousMoles) {
                    showMole();
                }
            } else {
                endWave();
            }
        }, time);

        // Spawn additional moles if possible
        if (activeMoles < maxSimultaneousMoles && molesInWave > activeMoles) {
            setTimeout(showMole, randomTime(300, 1000));
        }
    }

    // Update lives display
    function updateLives() {
        livesDisplay.innerHTML = '❤️'.repeat(lives);
    }

    // Handle end of wave and difficulty progression
    function endWave() {
        playSound(waveEndSound);
        currentWave++;
        updateWaveDisplay();
        
        // Spawn power-up at wave 6
        if (currentWave === 6 && !powerUpActive) {
            createPowerUp();
        }
        
        // Restore one life between waves
        if (lives < 3) {
            lives++;
            updateLives();
        }
        
        // Update difficulty parameters
        molesInWave = 10 + currentWave * 2;
        moleSpeed.min = Math.max(500, 1000 - currentWave * 50);
        moleSpeed.max = Math.max(1000, 2000 - currentWave * 100);
        catChance = Math.min(0.1, currentWave * 0.01);
        penaltyPoints = Math.min(3, 1 + Math.floor(currentWave / 3));
        maxSimultaneousMoles = Math.min(4, 1 + Math.floor(currentWave / 3));
        
        // Start next wave after delay
        setTimeout(() => {
            if (!gameOver) {
                showMole();
            }
        }, 3000);
    }

    // Update wave number display
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

    // Handle hole clicks
    holes.forEach(hole => {
        hole.addEventListener('click', () => {
            if (gameOver) return;
            const mole = hole.querySelector('.mole');
            if (mole.classList.contains('show')) {
                mole.dataset.clicked = 'true';
                if (mole.classList.contains('cat')) {
                    playSound(catHitSound);
                    endGame();
                } else {
                    playSound(moleHitSound);
                    score++;
                    mole.classList.remove('show');
                    scoreDisplay.textContent = score;
                }
            } else {
                playSound(missSound);
                lives--;
                updateLives();
                if (lives === 0) {
                    endGame();
                }
            }
        });
    });

    // Initialize new game
    function startGame() {
        if (loggedInUser && loggedInUser.isLoggedIn) {
            // Reset game state
            score = 0;
            lives = 3;
            currentWave = 1;
            molesInWave = 10;
            moleSpeed = { min: 1000, max: 2000 };
            catChance = 0;
            penaltyPoints = 1;
            gameOver = false;
            
            // Update UI
            scoreDisplay.textContent = '0';
            updateLives();
            updateWaveDisplay();
            playButton.style.display = 'none';
            document.body.classList.add('game-active');
            showMole();
        } else {
            alert("Please log in to play the game!");
            window.location.href = '../login/login.html';
        }
    }

    // Handle game over
    function endGame() {
        gameOver = true;
        playButton.style.display = 'inline-block';
        playButton.textContent = 'Play Again';
        document.body.classList.remove('game-active');
        saveScore();
    }

    // Save score to leaderboard
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

    // Start game when play button is clicked
    playButton.addEventListener('click', startGame);
});