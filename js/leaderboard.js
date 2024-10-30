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
});

document.addEventListener("DOMContentLoaded", function() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const loginButton = document.querySelector('.login-button');
    const usernameElement = document.querySelector('.username');
    const logoutButton = document.querySelector('.logout-button');

    // Handle login/logout display
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

    // Fetch and display leaderboard
    const leaderboardTable = document.getElementById('leaderboardTable').getElementsByTagName('tbody')[0];
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    // Sort leaderboard by score in descending order
    leaderboard.sort((a, b) => b.score - a.score);

    // Display top 10 scores
    leaderboard.slice(0, 10).forEach((entry, index) => {
        const row = leaderboardTable.insertRow();
        const rankCell = row.insertCell(0);
        const usernameCell = row.insertCell(1);
        const scoreCell = row.insertCell(2);

        rankCell.textContent = index + 1;
        usernameCell.textContent = entry.username;
        scoreCell.textContent = entry.score;
    });

    // If there are less than 10 entries, fill the rest with placeholder data
    for (let i = leaderboard.length; i < 10; i++) {
        const row = leaderboardTable.insertRow();
        const rankCell = row.insertCell(0);
        const usernameCell = row.insertCell(1);
        const scoreCell = row.insertCell(2);

        rankCell.textContent = i + 1;
        usernameCell.textContent = '---';
        scoreCell.textContent = '---';
    }
});