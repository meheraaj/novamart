import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import http from '@framework/utils/http';
import shuffle from 'lodash/shuffle';
import { useInfiniteQuery } from '@tanstack/react-query';

const fetchProducts = async ({ queryKey }) => {
    const [_key, options] = queryKey;
    const queryString = options?.newQuery || '';
    const { data } = await http.get(`${API_ENDPOINTS.PRODUCTS}${queryString}`);
    
    // Handle both old (array) and new (paginated object) response formats
    const products = Array.isArray(data) ? data : data.data;
    const paginatorInfo = data.paginatorInfo || {
        nextPageUrl: null,
        total: products?.length || 0,
        count: products?.length || 0,
        currentPage: 1,
        lastPage: 1
    };

    return {
        data: products,
        paginatorInfo: paginatorInfo,
    };
};

const useProductsQuery = (options) => {
    return useInfiniteQuery({
        queryKey: [API_ENDPOINTS.PRODUCTS, options],
        queryFn: fetchProducts,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage?.paginatorInfo?.nextPageUrl,
    });
};

export { useProductsQuery, fetchProducts };
