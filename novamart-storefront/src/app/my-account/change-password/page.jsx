import ChangePassword from '@components/my-account/change-password';

export const metadata = {
    title: 'Change Password',
};

export default async function ChangePasswordPage({ params }) {
    const lang = 'en';
    return <ChangePassword lang={lang} />;
}
