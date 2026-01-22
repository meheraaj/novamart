import Notifications from '@components/my-account/notification';

export const metadata = {
    title: 'Notification',
};

export default async function Notification({ params }) {
    const { lang } = await params;
    return <Notifications lang={lang} />;
}
