import PageHeroSection from '@components/ui/page-hero-section';
import DownloadApps from '@components/common/download-apps';
import TermsPageContent from './terms-page-content';

export const metadata = {
    title: 'Terms',
};

export default async function Page({ params }) {
    const lang = 'en';
    return (
        <>
            <PageHeroSection heroTitle="text-page-terms-condition" lang={lang} />
            <TermsPageContent lang={lang} />
            <DownloadApps lang={lang} />
        </>
    );
}
