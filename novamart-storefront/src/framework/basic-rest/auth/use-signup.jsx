import { useUI } from '@contexts/ui.context';
import { useModalAction } from '@components/common/modal/modal.context';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useMutation } from '@tanstack/react-query';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';

async function register(input) {
    const { data } = await http.post(API_ENDPOINTS.REGISTER, input);
    return {
        token: data.accessToken, // Assuming backend returns accessToken on register too, or we login after register
        user: data,
    };
}
export const useSignupMutation = () => {
    const { authorize } = useUI();
    const { closeModal } = useModalAction();
    return useMutation({
        mutationFn: (input) => register(input),
        onSuccess: (data) => {
            if (data.token) {
                Cookies.set('auth_token', data.token);
                authorize();
            }
            closeModal();
            toast.success('Registration Successful');
        },
        onError: (data) => {
            console.log(data, 'signup error response');
            const errorMessage = data?.response?.data?.message || 'Registration Failed. Please try again.';
            toast.error(errorMessage);
        },
    });
};
