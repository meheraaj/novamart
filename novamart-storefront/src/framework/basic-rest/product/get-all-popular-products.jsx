import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchPopularProducts = async ({ queryKey }) => {
    const { data } = await http.get(API_ENDPOINTS.POPULAR_PRODUCTS);
    return data;
};

export const usePopularProductsQuery = (options) => {
    return useQuery({
        queryKey: [API_ENDPOINTS.POPULAR_PRODUCTS, options],
        queryFn: () => fetchPopularProducts(options),
    });
};
