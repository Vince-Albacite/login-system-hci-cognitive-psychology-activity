const SCREEN_FILES = ['icons', 'loading', 'login-registration', 'change-password', 'dashboard', 'modal'];

// Password rules. PASSWORD_MIN_LENGTH must equal the minimum length set in
// Supabase Dashboard > Authentication > Sign In / Providers > Email > Password requirements.
const PASSWORD_MIN_LENGTH = 8;

// Audio and haptics.
const AUDIO_ENABLED = true;
const AUDIO_VOLUME = 0.15;
const VIBRATE_SUCCESS_MS = 200;
const VIBRATE_ERROR_PATTERN = [100, 50, 100];
const LOADING_TUNE_REPEAT_MS = 1200;

// Loading screen timing.
const LOADING_MIN_MS = 1800;
const LOADING_CREEP_PERCENT = 85;
const LOADING_FINISH_MS = 300;
const LOADING_LOADED_HOLD_MS = 900;
const INITIAL_LOADING_MESSAGE = 'CogPsych Concepts: Login/Registration';

const SWIPE_MIN_PX = 40;

let supabaseClient = null;
let authLinkType = '';
let authLinkFailed = false;

let login_inputs = {
    email: '',
    password: ''
};

let registration_inputs = {
    username: '',
    email: '',
    password: '',
    confirm_password: ''
};

let change_password_inputs = {
    password: '',
    confirm_password: ''
};
