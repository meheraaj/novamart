import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import http from '@framework/utils/http';
import shuffle from 'lodash/shuffle';
import { useInfiniteQuery } from '@tanstack/react-query';

const fetchProducts = async ({ queryKey }) => {
    const { data } = await http.get(API_ENDPOINTS.PRODUCTS);
    return {
        data: shuffle(data),
        paginatorInfo: {
            nextPageUrl: '',
        },
    };
};

const useProductsQuery = (options) => {
    return useInfiniteQuery({
        queryKey: [API_ENDPOINTS.PRODUCTS, options],
        queryFn: ({ pageParam }) => fetchProducts(pageParam),
        initialPageParam: 0,
        getNextPageParam: ({ paginatorInfo }) => paginatorInfo.nextPageUrl,
    });
};

export { useProductsQuery, fetchProducts };
