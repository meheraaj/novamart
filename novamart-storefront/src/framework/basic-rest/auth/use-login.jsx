import { useUI } from '@contexts/ui.context';
import { useModalAction } from '@components/common/modal/modal.context';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useMutation } from '@tanstack/react-query';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';

async function login(input) {
    const { data } = await http.post(API_ENDPOINTS.LOGIN, input);
    return {
        token: data.accessToken,
        user: data,
    };
}
export const useLoginMutation = () => {
    const { authorize } = useUI();
    const { closeModal } = useModalAction();

    return useMutation({
        mutationFn: (input) => login(input),
        onSuccess: (data) => {
            Cookies.set('auth_token', data.token);
            authorize();
            closeModal();
            toast.success('Login Successful');
        },
        onError: (data) => {
            console.log(data, 'login error response');
            const errorMessage = data?.response?.data?.message || 'Login Failed. Please check your credentials.';
            toast.error(errorMessage);
        },
    });
};
