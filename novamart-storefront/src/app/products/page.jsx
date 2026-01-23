import PageHeroSection from '@components/ui/page-hero-section';
import ProductsPageContent from './products-page-content';
import { Suspense } from 'react';

export const metadata = {
    title: 'Products',
};

function SearchBarFallback() {
    return <>Loading...</>;
}

export default async function Page({ params }) {
    const lang = 'en';

    return (
        <>
            <PageHeroSection heroTitle="text-all-grocery-items" lang={lang} />
            <Suspense fallback={<SearchBarFallback />}>
                <ProductsPageContent lang={lang} />
            </Suspense>
        </>
    );
}
