import Help from '@components/my-account/help';

export const metadata = {
    title: 'Help',
};

export default async function HelpCenter({ params }) {
    const { lang } = await params;
    return <Help lang={lang} />;
}
