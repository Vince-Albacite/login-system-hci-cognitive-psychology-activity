// Simple audio engine. Every sound is a short oscillator tone, so no audio files are loaded.
let audioContext = null;
let loadingTuneTimer = null;

function getAudioContext() {
    if (!AUDIO_ENABLED) return null;
    if (!audioContext) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return null;
        audioContext = new AudioContextClass();
    }
    return audioContext;
}

// Browsers only allow sound after the first tap or key press.
function unlockAudio() {
    const context = getAudioContext();
    if (context && context.state === 'suspended') context.resume();
}

function playTone(frequency, startDelaySeconds, durationSeconds, waveType) {
    const context = getAudioContext();
    if (!context) return;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const startTime = context.currentTime + startDelaySeconds;

    oscillator.type = waveType;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(AUDIO_VOLUME, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + durationSeconds);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + durationSeconds);
}

// Each note is [frequency, startDelaySeconds, durationSeconds].
function playNotes(notes, waveType) {
    notes.forEach(function (note) {
        playTone(note[0], note[1], note[2], waveType);
    });
}

function playClickSound() {
    playNotes([[800, 0, 0.04]], 'sine');
}

function playSuccessSound() {
    playNotes([[523, 0, 0.12], [659, 0.1, 0.12], [784, 0.2, 0.12], [1047, 0.3, 0.25]], 'triangle');
}

function playLogoutSound() {
    playNotes([[784, 0, 0.12], [659, 0.1, 0.12], [523, 0.2, 0.25]], 'triangle');
}

function playErrorSound() {
    playNotes([[220, 0, 0.12], [160, 0.12, 0.2]], 'sawtooth');
}

function playCarouselSound() {
    playNotes([[520, 0, 0.06]], 'triangle');
}

function playLoadingTuneOnce() {
    playNotes([[392, 0, 0.1], [523, 0.15, 0.1], [659, 0.3, 0.1], [523, 0.45, 0.1]], 'sine');
}

function startLoadingTune() {
    stopLoadingTune();
    playLoadingTuneOnce();
    loadingTuneTimer = setInterval(playLoadingTuneOnce, LOADING_TUNE_REPEAT_MS);
}

function stopLoadingTune() {
    clearInterval(loadingTuneTimer);
    loadingTuneTimer = null;
}
