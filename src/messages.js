// Short, readable replacements for the long messages Supabase returns.
const AUTH_ERROR_MESSAGES = {
    invalid_credentials: 'Incorrect email or password.',
    email_not_confirmed: 'Please confirm your email first. Check your inbox.',
    weak_password: 'That password is too weak or too common. Please choose another.',
    email_exists: 'An account with this email already exists.',
    user_already_exists: 'An account with this email already exists.',
    over_email_send_rate_limit: 'Too many emails sent. Please wait a few minutes.',
    over_request_rate_limit: 'Too many attempts. Please wait a moment.'
};

function getFriendlyAuthError(error, fallbackMessage) {
    if (error && error.name === 'AuthSessionMissingError') {
        return 'This reset link has expired. Request a new one from the login page.';
    }
    return (error && AUTH_ERROR_MESSAGES[error.code]) || fallbackMessage;
}

function createCodedError(code) {
    const error = new Error(code);
    error.code = code;
    return error;
}
