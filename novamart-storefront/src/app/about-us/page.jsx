import DownloadApps from '@components/common/download-apps';
import AboutPageContent from './about-page-content';

export const metadata = {
    title: 'About Us',
};

export default async function Page({ params }) {
    const { lang } = await params;
    return (
        <>
            <AboutPageContent lang={lang} />
            <DownloadApps lang={lang} />
        </>
    );
}
