function isScreenShown(htmlID) {
    const screen = getEl(htmlID);
    return !!screen && screen.classList.contains('on');
}

function switchScreen(htmlID, classToBeSelected, htmlIDToBeDeselected) {
    document.querySelectorAll(classToBeSelected).forEach(function (screenElement) {
        screenElement.classList.toggle('on', screenElement.id === htmlID);
    });

    const previousScreen = getEl(htmlIDToBeDeselected);
    if (previousScreen) previousScreen.classList.remove('on');
}

function showLoginSection() {
    switchScreen('login-registration', '.screen');
    switchScreen('login-section', '.form-section');
}

function showRegistrationSection() {
    switchScreen('login-registration', '.screen');
    switchScreen('registration-section', '.form-section');
}

function showChangePasswordScreen() {
    switchScreen('change-password', '.screen');
}

function showMessage(message, type, targetID) {
    const target = getEl(targetID);
    if (!target) return;

    target.textContent = message;
    target.className = 'message ' + (type || '');
}

function clearMessage(targetID) {
    showMessage('', '', targetID);
}

function showError(message, targetID, buttonID) {
    showMessage(message, 'error', targetID);
    playErrorFeedback(getEl(buttonID));
}

function clearForm(formID) {
    const form = getEl(formID);
    form.reset();
    clearMessage(formID.replace('-form', '-message'));
    if (form.querySelector('.meter')) resetPasswordMeter(formID);
}

function showDashboard(user) {
    const username = user.user_metadata && user.user_metadata.username
        ? user.user_metadata.username
        : user.email;

    getEl('dashboard-welcome').textContent = 'Welcome, ' + username + '!';

    closeModal();
    switchScreen('dashboard', '.screen');
    refreshCarousel();
}
