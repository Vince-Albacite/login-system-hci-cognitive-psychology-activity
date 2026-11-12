// Reusable loading screen. The messages are parameters.
function setLoadingMessage(message) {
    getEl('loading-text').textContent = message;
}

function setLoadingProgress(percent, durationMs) {
    const fill = getEl('loading-fill');
    fill.style.transitionDuration = durationMs + 'ms';
    fill.style.width = percent + '%';
}

function resetLoadingProgress() {
    setLoadingProgress(0, 0);
    void getEl('loading-fill').offsetWidth;
}

function waitMs(milliseconds) {
    return new Promise(function (resolve) {
        setTimeout(resolve, milliseconds);
    });
}

function openLoadingScreen(message) {
    closeModal();
    setLoadingMessage(message);
    switchScreen('loading-screen', '.screen');
    resetLoadingProgress();
    startLoadingTune();
    setLoadingProgress(LOADING_CREEP_PERCENT, LOADING_MIN_MS);
}

async function finishLoadingScreen(loadedMessage, playLoadedSound) {
    stopLoadingTune();
    setLoadingMessage(loadedMessage);
    setLoadingProgress(100, LOADING_FINISH_MS);
    if (playLoadedSound) playLoadedSound();
    await waitMs(LOADING_LOADED_HOLD_MS);
}

// Shows the loading screen while task() runs, then shows the loaded message.
// Returns the result of task(). If task() fails, the error is rethrown for the caller to show.
async function playLoadingScreen(loadingMessage, task, loadedMessage, playLoadedSound) {
    openLoadingScreen(loadingMessage);

    try {
        const results = await Promise.all([task(), waitMs(LOADING_MIN_MS)]);
        await finishLoadingScreen(loadedMessage, playLoadedSound);
        return results[0];
    } catch (error) {
        stopLoadingTune();
        throw error;
    }
}

function showStartupError(message) {
    stopLoadingTune();
    setLoadingMessage(message);
    setLoadingProgress(0, 0);
}