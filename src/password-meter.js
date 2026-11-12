const METER_LABELS = { idle: 'Strength', weak: 'Weak', moderate: 'Moderate', strong: 'Strong' };

function getPasswordInput(formID) {
    const form = getEl(formID);
    return form ? form.querySelector('.password-input') : null;
}

function applyMeterLevel(formID, strength) {
    const meter = getEl(formID).querySelector('.meter');
    meter.className = 'meter ' + strength.level;
    meter.querySelector('.meter-label').textContent = METER_LABELS[strength.level];
}

// Shows what is missing while typing. No sound or shake until the user presses the button.
function showLivePasswordHint(formID, strength) {
    const messageID = formID.replace('-form', '-message');
    const isIncomplete = strength.level === 'weak' || strength.level === 'moderate';
    showMessage(isIncomplete ? strength.message : '', 'error', messageID);
}

function updatePasswordMeter(formID) {
    const strength = checkPasswordStrength(getPasswordInput(formID).value);
    applyMeterLevel(formID, strength);
    showLivePasswordHint(formID, strength);
}

function resetPasswordMeter(formID) {
    applyMeterLevel(formID, checkPasswordStrength(''));
}

function listenForPasswordTyping(formID) {
    const input = getPasswordInput(formID);
    if (!input) return;

    input.addEventListener('input', function () {
        updatePasswordMeter(formID);
    });
}

function togglePasswordVisibility(formID) {
    const inputs = getEl(formID).querySelectorAll('.password-input');
    const willShow = inputs[0].type === 'password';

    inputs.forEach(function (input) {
        input.type = willShow ? 'text' : 'password';
    });

    getEl(formID).querySelector('.eye-toggle use').setAttribute('href', willShow ? '#icon-eye' : '#icon-eye-off');
    getEl(formID).querySelector('.eye-toggle').setAttribute('aria-label', willShow ? 'Hide password' : 'Show password');
}
