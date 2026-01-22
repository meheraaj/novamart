import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchChipsProducts = async ({ queryKey }) => {
    const { data } = await http.get(API_ENDPOINTS.CHIPS_PRODUCTS);
    return data;
};
export const useChipsProductsQuery = (options) => {
    return useQuery({
        queryKey: [API_ENDPOINTS.CHIPS_PRODUCTS, options],
        queryFn: () => fetchChipsProducts(options),
    });
};
