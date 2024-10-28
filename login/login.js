document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    const loginForm = document.querySelector('form');
    
    if (!loginForm) {
        console.error('Login form not found in the document');
        return;
    }
    console.log('Login form found:', loginForm);

    loginForm.addEventListener('submit', function(e) {
        console.log('Form submission triggered');
        e.preventDefault();

        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        if (!usernameInput || !passwordInput) {
            console.error('Username or password input not found');
            return;
        }

        const username = usernameInput.value;
        const password = passwordInput.value;

        console.log('Entered username:', username);
        console.log('Entered password:', password);

        let users = JSON.parse(localStorage.getItem('users')) || [];
        console.log('Retrieved users from localStorage:', users);

        const user = users.find(u => u.username === username && u.password === password);
        console.log('Found user:', user);

        if (user) {
            console.log('Login successful for user:', username);
            
            user.isLoggedIn = true;
            
            localStorage.setItem('users', JSON.stringify(users));
            console.log('Updated users in localStorage');

            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';

            const loggedInUser = {
                username: user.username,
                email: user.email,
                isLoggedIn: true
            };
            
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            console.log('Stored logged-in user separately:', loggedInUser);

            console.log('Redirecting to index page...');
            setTimeout(() => {
                window.location.href = '../index/index.html';
            }, 1500);
        } else {
            console.log('Login failed - Invalid username or password');
            errorMessage.textContent = 'Invalid username or password!';
            errorMessage.style.display = 'block';
        }
    });
});