// Authentication utilities
const Auth = {
    // Get token from localStorage
    getToken() {
        return localStorage.getItem(STORAGE_KEYS.TOKEN);
    },

    // Save token to localStorage
    setToken(token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    },

    // Get user info from localStorage
    getUser() {
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        return userStr ? JSON.parse(userStr) : null;
    },

    // Save user info to localStorage
    setUser(user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },

    // Check if user is logged in
    isLoggedIn() {
        return !!this.getToken();
    },

    // Check if user is admin
    isAdmin() {
        const user = this.getUser();
        return user && user.roles && user.roles.includes('ROLE_ADMIN');
    },

    // Logout
    logout() {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = 'index.html';
    },

    // Get authorization headers
    getAuthHeaders() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }
};

// Update UI based on auth state
function updateAuthUI() {
    const userInfoEl = document.getElementById('user-info');
    const logoutBtn = document.getElementById('logout-btn');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const heroRegisterBtn = document.getElementById('hero-register-btn');
    
    if (Auth.isLoggedIn()) {
        const user = Auth.getUser();
        if (userInfoEl) {
            userInfoEl.textContent = `Welcome, ${user.username}`;
            userInfoEl.style.display = 'inline';
        }
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
            logoutBtn.onclick = () => Auth.logout();
        }
        // Hide login and register buttons when logged in
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (heroRegisterBtn) heroRegisterBtn.style.display = 'none';
    } else {
        if (userInfoEl) {
            userInfoEl.style.display = 'none';
        }
        if (logoutBtn) {
            logoutBtn.style.display = 'none';
        }
        // Show login and register buttons when not logged in
        if (loginLink) loginLink.style.display = 'inline-block';
        if (registerLink) registerLink.style.display = 'inline-block';
        if (heroRegisterBtn) heroRegisterBtn.style.display = 'inline-block';
    }
}

// Call on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAuthUI);
} else {
    updateAuthUI();
}
