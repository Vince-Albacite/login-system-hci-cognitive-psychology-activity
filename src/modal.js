// One reusable modal. The icon, message, and buttons are parameters.
function setModalIcon(iconName) {
    getEl('modal-icon-use').setAttribute('href', '#icon-' + iconName);
}

function setModalMessage(message) {
    getEl('modal-message').textContent = message;
}

function createModalButton(label, kind, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-' + kind;
    button.textContent = label;
    button.addEventListener('click', function () {
        closeModal();
        if (onClick) onClick();
    });
    return button;
}

function fillModalButtons(buttons) {
    const box = getEl('modal-buttons');
    box.innerHTML = '';
    buttons.forEach(function (spec) {
        box.appendChild(createModalButton(spec.label, spec.kind, spec.onClick));
    });
}

function openModal(iconName, message, buttons) {
    setModalIcon(iconName);
    setModalMessage(message);
    fillModalButtons(buttons);
    getEl('modal-dim').classList.add('on');
    getEl('modal').classList.add('on');
    getEl('modal-buttons').querySelector('.btn-primary').focus();
}

function closeModal() {
    const dim = getEl('modal-dim');
    const modal = getEl('modal');
    if (dim) dim.classList.remove('on');
    if (modal) modal.classList.remove('on');
}

function isModalOpen() {
    return getEl('modal').classList.contains('on');
}

function playModalSound(iconName) {
    if (iconName !== 'check') return;
    playSuccessSound();
    vibrateOnSuccess();
}

// One button. Pressing Enter also presses it (see keyboard.js).
function showNoticeModal(iconName, message, buttonLabel, onContinue) {
    openModal(iconName, message, [{ label: buttonLabel, kind: 'primary', onClick: onContinue }]);
    playModalSound(iconName);
}

// Two buttons. The highlighted NO is the safe choice and has the focus.
function showConfirmModal(iconName, message, onYes, onNo) {
    openModal(iconName, message, [
        { label: 'Yes', kind: 'secondary', onClick: onYes },
        { label: 'No', kind: 'primary', onClick: onNo }
    ]);
}
