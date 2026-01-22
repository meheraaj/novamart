import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchProduct = async (_slug) => {
    const { data } = await http.get(`${API_ENDPOINTS.PRODUCT}`);
    return data;
};
export const useProductQuery = (slug) => {
    return useQuery({
        queryKey: [API_ENDPOINTS.PRODUCT, slug],
        queryFn: () => fetchProduct(slug),
    });
};
