import { ExecutionState } from '@/components/enums/Enums';
import { Edge, Node, XYPosition } from 'reactflow';

export type TextInputNodeData = {
    prompt: {
        textPrompt: string;
    };
    label: string;
    description?: string;
    executionState: ExecutionState;
};

export type ChatModelNodeData = {
    modelName: string;
    label: string;
    description?: string;
    configs: ChatOpenAIConfiguration;
    executionState: ExecutionState;
};
export type TextOutputNodeData = {
    output: {
        text: string;
    };
    label: string;
    description?: string;
    executionState: ExecutionState;
};
export type ImageInputNodeData = {
    images: string[];
    label: string;
    description?: string;
    executionState: ExecutionState;
};

export type DocumentItemRequest = {
    name: string;
    blob: string | ArrayBuffer | null | undefined;
    type: string;

    size: string;
};

export type DocumentItemType = {
    name: string;
    blob: string | ArrayBuffer | null | undefined;
    type: string;
    url: string;
    size: string;
};

export type DocumentInputNodeData = {
    documents: DocumentItemType[];
    label: string;
    description?: string;
    executionState: ExecutionState;
    contextLength?: number;
};

export type VectorSearchNodeData = {
    documents: DocumentItemType[];
    label: string;
    description?: string;
    executionState: ExecutionState;
    isSearchable: boolean;
};

export type OutputNodeData = {
    label: string;
    executionState: ExecutionState;
};

export type ContextMenuPosition = {
    projectedPosition: XYPosition;
    position: {
        x: Number;
        y: Number;
    };
};

export type ApiKeyItem = {
    name: string;
    id: string;
    api_key_redacted: string;
    created_at: string;
    updated_at: string;
};

export type NodeDataType =
    | TextInputNodeData
    | ChatModelNodeData
    | OutputNodeData
    | TextOutputNodeData
    | ImageInputNodeData
    | DocumentInputNodeData;
export type NodeGraphState = {
    graphExecution: {
        isExecuting: boolean;
        nodeId: string;
    };
    apiKeyItems: ApiKeyItem[];

    slidingSheet: {
        isEditingNode: boolean;
        nodeId: string;
        isShowingTemplates: boolean;
        isShowingSavedGraphs: boolean;
    };
    nodes: Node<NodeDataType>[];
    currentlySelectedNode?: Node;
    contextMenuPosition: ContextMenuPosition;
    chatModelOptions: {
        value: string;
        label: string;
    }[];
    nodeOptions: {
        value: string;
        id: Number;
        label: string;
    }[];
    edges: Edge[];
    settings: {
        openaiKeyId: string | undefined;
    };
    singleNodeExecution: {
        node?: Node;
        isExecutingSetOn: boolean;
    };
};

export type ChatOpenAIConfiguration = {
    cache?: boolean;
    // callbackManager?: BaseCallbackManager;
    // callbacks?: Callbacks;
    defaultHeaders?: Record<string, string>;
    defaultQuery?: Record<string, any>;
    httpClient?: any; // Replace 'any' with the specific type if available
    maxRetries?: number;
    maxTokens?: number;
    metadata?: Record<string, any>;
    modelKwargs?: Record<string, any>;
    modelName?: string;
    n?: number;
    top_p: number;
    openaiApiBase?: string;
    openaiApiKey?: string;
    openaiOrganization?: string;
    openaiProxy?: string;
    requestTimeout?: number | [number, number];
    streaming?: boolean;
    tags?: string[];
    temperature?: number;
    tiktokenModelName?: string;
    verbose?: boolean;
    model: string;
    prompt: string | string[] | number[] | number[][];
    bestOf?: number | null;
    echo?: boolean | null;
    frequencyPenalty?: number | null;
    logitBias?: Record<number, number> | null;
    logprobs?: number | null;
    presencePenalty?: number | null;
    seed?: number | null;
    stop?: string | string[] | null;
    stream?: boolean | null;
    suffix?: string | null;

    user?: string;
};
export type ResultItem = {
    data: string;
    file_name: string;
    url?: string;
};

export type GraphMetadata = {
    id: string;
    user: string;
    file_path: string;
    label: string;
    description: string;
    created_at: string;
    updated_at: string;
    node_graph: string;
};

export type LLMSettings = {
    name: string;
    apiKey: string;
    organizationName?: string;
    organizationId?: string;
    openaiTimeout?: string;
};

export type ModelQueryData = {
    api_key_id: string;
    chat_model: {
        model_name: string;
        temperature: number | undefined;
        max_tokens: number | undefined;
        max_retries: number | undefined;
    };
    chat_prompt: {
        system_prompt: string;
        human_prompt: string;
        document_prompt: string;
        document_urls: string[];
    };
    config: {
        doc_chunk_size?: number;
    };
};
