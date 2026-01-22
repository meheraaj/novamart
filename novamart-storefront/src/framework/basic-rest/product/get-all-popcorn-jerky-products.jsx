import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchPopcornJerkyProducts = async ({ queryKey }) => {
    const { data } = await http.get(API_ENDPOINTS.POPCORN_JERKY_PRODUCTS);
    return data;
};
export const usePopcornJerkyProductsQuery = (options) => {
    return useQuery({
        queryKey: [API_ENDPOINTS.POPCORN_JERKY_PRODUCTS, options],
        queryFn: () => fetchPopcornJerkyProducts(options),
    });
};
