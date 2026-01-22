import { useMutation, useQueryClient } from '@tanstack/react-query';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';

async function updateUser(input) {
    const { data } = await http.put(API_ENDPOINTS.USERS_PROFILE, input);
    return data;
}
export const useUpdateUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => updateUser(input),
        onSuccess: (data) => {
            // Invalidate user query to refetch updated data
            queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.USERS_ME] });
            console.log(data, 'UpdateUser success response');
        },
        onError: (data) => {
            console.log(data, 'UpdateUser error response');
        },
    });
};
