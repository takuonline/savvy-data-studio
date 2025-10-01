import AuthenticationService from '@/services/AuthenticationService';
import useSWR from 'swr';

export function useUser() {
    const { data, error, isLoading } = useSWR(
        '/users/me/',
        ()=> AuthenticationService.me(),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            revalidateOnMount: true,
            refreshInterval: 1000 * 60 * 30,
            dedupingInterval: 1000 * 60 * 5,
            errorRetryCount: 2,
            errorRetryInterval: 1000 * 10,
        }
    );

    return {
        user: data,
        isLoading,
        isError: error,
    };
}
