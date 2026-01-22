import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchCookiesProducts = async ({ queryKey }) => {
    const { data } = await http.get(API_ENDPOINTS.COOKIES_PRODUCTS);
    return data;
};
export const useCookiesProductsQuery = (options) => {
    return useQuery({
        queryKey: [API_ENDPOINTS.COOKIES_PRODUCTS, options],
        queryFn: () => fetchCookiesProducts(options),
    });
};
