import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchSearchedProducts = async ({ queryKey }) => {
    const options = queryKey[1];
    if (!options.text) return [];
    
    const { data } = await http.get(`${API_ENDPOINTS.SEARCH_PRODUCTS}?q=${options.text}`);
    return data;
};
export const useSearchQuery = (options) => {
    return useQuery({
        queryKey: [API_ENDPOINTS.SEARCH, options],
        queryFn: fetchSearchedProducts,
    });
};
