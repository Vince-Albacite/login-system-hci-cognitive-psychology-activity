// Read before the Supabase client starts, because the client removes the link data from the address bar.
function readAuthLink() {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    authLinkType = params.get('type') || '';
    authLinkFailed = params.has('error');
}

function listenForInteractions() {
    listenForEnterKeys();
    listenForClicks();
    listenForPasswordTyping('registration-form');
    listenForPasswordTyping('change-password-form');
    listenForSwipe();
    listenForCarouselKeys();
}

function showExpiredLinkNotice() {
    showLoginSection();
    showNoticeModal('exclamation', 'This link is invalid or has expired. Please request a new one.', 'Continue');
}

async function showVerifiedAccountNotice() {
    await signOutQuietly();
    showLoginSection();
    showNoticeModal('check', 'Good Job! Your account has been created successfully.', 'Continue');
}

function routeAfterInitialLoading(session) {
    if (authLinkFailed) return showExpiredLinkNotice();
    if (authLinkType === 'recovery' && session) return showChangePasswordScreen();
    if (authLinkType === 'signup' && session) return showVerifiedAccountNotice();
    if (session) return showDashboard(session.user);
    showLoginSection();
}

async function startInitialLoading() {
    let session = null;

    try {
        session = await playLoadingScreen(INITIAL_LOADING_MESSAGE, getCurrentSession, INITIAL_LOADING_MESSAGE);
    } catch (error) {
        console.error('Session check failed:', error);
    }

    routeAfterInitialLoading(session);
}

function initializeApp() {
    readAuthLink();

    try {
        initializeClients();
    } catch (error) {
        console.error(error);
        showStartupError(error.message);
        return;
    }

    addCognitiveConcepts();
    listenForInteractions();
    startInitialLoading();
}
