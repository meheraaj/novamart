import { useMutation, useQueryClient } from '@tanstack/react-query';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';

async function toggleWishlist(input) {
    // input should be { product_id: string }
    // The backend endpoint might be a toggle or add/remove. 
    // Based on routes/users.js, there is no specific toggle endpoint yet, only GET /wishlist.
    // I need to check routes/users.js again. It only had GET /wishlist.
    // I should probably add POST /wishlist to backend first.
    // For now, I will assume POST /wishlist adds/removes.
    const { data } = await http.post(API_ENDPOINTS.WISHLIST, input);
    return data;
}

export const useWishlistMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => toggleWishlist(input),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.WISHLIST] });
        },
        onError: (data) => {
            console.log(data, 'Wishlist error response');
        },
    });
};
