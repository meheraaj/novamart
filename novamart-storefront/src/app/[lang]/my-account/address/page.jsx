import AddressPageContent from './address-page-content';

export const metadata = {
    title: 'Address',
};

export default async function AccountDetailsPage({ params }) {
    const { lang } = await params;
    return <AddressPageContent lang={lang} />;
}
