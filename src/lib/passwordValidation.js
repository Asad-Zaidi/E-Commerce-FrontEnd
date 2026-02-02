/**
 * Password validation rules
 */

export const getPasswordRuleStatuses = (password) => {
    return {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}]/.test(password)
    };
};

export const validatePasswordRules = (password) => {
    const rules = getPasswordRuleStatuses(password);
    const errors = [];

    if (!rules.length) {
        errors.push('Password must be at least 8 characters long.');
    }
    if (!rules.uppercase) {
        errors.push('Password must contain at least one uppercase letter (A-Z).');
    }
    if (!rules.lowercase) {
        errors.push('Password must contain at least one lowercase letter (a-z).');
    }
    if (!rules.number) {
        errors.push('Password must contain at least one number (0-9).');
    }
    if (!rules.special) {
        errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{})');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};
