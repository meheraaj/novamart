import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchFlashSellProducts = async ({ queryKey }) => {
    const { data } = await http.get(API_ENDPOINTS.FLASH_SELL_PRODUCTS);
    return data;
};
export const useFlashSellProductsQuery = (options) => {
    return useQuery({
        queryKey: [API_ENDPOINTS.FLASH_SELL_PRODUCTS, options],
        queryFn: () => fetchFlashSellProducts(options),
    });
};
