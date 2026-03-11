/**
 * StrandWise - Login / Register Page Logic
 */

// ---- Form Switching ----
function switchForm(form) {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (form === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    }

    // Clear any messages when switching
    clearMessages();
}

// ---- Password Visibility Toggle ----
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
    } else {
        input.type = 'password';
        btn.textContent = '👁️';
    }
}

// ---- Message Display ----
function showMessage(elementId, message, type) {
    const el = document.getElementById(elementId);
    el.textContent = message;
    el.className = 'form-message show ' + type;
}

function clearMessages() {
    document.querySelectorAll('.form-message').forEach(function (el) {
        el.textContent = '';
        el.className = 'form-message';
    });
}

// ---- Login Handler ----
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showMessage('login-message', 'Please fill in all fields.', 'error');
        return;
    }

    const btn = e.target.querySelector('.btn-submit');
    btn.disabled = true;
    btn.textContent = 'Logging in...';

    // Send login request to backend
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    fetch('api/login.php', {
        method: 'POST',
        body: formData
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data.success) {
                showMessage('login-message', 'Login successful! Redirecting...', 'success');
                setTimeout(function () {
                    window.location.href = data.redirect || 'main.html';
                }, 1000);
            } else {
                showMessage('login-message', data.message || 'Invalid email or password.', 'error');
                btn.disabled = false;
                btn.textContent = 'Login';
            }
        })
        .catch(function () {
            showMessage('login-message', 'Connection error. Please try again.', 'error');
            btn.disabled = false;
            btn.textContent = 'Login';
        });
}

// ---- Register Handler ----
function handleRegister(e) {
    e.preventDefault();

    const firstname = document.getElementById('reg-firstname').value.trim();
    const lastname = document.getElementById('reg-lastname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const schoolId = document.getElementById('reg-school').value;
    const gradeLevel = document.getElementById('reg-grade').value;
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    // Validation
    if (!firstname || !lastname || !email || !schoolId || !gradeLevel || !password || !confirm) {
        showMessage('register-message', 'Please fill in all fields.', 'error');
        return;
    }

    if (password.length < 8) {
        showMessage('register-message', 'Password must be at least 8 characters.', 'error');
        return;
    }

    if (password !== confirm) {
        showMessage('register-message', 'Passwords do not match.', 'error');
        return;
    }

    var btn = e.target.querySelector('.btn-submit');
    btn.disabled = true;
    btn.textContent = 'Creating Account...';

    // Send register request to backend
    var formData = new FormData();
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('email', email);
    formData.append('school_id', schoolId);
    formData.append('grade_level', gradeLevel);
    formData.append('password', password);

    fetch('api/register.php', {
        method: 'POST',
        body: formData
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data.success) {
                showMessage('register-message', 'Account created! Redirecting to login...', 'success');
                setTimeout(function () {
                    switchForm('login');
                    document.getElementById('login-email').value = email;
                    btn.disabled = false;
                    btn.textContent = 'Create Account';
                }, 1500);
            } else {
                showMessage('register-message', data.message || 'Registration failed.', 'error');
                btn.disabled = false;
                btn.textContent = 'Create Account';
            }
        })
        .catch(function () {
            showMessage('register-message', 'Connection error. Please try again.', 'error');
            btn.disabled = false;
            btn.textContent = 'Create Account';
        });
}

// ---- Load Schools from Database ----
function loadSchools() {
    fetch('api/get_schools.php')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            var select = document.getElementById('reg-school');
            if (data.success && data.schools) {
                data.schools.forEach(function (school) {
                    var option = document.createElement('option');
                    option.value = school.id;
                    option.textContent = school.name;
                    select.appendChild(option);
                });
            }
        })
        .catch(function () {
            // Schools failed to load — user can still fill other fields
            console.warn('Could not load schools list.');
        });
}

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', function () {
    loadSchools();
});
