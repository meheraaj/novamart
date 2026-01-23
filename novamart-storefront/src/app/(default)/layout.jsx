import DefaultLayout from '../components/layouts/default/layout';

export default async function Layout({ children, params }) {
    const lang = 'en';
    return <DefaultLayout lang={lang}>{children}</DefaultLayout>;
}
