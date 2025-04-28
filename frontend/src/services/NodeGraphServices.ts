import {
    ApiKeyItem,
    LLMSettings,
    ModelQueryData,
} from '@/types/nodeGraphTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { Edge, Node } from 'reactflow';
import { toast } from 'sonner';

import { api, isStillExecuting } from './http-common';

const executeNodeGraph = async ({
    queryData,
}: {
    queryData: ModelQueryData;
}) => {
    if (!isStillExecuting()) {
        return {
            response: null,
        };
    }

    try {
        return await api.post('/v1/node-graph/query-model/', queryData);
    } catch (e) {
        const error = e as AxiosError;
        toast.error(error.message);
        console.log(' = =    error  = = =');
        console.log(error);
    }
};
const executeNodeGraphThunk = createAsyncThunk(
    'nodeGraph/executeNodeGraph',
    executeNodeGraph,
);

const saveNodeGraph = async ({
    nodeData,
}: {
    nodeData: {
        nodes: Node[];
        edges: Edge[];
        label: string;
        description: string;
    };
}) => {
    if (!isStillExecuting()) {
        return {
            response: null,
            results: [],
            message: 'Canceled Graph execution',
        };
    }
    const config = {
        headers: {
            accept: 'application/json',
        },
    };

    try {
        const response = await api.post(
            '/v1/node-graph/node-graphs/',
            nodeData,
            config,
        );

        return {
            response: response,
            results: response.data,
            message: '',
        };
    } catch (e) {
        const error = e as AxiosError;
        console.log(' = =    error  = = =');
        console.log(error);

        let msg = error.message;

        if (error.response?.status == 400) {
            msg = (error.response.data as { message: string }).message;
        }

        return {
            response: error,
            results: [],
            message: msg,
        };
    }
};

const deleteNodeGraph = async ({ nodeGraphID }: { nodeGraphID: string }) => {
    const config = {
        headers: {
            accept: 'application/json',
        },
    };

    try {
        const response = await api.delete(
            `/v1/node-graph/node-graphs/${nodeGraphID}/`,
            config,
        );

        return {
            response: response,
            results: response.data,
            message: '',
        };
    } catch (e) {
        const error = e as AxiosError;
        console.log(' = =    error  = = =');
        console.log(error);

        let msg = error.message;

        if (error.response?.status == 400) {
            msg = (error.response.data as { message: string }).message;
        }

        return {
            response: error,
            results: [],
            message: msg,
        };
    }
};

const loadSavedNodeGraphs = async () => {
    const config = {
        headers: {
            accept: 'application/json',
        },
    };

    try {
        const response = await api.get('/v1/node-graph/node-graphs/', config);
        return {
            response: response,
            results: response.data.results,
            message: '',
        };
    } catch (e) {
        const error = e as AxiosError;
        console.log(' = =    error  = = =');
        console.log(error);

        let msg = error.message;

        if (error.response?.status == 400) {
            msg = (error.response.data as { message: string }).message;
        }

        return {
            response: error,
            results: [],
            message: msg,
        };
    }
};

// const setOpenAiInfo = async (settings: {
//   openaiApiKey: string;
//   organizationName?: string;
//   organizationId?: string;
//   openaiTimeout?: string;
// }) => {
//   const config = {
//     headers: {
//       accept: "application/json",
//     },
//   };

//   return await api.post("/v1/node-graph/node-graphs/", settings, config);
// };

const listUserApiKeys = async () => {
    const config = {
        headers: {
            accept: 'application/json',
        },
    };

    try {
        const response = await api.get<{ results: ApiKeyItem[] }>(
            '/v1/node-graph/api-services/',
            config,
        );
        return response;
    } catch (e) {
        const error = e as AxiosError;

        toast.error(error.message);
        return error;
    }
};

const postUserApiKeys = async (settings: LLMSettings) => {
    const config = {
        headers: {
            accept: 'application/json',
        },
    };

    try {
        const response = await api.post<{
            name: string;
            id: number;
            api_key_redacted: string;
        }>('/v1/node-graph/api-services/', settings, config);
        return response;
    } catch (e) {
        const error = e as AxiosError;

        return error;
    }
};

const deleteUserApiKey = async (api_key_id: string) => {
    const config = {
        headers: {
            accept: 'application/json',
        },
    };

    try {
        const response = await api.delete(
            `/v1/node-graph/api-services/${api_key_id}/`,
            config,
        );
        return response;
    } catch (e) {
        const error = e as AxiosError;
        toast.error(error.message);

        return error;
    }
};

const NodeGraphServices = {
    executeNodeGraphThunk,
    executeNodeGraph,
    saveNodeGraph,
    deleteNodeGraph,
    loadSavedNodeGraphs,
    listUserApiKeys,
    postUserApiKeys,
    deleteUserApiKey,
};

export default NodeGraphServices;
