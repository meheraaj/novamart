import Legal from '@components/my-account/notice';

export const metadata = {
    title: 'Notice',
};

export default async function LegalNotice({ params }) {
    const { lang } = await params;
    return <Legal lang={lang} />;
}
