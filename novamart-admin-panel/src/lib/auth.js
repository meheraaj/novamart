import Cookies from 'js-cookie';

export const getToken = () => {
  return Cookies.get('token');
};

export const setToken = (token) => {
  Cookies.set('token', token, { expires: 3 }); // 3 days
};

export const removeToken = () => {
  Cookies.remove('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};
