'use client';

import Link from 'next/link';
import usePrice from '@framework/product/use-price';
import cn from 'classnames';
import { useCart } from '@contexts/cart/cart.context';
import Text from '@components/ui/text';
import Button from '@components/ui/button';
import { CheckoutItem } from '@components/checkout/checkout-card-item';
import { CheckoutCardFooterItem } from './checkout-card-footer-item';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@utils/routes';
import { useTranslation } from 'src/app/i18n/client';
import { useIsMounted } from '@utils/use-is-mounted';
import { useEffect, useState } from 'react';
import SearchResultLoader from '@components/ui/loaders/search-result-loader';
import { useCheckoutMutation } from '@framework/checkout/use-checkout';
import { useAtom } from 'jotai';
import { checkoutAtom } from '@contexts/checkout.atom';

const CheckoutCard = ({ lang }) => {
    const { t } = useTranslation(lang, 'common');
    const router = useRouter();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);
    const [checkoutState] = useAtom(checkoutAtom);
    const { mutate: createOrder, isPending } = useCheckoutMutation();

    const { items, total, isEmpty } = useCart();
    const { price: subtotal } = usePrice({
        amount: total,
        currencyCode: 'USD',
    });

    function orderHeader() {
        if (isEmpty) return;
        
        const orderInput = {
            products: items.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price,
                name: item.name,
                image: item.image
            })),
            total: total,
            status: { name: 'Pending', color: 'yellow' },
            shipping_address: checkoutState.shippingAddress,
            // Add other fields if needed from checkoutState
        };

        createOrder(orderInput, {
            onSuccess: (data) => {
                console.log("Order created successfully, data:", data);
                if (data && data.id) {
                    router.push(`${ROUTES.ORDER}?id=${data.id}`);
                } else {
                    console.error("Order created but no ID returned:", data);
                }
            },
            onError: (error) => {
                console.error("Order creation failed:", error);
            }
        });
    }
    const checkoutFooter = [
        {
            id: 1,
            name: t('text-sub-total'),
            price: subtotal,
        },
        {
            id: 2,
            name: t('text-shipping'),
            price: '$0',
        },
        {
            id: 3,
            name: t('text-total'),
            price: subtotal,
        },
    ];
    const mounted = useIsMounted();
    return (
        <>
            <div className="px-4 pt-4 border rounded-md border-border-base text-brand-light xl:py-6 xl:px-7">
                <div className="flex pb-2 text-sm font-semibold rounded-md text-heading">
                    <span className="font-medium text-15px text-brand-dark">
                        {t('text-product')}
                    </span>
                    <span className="font-medium ltr:ml-auto rtl:mr-auto shrink-0 text-15px text-brand-dark">
                        {t('text-sub-total')}
                    </span>
                </div>
                {isLoading ? (
                    <div className="w-full">
                        <SearchResultLoader uniqueKey={`product-key`} />
                    </div>
                ) : !isEmpty && mounted ? (
                    items.map((item, index) => (
                        <CheckoutItem
                            item={item}
                            key={`checkout-item-${item.id || index}`}
                        />
                    ))
                ) : (
                    <p className="py-4 text-brand-danger text-opacity-70">
                        {t('text-empty-cart')}
                    </p>
                )}
                {mounted &&
                    checkoutFooter.map((item) => (
                        <CheckoutCardFooterItem item={item} key={item.id} />
                    ))}
                <Button
                    variant="formButton"
                    className={cn(
                        'w-full mt-8 mb-5 rounded font-semibold px-4 py-3 transition-all',
                        mounted && isEmpty
                            ? 'opacity-40 cursor-not-allowed'
                            : '!bg-brand !text-brand-light',
                    )}
                    onClick={orderHeader}
                    loading={isPending}
                    disabled={isPending}
                >
                    {t('button-order-now')}
                </Button>
            </div>
            <Text className="mt-8">
                {t('text-by-placing-your-order')}{' '}
                <Link
                    href={`${ROUTES.TERMS}`}
                    className="font-medium underline text-brand"
                >
                    {t('text-terms-of-service')}{' '}
                </Link>
                {t('text-and')}{' '}
                <Link
                    href={`${ROUTES.PRIVACY}`}
                    className="font-medium underline text-brand"
                >
                    {t('text-privacy-policy')}
                </Link>
                . {t('text-credit-debit')}
            </Text>
            <Text className="mt-4">{t('text-bag-fee')}</Text>
        </>
    );
};

export default CheckoutCard;
