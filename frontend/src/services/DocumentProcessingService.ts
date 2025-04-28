import {
    DocumentItemRequest,
    DocumentItemType,
    ResultItem,
} from '@/types/nodeGraphTypes';

import { api } from './http-common';

const uploadProcessStoreDocuments = async (
    documents: DocumentItemRequest[],

    node_id: string,
) => {
    const requestConfig = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };

    const formData = new FormData();
    formData.append('node_id', node_id);

    documents.forEach(async (doc) => {
        let blob = new Blob([doc.blob!], { type: doc.type });

        formData.append('files', blob, doc.name);
    });

    try {
        const response = await api.post(
            '/v1/documents/process-store/',
            formData,
            requestConfig,
        );

        if (response.status === 200) {
            return {
                response: response,
                results: response.data as ResultItem[],
            };
        } else {
            return {
                response: response,
                results: [],
            };
        }
    } catch (error) {
        return {
            response: error,
            results: [],
        };
        // return error as AxiosError;
    }
};

const generateVectorSearch = async (
    nodeId: string,
    files: DocumentItemType[],
    llmApiKeyId: string,
    document?: string,
) => {
    const document_urls = files.map((f) => {
        let url = f.url;
        if (url.startsWith('/')) {
            url = url.substring(1);
        }

        return url;
    });
    try {
        const data = {
            node_id: nodeId,
            embedding_function: 'OpenAIEmbeddings',
            document,
            document_urls,
            llmApiKeyId,
        };
        const config = {
            headers: {},
        };

        const response = await api.post(
            '/v1/node-graph/vector-db/generate/',
            data,
            config,
        );

        return response;
    } catch (error) {
        return error;
    }
};

const searchVectorDb = async (
    query: string,
    nodeId: string,
    llmApiKeyId: string,

    n_results?: number,
) => {
    try {
        const data = {
            node_id: nodeId,
            query,
            n_results: n_results ?? 4,
            llmApiKeyId,
        };
        const config = {
            headers: {},
        };

        const response = await api.post(
            '/v1/node-graph/vector-db/search/',
            data,
            config,
        );

        return response;
    } catch (error) {
        return error;
    }
};

const retrieveStoredDocuments = async (
    files: DocumentItemType[],

    nodeId: string,
) => {
    const queryParams = new URLSearchParams({ node_id: nodeId }).toString();
    const url = `/v1/documents/retrieve-stored/?${queryParams}`;
    return await api.get(url);
};

const uploadAndSearchDocuments = async (
    files: DocumentItemType[],
    nodeId: string,
    llmApiKeyId: string,
) => {
    return await generateVectorSearch(nodeId, files, llmApiKeyId);
};

const DocumentProcessingService = {
    uploadAndSearchDocuments,
    uploadProcessStoreDocuments,
    searchVectorDb,
    retrieveStoredDocuments,
};

export default DocumentProcessingService;
