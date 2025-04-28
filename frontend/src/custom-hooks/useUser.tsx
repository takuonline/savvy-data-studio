import AuthenticationService from '@/services/AuthenticationService';
import { api } from '@/services/http-common';
import useSWR from 'swr';

export function useUser() {
    const { data, error, isLoading } = useSWR(
        '/users/me/',
        AuthenticationService.me,
    );

    return {
        user: data,
        isLoading,
        isError: error,
    };
}
