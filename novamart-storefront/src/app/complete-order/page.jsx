import CompleteOrderContent from './complete-order-content';

export const metadata = {
    title: 'Order',
};

export default async function Order({ params }) {
    const { lang } = await params;
    return (
        <>
            <CompleteOrderContent lang={lang} />
        </>
    );
}
