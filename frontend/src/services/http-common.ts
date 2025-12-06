import Config from '@/lib/constants';
import { EnhancedStore } from '@reduxjs/toolkit';
import axios, { AxiosError, AxiosRequestConfig, isAxiosError } from 'axios';
import { toast } from 'sonner';

import AuthenticationService from './AuthenticationService';

let store: EnhancedStore;
interface ErrorWithRequestConfig
    extends Omit<AxiosError<{ message: string }>, 'config'> {
    config: AxiosRequestConfig & { _retry?: boolean };
}
export const injectStore = (_store: EnhancedStore) => {
    store = _store;
};

const api = axios.create({
    baseURL: `${Config.API_BASE_URL}`,
    headers: {
        accept: 'application/json',
    },
    withCredentials: true,
});

// Function to convert data URL or ArrayBuffer to Blob
const dataToBlob = (
    data: string | ArrayBuffer | null,
    type: string,
): Blob | null => {
    if (typeof data === 'string' && data.startsWith('data:')) {
        // Convert data URL to Blob
        const byteString = atob(data.split(',')[1]);
        const mimeString = data.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    } else if (data instanceof ArrayBuffer) {
        // Convert ArrayBuffer to Blob
        return new Blob([data], { type });
    } else {
        return null;
    }
};

const isStillExecuting = () => {
    // TODO: FIX
    // const state = store.getState() as RootState
    // console.log("logging state");
    // console.log(state.nodeGraph.settings);
    // return state.nodeGraph.graphExecution.isExecuting
    return true;
};

api.interceptors.request.use((config) => {
    // config.headers.Authorization = `Bearer ${
    //   store.getState().auth.tokens.access
    // }`;

    // config.withCredentials = true;

    return config;
});

api.interceptors.response.use(
    (data) => {
        return data;
    },
    async (error) => {
        switch (error.response?.status) {
            case 401:
                if (window.location.pathname !== '/login') {
                    window.location.href = `/login`;
                }

                break;
            case 403:
                return await handle403(error);
            case 400:
                toast.error('Bad request');

                // handle400(error);
                break;
            case 404:
                break;
            default:
                const errMsg =
                    error?.response?.data?.message ||
                    'Something went wrong. Try reloading your page and if the issue persists reach out to the support teams. Thanks';
                console.log(errMsg);

                if (typeof window !== 'undefined') {
                    toast.error(errMsg);
                }

                break;
        }
        throw error;
    },
);

const handle403 = async (error: ErrorWithRequestConfig) => {
    AuthenticationService.refresh()
        .then((response) => {
            if (isAxiosError(response)) {
                toast.error('You are not authenticated');

                window.location.href = `/login`; // Redirect to login
            } else {
                // redo the request
                return api.request(error.config);
            }
        })
        .catch((error) => {
            toast.error('You are not authenticated');
        });
};

export { api, dataToBlob, isStillExecuting };
