import { AuthLoginCredentials } from '@/types/authTypes';

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

const me = async () => {
    return await api.get('/users/me/');
};

const AuthenticationService = {
    login,
    signUp,
    refresh,
    verify,
    me,
};

export default AuthenticationService;
