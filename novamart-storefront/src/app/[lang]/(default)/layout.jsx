import DefaultLayout from '@layouts/default/layout';

export default async function Layout({ children, params }) {
    const { lang } = await params;
    return <DefaultLayout lang={lang}>{children}</DefaultLayout>;
}
