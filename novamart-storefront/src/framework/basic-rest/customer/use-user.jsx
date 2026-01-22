import { useQuery } from '@tanstack/react-query';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';

const fetchUser = async () => {
  const { data } = await http.get(API_ENDPOINTS.USERS_ME);
  return data;
};

export const useUserQuery = () => {
  return useQuery({
    queryKey: [API_ENDPOINTS.USERS_ME],
    queryFn: fetchUser,
    retry: false,
  });
};
