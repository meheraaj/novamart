import { useOrderQuery } from '@framework/order/get-order';
import usePrice from '@framework/product/use-price';
import { useRouter, useSearchParams } from 'next/navigation';

import Heading from '@components/ui/heading';
import { useTranslation } from 'src/app/i18n/client';
import Image from '@components/ui/image';
import { productPlaceholder } from '@assets/placeholders';

const OrderItemCard = ({ product }) => {
  const { price: itemTotal } = usePrice({
    amount: product.price * product.quantity,
    currencyCode: 'BDT',
  });
  
  return (
    <tr
      className="font-normal border-b border-border-base last:border-b-0"
      key={product.id}
    >
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-md border border-border-base">
            <Image
              src={product.image?.thumbnail || product.image || productPlaceholder}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-brand-dark font-medium">{product.name}</span>
            <span className="text-xs text-brand-muted">Qty: {product.quantity}</span>
          </div>
        </div>
      </td>
      <td className="p-4">{itemTotal}</td>
    </tr>
  );
};

const OrderDetails = ({
  className = 'pt-10 lg:pt-12',
  lang,
}) => {
  const { t } = useTranslation(lang, 'common');
  
  // Use dynamic ID passed from parent or context. 
  // Since OrderInformation already fetches data, we should probably pass 'order' as a prop instead of refetching.
  // But for now, let's use the ID from the URL if we want to refetch, or better, accept 'order' prop.
  // Given the current structure, OrderInformation passes nothing. Let's modify OrderInformation to pass 'data' to OrderDetails.
  
  // However, to minimize changes, let's just use the ID from URL here too.
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const id = (idParam && idParam !== 'null' && idParam !== 'undefined') ? idParam : null;

  const { data: order, isLoading } = useOrderQuery(id, {
    enabled: !!id
  });

  const { price: subtotal } = usePrice(
    order && {
      amount: order.total,
      currencyCode: 'BDT',
    }
  );

  const { price: total } = usePrice(
    order && {
      amount: order.shipping_fee
        ? order.total + order.shipping_fee
        : order.total,
      currencyCode: 'BDT',
    }
  );

  const { price: shipping } = usePrice(
    order && {
      amount: order.shipping_fee,
      currencyCode: 'BDT',
    }
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className={className}>
      <Heading variant="heading" className="mb-6 xl:mb-7">
        {t('text-order-details')}:
      </Heading>
      <table className="w-full text-sm font-semibold text-brand-dark lg:text-base">
        <thead>
          <tr>
            <th className="w-1/2 p-4 bg-fill-secondary ltr:text-left rtl:text-right ltr:first:rounded-tl-md rtl:first:rounded-tr-md">
              {t('text-product')}
            </th>
            <th className="w-1/2 p-4 bg-fill-secondary ltr:text-left rtl:text-right ltr:last:rounded-tr-md rtl:last:rounded-tl-md">
              {t('text-total')}
            </th>
          </tr>
        </thead>
        <tbody>
          {order?.products?.map((product, index) => (
            <OrderItemCard key={index} product={product} />
          ))}
        </tbody>
        <tfoot>
          <tr className="odd:bg-fill-secondary">
            <td className="p-4 italic">{t('text-sub-total')}:</td>
            <td className="p-4">{subtotal}</td>
          </tr>
          <tr className="odd:bg-fill-secondary">
            <td className="p-4 italic">{t('text-shipping')}:</td>
            <td className="p-4">
              {shipping}
              <span className="text-[13px] font-normal ltr:pl-1.5 rtl:pr-1.5 inline-block">
                via Flat rate
              </span>
            </td>
          </tr>
          <tr className="odd:bg-fill-secondary">
            <td className="p-4 italic">{t('text-payment-method')}:</td>
            <td className="p-4">{order?.payment_gateway || 'Cash on Delivery'}</td>
          </tr>
          <tr className="odd:bg-fill-secondary">
            <td className="p-4 italic">{t('text-total')}:</td>
            <td className="p-4">{total}</td>
          </tr>
          <tr className="odd:bg-fill-secondary">
            <td className="p-4 italic">{t('text-note')}:</td>
            <td className="p-4">{t('text-new-order')}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default OrderDetails;
