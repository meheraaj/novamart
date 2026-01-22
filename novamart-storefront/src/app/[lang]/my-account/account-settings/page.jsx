import AccountDetails from '@components/my-account/account-details';

export const metadata = {
    title: 'Account Settings',
};

export default async function AccountDetailsPage({ params }) {
    const { lang } = await params;
    return <AccountDetails lang={lang} />;
}
