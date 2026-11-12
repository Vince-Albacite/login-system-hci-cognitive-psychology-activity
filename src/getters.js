function getEl(htmlID) {
    return document.getElementById(htmlID);
}

// Read fields from the requested form itself. This avoids collisions where
// separate screens use the same field names.
function getInputs(formID) {
    const form = getEl(formID);
    if (!form) return null;

    const inputs = form.querySelectorAll('input');
    const values = {};

    inputs.forEach(function (input) {
        values[input.name] = input.value;
    });

    finalizeInputs(values);

    if (formID === 'login-form') {
        login_inputs = {
            email: values.email || '',
            password: values.password || ''
        };
        return login_inputs;
    }

    if (formID === 'registration-form') {
        registration_inputs = {
            username: values.username || '',
            email: values.email || '',
            password: values.password || '',
            confirm_password: values['confirm-password'] || ''
        };
        return registration_inputs;
    }

    if (formID === 'change-password-form') {
        change_password_inputs = {
            password: values.password || '',
            confirm_password: values['confirm-password'] || ''
        };
        return change_password_inputs;
    }

    return null;
}
