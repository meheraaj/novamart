import { useMutation } from '@tanstack/react-query';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';

async function createOrder(input) {
    const { data } = await http.post(API_ENDPOINTS.ORDERS, input);
    return data;
}

export const useCreateOrderMutation = () => {
    return useMutation({
        mutationFn: (input) => createOrder(input),
        onSuccess: (data, variables, context) => {
            console.log(data, 'CreateOrder success response');
        },
        onError: (data) => {
            console.log(data, 'CreateOrder error response');
        },
    });
};
