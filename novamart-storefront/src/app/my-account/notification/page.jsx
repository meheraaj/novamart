import Notifications from '@components/my-account/notification';

export const metadata = {
    title: 'Notification',
};

export default async function Notification({ params }) {
    const lang = 'en';
    return <Notifications lang={lang} />;
}
