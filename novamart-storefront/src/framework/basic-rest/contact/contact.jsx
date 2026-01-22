import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchContact = async () => {
    const { data } = await http.get(API_ENDPOINTS.CONTACT);
    return data;
};

const useContactQuery = () => {
    return useQuery({
        queryKey: [API_ENDPOINTS.CONTACT],
        queryFn: fetchContact,
    });
};

const addContact = async (input) => {
    const { data } = await http.post(API_ENDPOINTS.CONTACT, input);
    return data;
};

const useAddContactMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => addContact(input),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.CONTACT] });
        },
        onError: (data) => {
            console.log(data, 'Add Contact error response');
        },
    });
};

export { useContactQuery, useAddContactMutation, fetchContact };
