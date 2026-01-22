import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchShop = async (_slug) => {
    const { data } = await http.get(`${API_ENDPOINTS.SHOP}`);
    return data;
};
export const useShopQuery = (slug) => {
    return useQuery({
        queryKey: [API_ENDPOINTS.SHOP, slug],
        queryFn: () => fetchShop(slug),
    });
};
