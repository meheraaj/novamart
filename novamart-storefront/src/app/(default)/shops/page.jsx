import ShopsPageContent from '@components/shops/shops-page-content';
import DownloadApps from '@components/common/download-apps';
import PageHeroSection from '@components/ui/page-hero-section';

export const metadata = {
    title: 'Shops',
};

export default async function Page({ params }) {
    const lang = 'en';
    return (
        <>
            <PageHeroSection
                heroTitle="text-shop-page"
                backgroundThumbnail="/assets/images/shop-page-hero-bg.jpg"
                mobileBackgroundThumbnail="/assets/images/shop-page-hero-mobile-bg.png"
                variant="white"
                lang={lang}
            />
            <ShopsPageContent lang={lang} />
            <DownloadApps lang={lang} />
        </>
    );
}
