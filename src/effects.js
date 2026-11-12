// Shake and vibration effects.
function shakeElement(element) {
    if (!element) return;
    element.classList.remove('shake');
    void element.offsetWidth;
    element.classList.add('shake');
}

function vibrateOnSuccess() {
    if ('vibrate' in navigator) {
        navigator.vibrate(VIBRATE_SUCCESS_MS);
    }
}

function vibrateOnError() {
    if ('vibrate' in navigator) {
        navigator.vibrate(VIBRATE_ERROR_PATTERN);
    }
}

// An error is always shown with sound, vibration, and a shake of the button.
function playErrorFeedback(buttonElement) {
    playErrorSound();
    vibrateOnError();
    shakeElement(buttonElement);
}
