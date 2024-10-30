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

        const signupForm = document.querySelector('form');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');

        function clearErrors() {
            const errorElements = document.querySelectorAll('.field-error, .error-message, .success-message');
            errorElements.forEach(element => {
                element.style.display = 'none';
                element.textContent = '';
            });
        }

        function showFieldError(fieldId, message) {
            const errorElement = document.getElementById(`${fieldId}-error`);
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            }
        }

        if (usernameExists) {
            showFieldError('username', 'Username already exists!');
            hasError = true;
        }

        if (emailExists) {
            showFieldError('email', 'Email already exists!');
            hasError = true;
        }

        if (password !== confirmPassword) {
            showFieldError('confirm-password', 'Passwords do not match!');
            hasError = true;
        }

        if (!hasError) {
            const userData = {
                username: username,
                email: email,
                password: password,
                isLoggedIn: false
            };

            users.push(userData);
            localStorage.setItem('users', JSON.stringify(users));

            successMessage.textContent = 'Signup successful! Redirecting to login page...';
            successMessage.style.display = 'block';

            setTimeout(() => {
                window.location.href = '../login/login.html';
            }, 2000);
        }
    });
});

