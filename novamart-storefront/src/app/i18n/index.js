import { translations } from './translations';

export async function useTranslation(lng, ns, options) {

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
            language: 'en',
        },
    };
}
