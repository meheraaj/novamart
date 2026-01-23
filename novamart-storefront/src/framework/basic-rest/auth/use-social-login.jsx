import { useUI } from '@contexts/ui.context';
import { useModalAction } from '@components/common/modal/modal.context';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useMutation } from '@tanstack/react-query';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';

async function socialLogin(idToken) {
    // Call the new backend endpoint
    const { data } = await http.post(API_ENDPOINTS.FIREBASE_LOGIN, { idToken });
    return {
        token: data.accessToken,
        user: data,
    };
}

export const useSocialLoginMutation = () => {
    const { authorize } = useUI();
    const { closeModal } = useModalAction();

    return useMutation({
        mutationFn: (idToken) => socialLogin(idToken),
        onSuccess: (data) => {
            Cookies.set('auth_token', data.token);
            authorize();
            closeModal();
            toast.success('Login Successful');
        },
        onError: (error) => {
            console.error('Social login error:', error);
            const errorMessage = error?.response?.data?.message || 'Social Login Failed.';
            toast.error(errorMessage);
        },
    });
};
