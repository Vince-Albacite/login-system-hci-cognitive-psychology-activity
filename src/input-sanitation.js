function cleanUsername(username) {
    return username.trim();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hasMinimumLength(password) {
    return password.length >= PASSWORD_MIN_LENGTH;
}

function hasLowercase(password) {
    return /[a-z]/.test(password);
}

function hasUppercase(password) {
    return /[A-Z]/.test(password);
}

function hasNumber(password) {
    return /[0-9]/.test(password);
}

function hasSymbol(password) {
    return /[^A-Za-z0-9\s]/.test(password);
}

// Keep these rules in step with the Supabase password requirements (see config.js).
const PASSWORD_RULES = [
    { test: hasMinimumLength, tip: 'at least ' + PASSWORD_MIN_LENGTH + ' characters' },
    { test: hasLowercase, tip: 'a lowercase letter' },
    { test: hasUppercase, tip: 'an uppercase letter' },
    { test: hasNumber, tip: 'a number' },
    { test: hasSymbol, tip: 'a symbol (i.e. !@#$%)' }
];

// Weak: 0-2 rules met. Moderate: 3-4 rules met. Strong: every rule met.
function getStrengthLevel(passwordInput, passedCount) {
    if (passwordInput.length === 0) return 'idle';
    if (passedCount === PASSWORD_RULES.length) return 'strong';
    if (passedCount >= PASSWORD_RULES.length - 2) return 'moderate';
    return 'weak';
}

function checkPasswordStrength(passwordInput) {
    const missingTips = PASSWORD_RULES
        .filter(function (rule) { return !rule.test(passwordInput); })
        .map(function (rule) { return rule.tip; });
    const passedCount = PASSWORD_RULES.length - missingTips.length;

    return {
        level: getStrengthLevel(passwordInput, passedCount),
        isAcceptable: missingTips.length === 0,
        message: missingTips.length > 0 ? 'Password needs ' + missingTips[0] + '.' : ''
    };
}

// Do not trim passwords. Whitespace may be part of a user's actual password.
function finalizeInputs(inputs) {
    for (let key in inputs) {
        switch (key) {
            case 'username':
                inputs[key] = inputs[key].trim();
                break;
            case 'email':
                inputs[key] = inputs[key].trim().toLowerCase();
                break;
        }
    }
}
