import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { getOptions } from './settings';

const initI18next = async (lang, ns) => {
    const i18nInstance = createInstance();
    await i18nInstance
        .use(initReactI18next)
        .use(
            resourcesToBackend(
                (language, namespace) =>
                    import(`./locales/en/${namespace}.json`), // Force 'en'
            ),
        )
        .init(getOptions('en', ns)); // Force 'en'
    return i18nInstance;
};

export async function useTranslation(lang, ns, options) {
    const i18nextInstance = await initI18next('en', ns); // Force 'en'
    return {
        //@ts-ignore
        t: i18nextInstance.getFixedT(
            'en', // Force 'en'
            Array.isArray(ns) ? ns[0] : ns,
            //@ts-ignore
            options?.keyPrefix,
        ),
        i18n: i18nextInstance,
    };
}
