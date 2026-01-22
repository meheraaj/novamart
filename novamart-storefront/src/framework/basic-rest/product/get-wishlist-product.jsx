import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchWishlistProducts = async ({ queryKey }) => {
    const { data } = await http.get(API_ENDPOINTS.WISHLIST);
    return data;
};
export const useWishlistProductsQuery = (options) => {
    return useQuery({
        queryKey: [API_ENDPOINTS.WISHLIST, options],
        queryFn: () => fetchWishlistProducts(options),
    });
};
