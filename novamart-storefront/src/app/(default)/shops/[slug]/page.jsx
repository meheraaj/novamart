import ShopsSingleDetails from '@components/shops/shops-single-details';
import DownloadApps from '@components/common/download-apps';

export default async function ShopDetailsPage({ params }) {
    const { lang } = await params;
    return (
        <>
            <ShopsSingleDetails lang={lang} />
            <DownloadApps lang={lang} />
        </>
    );
}
