import CompleteOrderContent from './complete-order-content';

export const metadata = {
    title: 'Order',
};

export default async function Order({ params }) {
    const lang = 'en';
    return (
        <>
            <CompleteOrderContent lang={lang} />
        </>
    );
}
