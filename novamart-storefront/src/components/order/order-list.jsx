import { useOrdersQuery } from '@framework/order/get-all-orders';
import OrderTable from '@components/order/order-table';

export default function OrderLists({ lang }) {
  const { data, isLoading } = useOrdersQuery({});

  return !isLoading ? (
    <div className="w-full max-w-325 mx-auto">
      <div className="flex flex-wrap">
        {/* Placeholder column, likely for a sidebar in the original design */}
        <div className="lg:w-[35%] w-full"></div>
        <div className="lg:w-[65%] w-full">
          <div className="p-4 border border-solid rounded md:px-12 md:py-8 border-border-base">
            <OrderTable orders={data?.data} lang={lang} />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading....</div>
  );
}