import OrdersPageContent from './orders-page-content';

export const metadata = {
    title: 'Orders',
};

export default async function OrdersTablePage({ params }) {
    const lang = 'en';
    return <OrdersPageContent lang={lang} />;
}
