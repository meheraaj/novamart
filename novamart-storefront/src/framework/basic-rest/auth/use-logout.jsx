import { useUI } from '@contexts/ui.context';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

async function logout() {
    return {
        ok: true,
        message: 'Logout Successful!',
    };
}
export const useLogoutMutation = (lang) => {
    const { unauthorize } = useUI();
    const router = useRouter();
    return useMutation({
        mutationFn: logout,
        onSuccess: (_data) => {
            Cookies.remove('auth_token');
            unauthorize();
            router.push(`/`);
        },
        onError: (data) => {
            console.log(data, 'logout error response');
        },
    });
};
