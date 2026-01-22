'use client';

import i18next from 'i18next';
import {
    initReactI18next,
    useTranslation as useTranslationOrg,
} from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { getOptions } from './settings';

const runsOnServerSide = typeof window === 'undefined';

// Initialize i18next with hardcoded English
i18next
    .use(initReactI18next)
    .use(
        resourcesToBackend(
            (language, namespace) =>
                import(`./locales/en/${namespace}.json`), // Force import from 'en'
        ),
    )
    .init({
        ...getOptions(),
        lng: 'en', // Force language to 'en'
        detection: undefined,
        preload: runsOnServerSide ? ['en'] : [],
    });

export function useTranslation(lang, ns, options) {
    // We ignore the `lang` argument and use the hardcoded 'en'
    return useTranslationOrg(ns, options);
}
