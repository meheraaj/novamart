import { useQuery } from '@tanstack/react-query';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';

export const fetchWidget = async ({ queryKey }) => {
    const [_key, slug] = queryKey;
    const { data } = await http.get(`${API_ENDPOINTS.WIDGETS}/${slug}`);
    return data;
};

export const useWidgetQuery = (slug) => {
    return useQuery({
        queryKey: [API_ENDPOINTS.WIDGETS, slug],
        queryFn: fetchWidget
    });
};
