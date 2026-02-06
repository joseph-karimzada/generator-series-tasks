import { useEffect } from 'react';

export function useDocumentTitle(title) {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = title;

        // Cleanup: restore previous title when component unmounts
        return () => {
            document.title = prevTitle;
        };
    }, [title]);
}