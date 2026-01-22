'use client';

import OrderInformation from '@components/order/order-information';
import Container from '@components/ui/container';
import Divider from '@components/ui/divider';
import { useCart } from '@contexts/cart/cart.context';
import { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

export default function CompleteOrderContent({ lang }) {
    const { resetCart } = useCart();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
        resetCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <Divider />
            <Container>
                <OrderInformation lang={lang} id={id} />
            </Container>
            <Divider />
        </>
    );
}
