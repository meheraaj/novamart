import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchShops = async ({ queryKey }) => {
    const [_key, _params] = queryKey;
    const { data } = await http.get(API_ENDPOINTS.SHOPS);
    return { shop: { data } };
};

export const useShopsQuery = (options) => {
    return useQuery({
        queryKey: [API_ENDPOINTS.SHOPS, options],
        queryFn: fetchShops,
    });
};
