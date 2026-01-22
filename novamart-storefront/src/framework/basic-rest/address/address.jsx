import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = 'http://localhost:5000/api';

const fetchAddress = async () => {
  const { data } = await http.get(API_ENDPOINTS.ADDRESS);
  return data;
};

const useAddressQuery = () => {
  return useQuery({
    queryKey: [API_ENDPOINTS.ADDRESS],
    queryFn: () => fetchAddress(),
  });
};

const addAddress = async (input) => {
  const { data } = await http.post(API_ENDPOINTS.ADDRESS, input);
  return data;
};

const useAddAddressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input) => addAddress(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.ADDRESS] });
    },
    onError: (data) => {
      console.log(data, 'Add Address error response');
    },
  });
};

const deleteAddress = async (id) => {
  const { data } = await http.delete(`${API_URL}/users/address/${id}`);
  return data;
};

const useDeleteAddressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteAddress(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.ADDRESS] });
    },
    onError: (data) => {
      console.log(data, 'Delete Address error response');
    },
  });
};

export { useAddressQuery, useAddAddressMutation, useDeleteAddressMutation, fetchAddress };
