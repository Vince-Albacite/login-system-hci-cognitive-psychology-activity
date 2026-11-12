// Registration, login, logout, password recovery, and session handling.
function throwIfAuthError(result) {
    if (result.error) throw result.error;
    return result;
}

function getLoginProblem(inputs) {
    if (!isValidEmail(inputs.email)) return 'Please enter a valid email address.';
    if (!inputs.password) return 'Please enter your password.';
    return '';
}

function getRegistrationProblem(inputs) {
    const strength = checkPasswordStrength(inputs.password);

    if (!inputs.username) return 'Please enter a username.';
    if (!isValidEmail(inputs.email)) return 'Please enter a valid email address.';
    if (!inputs.password) return 'Please enter a password.';
    if (!strength.isAcceptable) return strength.message;
    if (inputs.password !== inputs.confirm_password) return 'Passwords do not match.';
    return '';
}

function getChangePasswordProblem(inputs) {
    const strength = checkPasswordStrength(inputs.password);

    if (!inputs.password) return 'Please enter a new password.';
    if (!strength.isAcceptable) return strength.message;
    if (inputs.password !== inputs.confirm_password) return 'Passwords do not match.';
    return '';
}

function signInWithPassword(inputs) {
    return supabaseClient.auth.signInWithPassword({
        email: inputs.email,
        password: inputs.password
    }).then(throwIfAuthError);
}

function signUpWithEmail(inputs) {
    return supabaseClient.auth.signUp({
        email: inputs.email,
        password: inputs.password,
        options: {
            data: { username: inputs.username },
            emailRedirectTo: window.location.origin
        }
    }).then(throwIfAuthError).then(function (result) {
        if (!result.data.user) throw new Error('Supabase did not return a registered user.');
        if (result.data.user.identities && result.data.user.identities.length === 0) {
            throw createCodedError('email_exists');
        }
        return result;
    });
}

function sendPasswordResetEmail(email) {
    return supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
    }).then(throwIfAuthError);
}

function updatePassword(newPassword) {
    return supabaseClient.auth.updateUser({ password: newPassword }).then(throwIfAuthError);
}

function signOutOfSupabase() {
    return supabaseClient.auth.signOut().then(throwIfAuthError);
}

async function signOutQuietly() {
    try {
        await signOutOfSupabase();
    } catch (error) {
        console.error('Sign out failed:', error);
    }
}

function getCurrentSession() {
    return supabaseClient.auth.getSession().then(throwIfAuthError).then(function (result) {
        return result.data.session;
    });
}

// A failed email must not undo a registration that Supabase already accepted.
async function notifyAdministrator(inputs) {
    try {
        await sendAdminNotification(inputs.username, inputs.email);
    } catch (emailError) {
        console.error('Administrator email could not be sent:', emailError);
    }
}

function showRegistrationResultModal(hasSession) {
    if (hasSession) {
        vibrateOnSuccess();
        showNoticeModal('check', 'Good Job! Your account has been created successfully.', 'Continue', showLoginSection);
        return;
    }
    vibrateOnSuccess();
    showNoticeModal('exclamation', 'An email verification link has been sent to your email account.', 'Continue', showLoginSection);
}

async function handleRegistration() {
    clearMessage('registration-message');
    const inputs = getInputs('registration-form');
    const problem = getRegistrationProblem(inputs);

    if (problem) {
        showError(problem, 'registration-message', 'registration-button');
        return;
    }

    const button = getEl('registration-button');
    button.disabled = true;

    try {
        const result = await signUpWithEmail(inputs);
        await notifyAdministrator(inputs);
        clearForm('registration-form');
        showRegistrationResultModal(!!result.data.session);
    } catch (error) {
        console.error('Registration error:', error);
        vibrateOnError();
        showError(getFriendlyAuthError(error, 'Registration failed. Please try again.'), 'registration-message', 'registration-button');
    } finally {
        button.disabled = false;
    }
}

async function handleLogin() {
    clearMessage('login-message');
    const inputs = getInputs('login-form');
    const problem = getLoginProblem(inputs);

    if (problem) {
        showError(problem, 'login-message', 'login-button');
        return;
    }

    try {
        const result = await playLoadingScreen('Logging in', function () {
            return signInWithPassword(inputs);
        }, 'Logged in successfully', playSuccessSound);
        
        vibrateOnSuccess();
        clearForm('login-form');
        showDashboard(result.data.user);
    } catch (error) {
        console.error('Login error:', error);
        showLoginSection();
        vibrateOnError();
        showError(getFriendlyAuthError(error, 'Login failed. Check your credentials.'), 'login-message', 'login-button');
    }
}

async function handleForgotPassword() {
    clearMessage('login-message');
    const email = getInputs('login-form').email;

    if (!isValidEmail(email)) {
        vibrateOnError();
        showError('Enter your email above first, then press Forgot Password.', 'login-message', 'login-button');
        return;
    }

    try {
        await sendPasswordResetEmail(email);
        vibrateOnSuccess();
        showNoticeModal('exclamation', 'A password reset link has been sent to your email account.', 'Continue');
    } catch (error) {
        console.error('Password reset error:', error);
        vibrateOnError();
        showError(getFriendlyAuthError(error, 'Could not send the reset link. Please try again.'), 'login-message', 'login-button');
    }
}

function returnToChangePasswordForm() {
    clearForm('change-password-form');
    getPasswordInput('change-password-form').focus();
}

async function finishPasswordChange() {
    await signOutQuietly();
    authLinkType = '';
    clearForm('change-password-form');
    showLoginSection();
}

function showPasswordChangedModal() {
    vibrateOnSuccess();
    showNoticeModal('check', 'Good Job! Your password has been changed successfully.', 'Go to Login', finishPasswordChange);
}

// Supabase refuses a new password equal to the current one (error code same_password).
function showCurrentPasswordModal() {
    showConfirmModal('door', 'You entered your current password. Do you wish to keep it?', showPasswordChangedModal, returnToChangePasswordForm);
}

function handlePasswordChangeError(error) {
    console.error('Change password error:', error);

    if (error.code === 'same_password') {
        showCurrentPasswordModal();
        return;
    }

    showError(getFriendlyAuthError(error, 'Could not change the password. Please try again.'), 'change-password-message', 'change-password-button');
}

async function handleChangePassword() {
    clearMessage('change-password-message');
    const inputs = getInputs('change-password-form');
    const problem = getChangePasswordProblem(inputs);

    if (problem) {
        vibrateOnError();
        showError(problem, 'change-password-message', 'change-password-button');
        return;
    }

    const button = getEl('change-password-button');
    button.disabled = true;

    try {
        await updatePassword(inputs.password);
        showPasswordChangedModal();
    } catch (error) {
        handlePasswordChangeError(error);
    } finally {
        button.disabled = false;
    }
}

async function handleLogout() {
    try {
        await playLoadingScreen('Logging out', signOutOfSupabase, 'Logged out successfully', playLogoutSound);
        vibrateOnSuccess();
        showLoginSection();
    } catch (error) {
        console.error('Logout error:', error);
        switchScreen('dashboard', '.screen');
        refreshCarousel();
        showNoticeModal('exclamation', getFriendlyAuthError(error, 'Could not log out. Please try again.'), 'Continue');
        vibrateOnError();
        playErrorFeedback(getEl('logout-button'));
    }
}

function openLogoutConfirm() {
    showConfirmModal('door', 'Are you sure? Do you want to log out?', handleLogout);
}
