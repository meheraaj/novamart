export function getDirection(locale) {
    if (!locale) return 'ltr';
    const rtlLanguages = ['ar', 'he'];
    return rtlLanguages.includes(locale) ? 'rtl' : 'ltr';
}
