import { useCreateOrderMutation } from '@framework/order/use-create-order';

export const useCheckoutMutation = () => {
    return useCreateOrderMutation();
};
