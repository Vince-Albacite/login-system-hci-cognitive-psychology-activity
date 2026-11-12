// Initialize third-party clients.
// CDN scripts are loaded in index.html before this file.
function initializeClients() {
    if (!window.supabase || !window.emailjs) {
        throw new Error('Supabase or EmailJS library failed to load.');
    }

    if (
        SUPABASE_URL === 'YOUR_SUPABASE_PROJECT_URL' ||
        SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY'
    ) {
        throw new Error('Add your Supabase URL and anon key in src/config.js.');
    }

    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

    if (EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
        window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }
}

// Send a notification to the administrator.
// Set the recipient in the EmailJS template, or use {{to_email}} there.
async function sendAdminNotification(username, email) {
    if (
        EMAILJS_PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY' ||
        EMAILJS_SERVICE_ID === 'YOUR_EMAILJS_SERVICE_ID' ||
        EMAILJS_TEMPLATE_ID === 'YOUR_EMAILJS_TEMPLATE_ID' ||
        ADMIN_EMAIL === 'YOUR_ADMIN_GMAIL_ADDRESS'
    ) {
        console.warn('EmailJS placeholders have not been configured. Notification skipped.');
        return false;
    }

    await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
            to_email: ADMIN_EMAIL,
            username: username,
            registered_email: email
        }
    );

    return true;
}
