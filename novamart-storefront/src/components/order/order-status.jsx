import { useOrderStatusQuery } from '@framework/order/order-status';
import ProgressBox from './progress-box';

const OrderStatus = ({ status }) => {
  const { data, isLoading } = useOrderStatusQuery();
  
  return !isLoading ? (
    <ProgressBox data={data} status={status} />
  ) : (
    <div>Loading...</div>
  );
};

export default OrderStatus;