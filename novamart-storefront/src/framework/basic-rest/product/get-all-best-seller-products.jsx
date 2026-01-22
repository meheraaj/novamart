import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchBestSellerProducts = async ({ queryKey }) => {
    const { data } = await http.get(API_ENDPOINTS.BEST_SELLER_PRODUCTS);
    return data;
};
export const useBestSellerProductsQuery = (options) => {
    return useQuery({
        queryKey: [API_ENDPOINTS.BEST_SELLER_PRODUCTS, options],
        queryFn: () => fetchBestSellerProducts(options),
    });
};
