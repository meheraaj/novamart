import AddressPageContent from './address-page-content';

export const metadata = {
    title: 'Address',
};

export default async function AccountDetailsPage({ params }) {
    const lang = 'en';
    return <AddressPageContent lang={lang} />;
}
