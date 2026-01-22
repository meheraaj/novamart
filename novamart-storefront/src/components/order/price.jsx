import usePrice from '@framework/product/use-price';
import { calculateTotal } from '@contexts/cart/cart.utils';

export const TotalPrice = ({ items }) => {
  const { price } = usePrice({
    amount: items?.total ?? Math.round(
      calculateTotal(items?.products) + (items?.delivery_fee ?? 0) - (items?.discount ?? 0),
    ),
    currencyCode: 'BDT',
  });
  return <span className="total_price">{price}</span>;
};

export const DiscountPrice = (discount) => {
  const { price } = usePrice({
    amount: discount?.discount,
    currencyCode: 'BDT',
  });
  return <>-{price}</>;
};

export const DeliveryFee = (delivery) => {
  const { price } = usePrice({
    amount: delivery?.delivery,
    currencyCode: 'BDT',
  });
  return <>{price}</>;
};

export const SubTotalPrice = ({ items }) => {
  const { price } = usePrice({
    amount: calculateTotal(items),
    currencyCode: 'BDT',
  });
  return <>{price}</>;
};
