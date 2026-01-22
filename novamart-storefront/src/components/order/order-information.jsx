'use client';

import { IoCheckmarkCircle } from 'react-icons/io5';
import OrderDetails from '@components/order/order-details';
import { useOrderQuery } from '@framework/order/get-order';
import usePrice from '@framework/product/use-price';
import { useTranslation } from 'src/app/i18n/client';
import { useSearchParams } from 'next/navigation';

export default function OrderInformation({ lang }) {
  const { t } = useTranslation(lang, 'common');
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const id = (idParam && idParam !== 'null' && idParam !== 'undefined') ? idParam : null;

  const { data, isLoading, isError, error } = useOrderQuery(id, {
    enabled: !!id, // Only fetch if ID is present and valid
  });

  const { price: total } = usePrice(
    data && {
      amount: data.shipping_fee ? data.total + data.shipping_fee : data.total,
      currencyCode: 'USD',
    }
  );

  if (isLoading) {
    return (
      <div className="py-16 xl:px-32 2xl:px-44 3xl:px-56 lg:py-20">
        Loading...
      </div>
    );
  }

  if (!id || isError || !data) {
    return (
      <div className="py-16 xl:px-32 2xl:px-44 3xl:px-56 lg:py-20 text-red-500">
        {isError ? `Error: ${error.message}` : 'Order not found or ID missing.'}
      </div>
    );
  }

  return (
    <div className="py-16 xl:px-32 2xl:px-44 3xl:px-56 lg:py-20">
      <div className="flex items-center justify-start px-4 py-4 mb-6 text-sm border rounded-md border-border-base bg-fill-secondary lg:px-5 text-brand-dark md:text-base lg:mb-8">
        <span className="flex items-center justify-center w-10 h-10 rounded-full ltr:mr-3 rtl:ml-3 lg:ltr:mr-4 lg:rtl:ml-4 bg-brand bg-opacity-20 shrink-0">
          <IoCheckmarkCircle className="w-5 h-5 text-brand" />
        </span>
        {t('text-order-received')}
      </div>

      <ul className="flex flex-col border rounded-md border-border-base bg-fill-secondary md:flex-row mb-7 lg:mb-8 xl:mb-10">
        <li className="px-4 py-4 text-base font-semibold border-b border-dashed text-brand-dark lg:text-lg md:border-b-0 md:border-r border-border-two lg:px-6 xl:px-8 md:py-5 lg:py-6 last:border-0">
          <span className="block text-xs font-normal leading-5 uppercase text-brand-muted">
            {t('text-order-number')}:
          </span>
          {data?.tracking_number || data?.id}
        </li>
        <li className="px-4 py-4 text-base font-semibold border-b border-gray-300 border-dashed text-brand-dark lg:text-lg md:border-b-0 md:border-r lg:px-6 xl:px-8 md:py-5 lg:py-6 last:border-0">
          <span className="uppercase text-[11px] block text-brand-muted font-normal leading-5">
            {t('text-date')}:
          </span>
          {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
        </li>
        <li className="px-4 py-4 text-base font-semibold border-b border-gray-300 border-dashed text-brand-dark lg:text-lg md:border-b-0 md:border-r lg:px-6 xl:px-8 md:py-5 lg:py-6 last:border-0">
          <span className="uppercase text-[11px] block text-brand-muted font-normal leading-5">
            {t('text-email')}:
          </span>
          {data?.user?.email || data?.customer?.email || 'N/A'}
        </li>
        <li className="px-4 py-4 text-base font-semibold border-b border-gray-300 border-dashed text-brand-dark lg:text-lg md:border-b-0 md:border-r lg:px-6 xl:px-8 md:py-5 lg:py-6 last:border-0">
          <span className="uppercase text-[11px] block text-brand-muted font-normal leading-5">
            {t('text-total')}:
          </span>
          {total}
        </li>
        <li className="px-4 py-4 text-base font-semibold border-b border-gray-300 border-dashed text-brand-dark lg:text-lg md:border-b-0 md:border-r lg:px-6 xl:px-8 md:py-5 lg:py-6 last:border-0">
          <span className="uppercase text-[11px] block text-brand-muted font-normal leading-5">
            {t('text-payment-method')}:
          </span>
          {data?.payment_gateway || 'Cash on Delivery'}
        </li>
      </ul>

      <p className="mb-8 text-sm text-brand-dark md:text-base">
        {t('text-pay-cash')}
      </p>

      <OrderDetails lang={lang} />
    </div>
  );
}