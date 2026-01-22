import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchCategory = async ({ queryKey }) => {
    const [_key, _params] = queryKey;
    const {
        data: { data },
    } = await http.get(API_ENDPOINTS.CATEGORIES);
    return { category: { data } };
};
export const useCategoriesQuery = (options) => {
    return useQuery({
        queryKey: [API_ENDPOINTS.CATEGORIES, options],
        queryFn: fetchCategory,
    });
};
