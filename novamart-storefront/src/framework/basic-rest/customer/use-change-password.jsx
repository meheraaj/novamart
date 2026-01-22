import { useMutation } from '@tanstack/react-query';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { toast } from 'react-toastify';

async function changePassword(input) {
    const { data } = await http.post(API_ENDPOINTS.CHANGE_PASSWORD, input);
    return data;
}
export const useChangePasswordMutation = () => {
    return useMutation({
        mutationFn: (input) => changePassword(input),
        onSuccess: (data) => {
            toast.success('Password changed successfully');
        },
        onError: (data) => {
            console.log(data, 'ChangePassword error response');
            toast.error(data.response?.data?.message || 'Failed to change password');
        },
    });
};
