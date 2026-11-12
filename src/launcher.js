function fetchScreenHtml(name) {
    return fetch('screens/' + name + '.html').then(function (response) {
        if (!response.ok) throw new Error('Missing screen: ' + name);
        return response.text();
    });
}

function insertScreens(parts) {
    const app = getEl('app');
    app.innerHTML = '';

    parts.forEach(function (html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
                template.content.querySelectorAll('script').forEach(function (s) {
            s.remove();
        });
        app.appendChild(template.content);
    });
    
}

function showLaunchError(error) {
    console.error('Launch failed:', error);
    getEl('app').textContent =
        'The app could not start: ' + error.message + ' (see the browser console for details).';
}

function launchApp() {
    Promise.all(SCREEN_FILES.map(fetchScreenHtml))
        .then(function (parts) {
            insertScreens(parts);
            initializeApp();
        })
        .catch(showLaunchError);
}

launchApp();
