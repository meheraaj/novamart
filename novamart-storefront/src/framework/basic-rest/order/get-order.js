import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchOrder = async (_id) => {
    const { data } = await http.get(`${API_ENDPOINTS.ORDER}/${_id}`);
    return data;
};
export const useOrderQuery = (id, options) => {
    return useQuery({
        queryKey: [API_ENDPOINTS.ORDER, id],
        queryFn: () => fetchOrder(id),
        ...options,
    });
};
