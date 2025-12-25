// Login functionality
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorDiv = document.getElementById('login-error');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        errorDiv.style.display = 'none';

        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Invalid username or password');
            }

            const data = await response.json();

            // Save token and user info
            Auth.setToken(data.token);
            Auth.setUser({
                id: data.id,
                username: data.username,
                email: data.email,
                roles: data.roles
            });

            // Show success message
            showToast('Login successful!', 'success');

            // Redirect based on role
            setTimeout(() => {
                if (data.roles.includes('ROLE_ADMIN')) {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 500);

        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.style.display = 'block';
            showToast(error.message, 'error');
        }
    });
});

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
