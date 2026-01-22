import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from '@tanstack/react-query';

export const fetchCategories = async ({ queryKey }) => {
    // const options = queryKey[1];
    const { data } = await http.get(API_ENDPOINTS.CATEGORIES);

    return {
        categories: {
            data: data.data,
        },
    };
};

export const useCategoriesQuery = (options) => {
    return useQuery({
        queryKey: [API_ENDPOINTS.CATEGORIES, options],
        queryFn: fetchCategories,
    });
};
