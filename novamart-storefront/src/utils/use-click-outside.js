import { useEffect } from 'react';

export default function useOnClickOutside(ref, handler) {
    useEffect(() => {
        if (ref === null) return;
        const listener = (event) => {
            const el = ref?.current;
            if (!el || el.contains(event?.target || null)) {
                return;
            }
            handler(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
}
