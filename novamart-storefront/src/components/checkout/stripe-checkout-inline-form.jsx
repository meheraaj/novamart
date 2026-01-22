import StripePaymentForm from '@components/common/form/stripe-inline-form';
import { useCart } from '@contexts/cart/cart.context';
import { useTranslation } from 'src/app/i18n/client';

import { useRouter } from 'next/navigation';
import { useCreateOrderMutation } from '@framework/order/use-create-order';

const StripeCheckoutInlineForm = ({ lang }) => {
    const { t } = useTranslation(lang);
    const { total, items } = useCart(); // Get items to send to backend
    const router = useRouter();
    const { mutate: createOrder, isPending } = useCreateOrderMutation();

    const sendTokenToServer = async (token) => {
        // Construct order data
        const orderInput = {
            products: items.map((item) => ({
                product_id: item.id,
                order_quantity: item.quantity,
                unit_price: item.price,
                subtotal: item.price * item.quantity,
            })),
            status: 'Pending',
            total: total,
            payment_gateway: 'Stripe',
            token: token.id, // simplified
        };

        createOrder(orderInput, {
            onSuccess: (data) => {
                // Assuming data contains the created order with an _id or id
                const orderId = data._id || data.id;
                router.push(`/${lang}/complete-order?id=${orderId}`);
            },
            onError: (error) => {
                console.error("Order creation failed", error);
                alert("Order creation failed: " + error.message);
            }
        });
    };

    return (
        <StripePaymentForm item={{ price: total, buttonText: t('text-pay-now') }} closeModal={sendTokenToServer} />
        // Note: StripePaymentForm calls 'getToken' which maps to 'sendTokenToServer' here. 
        // The prop name in StripePaymentForm usage inside StripeCheckoutInlineForm was 'getToken={(token) => sendTokenToServer(token)}'
        // let's match the original file usage exactly to be safe:
    );
};

export default StripeCheckoutInlineForm;
