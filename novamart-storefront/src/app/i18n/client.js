'use client';

import { translations } from './translations';

export function useTranslation(lng, ns, options) {
    // Determine namespace. 
    // If first arg matches a namespace, use it (standard react-i18next convention used in some components).
    // If first arg is 'en' (or other lang code) and second is namespace (used in i18n/client usages), use second.

    let validNs = 'common'; // default

    if (translations[lng]) {
        validNs = lng;
    } else if (ns && translations[ns]) {
        validNs = ns;
    }

    const dictionary = translations[validNs] || {};

    return {
        t: (key) => {
            if (typeof key === 'string' && key.includes(':')) {
                const [namespace, realKey] = key.split(':');
                if (translations[namespace]) {
                    return translations[namespace][realKey] || key;
                }
            }
            return dictionary[key] || key;
        },
        i18n: {
            changeLanguage: () => { },
            language: 'en',
        },
    };
}
