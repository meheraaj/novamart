import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchBestSellerGroceryProducts = async ({ queryKey }) => {
    const { data } = await http.get(API_ENDPOINTS.BEST_SELLER_GROCERY_PRODUCTS);
    return data;
};
export const useBestSellerGroceryProductsQuery = (
    options,
) => {
    return useQuery({
        queryKey: [API_ENDPOINTS.BEST_SELLER_GROCERY_PRODUCTS, options],
        queryFn: () => fetchBestSellerGroceryProducts(options),
    });
};
