import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchBrands = async () => {
    const {
        data: { data },
    } = await http.get(API_ENDPOINTS.BRANDS);
    return { brands: { data: data } };
};
export const useBrandsQuery = (options) => {
    return useQuery({
        queryKey: [API_ENDPOINTS.BRANDS, options],
        queryFn: fetchBrands,
    });
};
