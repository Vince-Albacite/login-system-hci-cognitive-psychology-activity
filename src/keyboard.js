// Enter key stands in for the button on screens that only have one button.
function isPressableTarget(event) {
    return !!event.target.closest('button, a');
}

function listenForEnter(formID, handler) {
   /* getEl(formID).addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' || isModalOpen() || isPressableTarget(event)) return;
        event.preventDefault();
        handler();
    });*/

    const form = getEl(formID);
    if (!form) {
        console.warn('Missing form in DOM:', formID);
        playErrorFeedback(form);
        return;
    }

    form.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' || isModalOpen() || isPressableTarget(event)) return;
        event.preventDefault();
        handler();
    });
}

// Modals with two buttons (Yes/No) ignore Enter on purpose, so nothing is confirmed by accident.
function pressSoleModalButton(event) {
    if (event.key !== 'Enter' || !isModalOpen() || isPressableTarget(event)) return;

    const buttons = getEl('modal-buttons').querySelectorAll('.btn');
    if (buttons.length !== 1) return;

    event.preventDefault();
    buttons[0].click();
}

function listenForEnterKeys() {
    listenForEnter('login-form', handleLogin);
    listenForEnter('registration-form', handleRegistration);
    listenForEnter('change-password-form', handleChangePassword);
    document.addEventListener('keydown', pressSoleModalButton);
}

function playClickSoundOnPress(event) {
    if (event.target.closest('button, a')) playClickSound();
}

function listenForClicks() {
    document.addEventListener('pointerdown', unlockAudio);
    document.addEventListener('keydown', unlockAudio);
    document.addEventListener('click', playClickSoundOnPress);
}
