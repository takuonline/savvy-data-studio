import { AuthLoginCredentials } from '@/types/authTypes';
import { AxiosError } from 'axios';

import { api } from './http-common';

const login = async (loginCredentials: AuthLoginCredentials) => {
    return await api.post('/token/', loginCredentials);
};

const signUp = async (loginCredentials: AuthLoginCredentials) => {
    return await api.post('/users/create/', loginCredentials);
};

const refresh = async () => {
    const response = await api.post('/token/refresh/');
    return response;
};

const verify = async () => {
    const response = await api.post(
        '/token/verify/',
        {},
        {
            withCredentials: true,
        },
    );
    return response;
};

const me = async (url: string) => {
    return await api.get(url);
};

const checkAuth = async (url: string) => {
    return await api.get(url, {
        headers: {
            // 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        withCredentials: true,
    });
};
const AuthenticationService = {
    login,
    signUp,
    refresh,
    verify,
    checkAuth,
    me,
};

export default AuthenticationService;
