import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchFreshVegetablesProducts = async ({ queryKey }) => {
    const { data } = await http.get(API_ENDPOINTS.FRESH_VEGETABLES_PRODUCTS);
    return data;
};
export const useFreshVegetablesProductsQuery = (options) => {
    return useQuery({
        queryKey: [API_ENDPOINTS.FRESH_VEGETABLES_PRODUCTS, options],
        queryFn: () => fetchFreshVegetablesProducts(options),
    });
};
