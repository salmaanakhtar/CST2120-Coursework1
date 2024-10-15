document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('form');

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        let users = JSON.parse(localStorage.getItem('users')) || [];

        const usernameExists = users.some(user => user.username === username);
        const emailExists = users.some(user => user.email === email);

        if (usernameExists) {
            alert("Username already exists!");
            return;
        }

        if (emailExists) {
            alert("Email already exists!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const userData = {
            username: username,
            email: email,
            password: password,
            isLoggedIn: false
        };

        users.push(userData);

        localStorage.setItem('users', JSON.stringify(users));

        alert('Signup successful! Please log in.');
        
        window.location.href = '../login/login.html';
    });
});

