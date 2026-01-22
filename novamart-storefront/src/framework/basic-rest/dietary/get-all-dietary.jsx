import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchDietary = async () => {
    const { data } = await http.get(API_ENDPOINTS.DIETARY);
    return { dietary: { data: data.data } };
};
export const useDietaryQuery = (options) => {
    return useQuery({
        queryKey: [API_ENDPOINTS.DIETARY, options],
        queryFn: fetchDietary,
    });
};
