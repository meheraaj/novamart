import { Suspense } from 'react';
import DownloadApps from '@components/common/download-apps';
import Divider from '@components/ui/divider';
import SearchPageContent from './search-page-content';

export const metadata = {
    title: 'Search',
};

function SearchBarFallback() {
    return <>Loading...</>;
}

export default async function Page({ params }) {
    const lang = 'en';

    return (
        <>
            <Divider />
            <Suspense fallback={<SearchBarFallback />}>
                <SearchPageContent lang={lang} />
            </Suspense>
            <DownloadApps lang={lang} />
        </>
    );
}
