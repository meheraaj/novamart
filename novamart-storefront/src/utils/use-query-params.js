'use client';

import { atom, useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function createQueryString(queryObj) {
    let path = [];
    for (const [key, value] of Object.entries(queryObj)) {
        path.push(`${key}=${value}`);
    }
    return path.join('&').toString();
}

const queryAtom = atom('');

export default function useQueryParam(pathname = '/') {
    const [query, setQuery] = useAtom(queryAtom);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const l = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(l);
    }, [query]);

    const clearQueryParam = (key) => {
        if (typeof window === 'undefined') return; // Safety for SSR
        let url = new URL(location.href);
        key.forEach((item) => url.searchParams.delete(item));
        setQuery(url.search);
        router.push(`${pathname}${url.search}`);
    };

    const setQueryparams = (data) => {
        let queryString = '';
        if (typeof data !== 'string') {
            queryString = createQueryString(data);
        }
        setQuery(queryString);
    };

    // --- FIXED GETPARAMS FUNCTION ---
    function getParams(url) {
        const params = {};
        
        // If no URL is provided or it's on the server, try to use window.location
        // otherwise, return empty params to prevent crashing
        const targetUrl = url || (typeof window !== 'undefined' ? window.location.href : null);
        
        if (!targetUrl || targetUrl === 'undefined') return params;

        try {
            // URL constructor requires a base (like http://a.com) if the input is relative
            const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
            const parsedUrl = new URL(targetUrl, base);

            parsedUrl.searchParams.forEach(function (val, key) {
                if (params[key] !== undefined) {
                    if (!Array.isArray(params[key])) {
                        params[key] = [params[key]];
                    }
                    params[key].push(val);
                } else {
                    params[key] = val;
                }
            });
        } catch (error) {
            console.error("useQueryParam: Invalid URL provided", targetUrl);
        }
        
        return params;
    }

    const updateQueryparams = (key, value) => {
        if (typeof window === 'undefined') return;
        if (!value) {
            clearQueryParam([key]);
            return;
        }
        const url = new URL(location.href);
        url.searchParams.set(key, value.toString());
        setQuery(url.search);
        router.push(`${pathname}${url.search}`);
    };

    return {
        query,
        loading,
        getParams,
        setQueryparams,
        updateQueryparams,
        clearQueryParam,
    };
}
