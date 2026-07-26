/**
 * Datum Dahleez Store - Customer Account System
 * Professional customer account management with localStorage
 */

class CustomerAccounts {
    constructor() {
        this.currentUser = this.loadCurrentUser();
        this.init();
    }

    init() {
        this.updateUIForLoggedInUser();
        this.attachEventListeners();
    }

    loadCurrentUser() {
        const saved = localStorage.getItem('datum_dahleez_current_user');
        return saved ? JSON.parse(saved) : null;
    }

    saveCurrentUser(user) {
        localStorage.setItem('datum_dahleez_current_user', JSON.stringify(user));
        this.currentUser = user;
        this.updateUIForLoggedInUser();
    }

    register(userData) {
        const users = this.getUsers();
        if (users.find(u => u.email === userData.email)) {
            return { success: false, message: 'Email already registered' };
        }
        users.push(userData);
        localStorage.setItem('datum_dahleez_users', JSON.stringify(users));
        this.saveCurrentUser(userData);
        return { success: true, message: 'Registration successful!' };
    }

    login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            this.saveCurrentUser(user);
            return { success: true, message: 'Login successful!', user };
        }
        return { success: false, message: 'Invalid email or password' };
    }

    logout() {
        localStorage.removeItem('datum_dahleez_current_user');
        this.currentUser = null;
        this.updateUIForLoggedInUser();
    }

    getUsers() {
        const saved = localStorage.getItem('datum_dahleez_users');
        return saved ? JSON.parse(saved) : [];
    }

    updateUIForLoggedInUser() {
        const loginLink = document.getElementById('login-link');
        const logoutLink = document.getElementById('logout-link');
        const userNameDisplay = document.getElementById('user-name-display');

        if (this.currentUser) {
            if (loginLink) loginLink.style.display = 'none';
            if (logoutLink) logoutLink.style.display = 'inline-block';
            if (userNameDisplay) {
                userNameDisplay.textContent = `Welcome, Rs.{this.currentUser.firstName}`;
                userNameDisplay.style.display = 'inline';
            }
        } else {
            if (loginLink) loginLink.style.display = 'inline-block';
            if (logoutLink) logoutLink.style.display = 'none';
            if (userNameDisplay) userNameDisplay.style.display = 'none';
        }
    }

    attachEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                const result = this.login(email, password);
                alert(result.message);
                if (result.success) {
                    loginForm.reset();
                    window.location.reload();
                }
            });
        }

        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const userData = {
                    firstName: document.getElementById('register-firstName').value,
                    lastName: document.getElementById('register-lastName').value,
                    email: document.getElementById('register-email').value,
                    password: document.getElementById('register-password').value,
                    company: document.getElementById('register-company').value || '',
                    phone: document.getElementById('register-phone').value || '',
                    address: document.getElementById('register-address').value || '',
                    city: document.getElementById('register-city').value || '',
                    zipCode: document.getElementById('register-zip').value || '',
                    country: document.getElementById('register-country').value || '',
                    registrationDate: new Date().toISOString()
                };
                const result = this.register(userData);
                alert(result.message);
                if (result.success) {
                    registerForm.reset();
                    window.location.reload();
                }
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
                window.location.reload();
            });
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize customer accounts
const customerAccounts = new CustomerAccounts();
