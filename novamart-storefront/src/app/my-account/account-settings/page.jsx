import AccountDetails from '@components/my-account/account-details';

export const metadata = {
    title: 'Account Settings',
};

export default async function AccountDetailsPage({ params }) {
    const lang = 'en';
    return <AccountDetails lang={lang} />;
}
