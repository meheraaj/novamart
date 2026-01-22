import PageHeroSection from '@components/ui/page-hero-section';
import DownloadApps from '@components/common/download-apps';
import PrivacyPageContent from './privacy-page-content';

export const metadata = {
    title: 'Privacy',
};

export default async function Page({ params }) {
    const { lang } = await params;
    return (
        <>
            <PageHeroSection heroTitle="text-page-privacy-policy" lang={lang} />
            <PrivacyPageContent lang={lang} />
            <DownloadApps lang={lang} />
        </>
    );
}
