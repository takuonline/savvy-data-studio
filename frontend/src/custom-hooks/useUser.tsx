import AuthenticationService from '@/services/AuthenticationService';
import useSWR from 'swr';

export function useUser() {
    const { data, error, isLoading } = useSWR(
        '/users/me/',
        ()=> AuthenticationService.me(),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateOnMount: false,
        },
    );

    return {
        user: data,
        isLoading,
        isError: error,
    };
}
