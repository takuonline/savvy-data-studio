import Utils from '@/app/utils/utils';
import { ExecutionState } from '@/components/enums/Enums';
import {
    ApiKeyItem,
    ContextMenuPosition,
    NodeGraphState,
} from '@/types/nodeGraphTypes';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import {
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    applyEdgeChanges,
    applyNodeChanges,
} from 'reactflow';

import { RootState } from '../../app/store';
import NodeGraphServices from '../../services/NodeGraphServices';
import { AVAILABLE_NODES, initialEdge, initialNodes } from './state-defaults';

const { executeNodeGraphThunk } = NodeGraphServices;

// First, create the thunk
export const listUserApiKeysThunk = createAsyncThunk(
    'nodeGraph/listUserApiKeys',
    async (thunkAPI) => {
        const response = await NodeGraphServices.listUserApiKeys();

        if (isAxiosError(response)) {
            console.log('error fetching api keys');

            return [];
        }
        console.log(response.data);

        return response.data.results;
    },
);

const nodeOptions = Object.entries(AVAILABLE_NODES).map(([k, v], i) => ({
    value: k,
    label: v.data.label,
    id: i + 1,
}));

//TODO: make this dynamic - load from backend which will load from open ai
const modelOptions = [
    // { label: 'gpt-4o-2024-05-13', value: 'gpt-4o-2024-05-13' },
    { label: 'gpt-4o', value: 'gpt-4o' },
    { label: 'gpt-4o-mini', value: 'gpt-4o-mini' },
    { label: 'gpt-4', value: 'gpt-4' },
    // { label: 'gpt-3.5-turbo-16k', value: 'gpt-3.5-turbo-16k' },
    // { label: 'gpt-3.5-turbo-1106', value: 'gpt-3.5-turbo-1106' },
    // { label: 'gpt-4-0314', value: 'gpt-4-0314' },
    // { label: 'gpt-4-0613', value: 'gpt-4-0613' },
    // { label: 'gpt-3.5-turbo-16k-0613', value: 'gpt-3.5-turbo-16k-0613' },
    // { label: 'gpt-3.5-turbo-0613', value: 'gpt-3.5-turbo-0613' },
    // { label: 'gpt-3.5-turbo-0301', value: 'gpt-3.5-turbo-0301' },
    // { label: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo' },
    { label: 'gpt-4-turbo', value: 'gpt-4-turbo' },
];

const getNodesState = () => {
    const nodeString =
        typeof window !== 'undefined' ? localStorage.getItem('nodes') : null;

    if (nodeString) {
        return JSON.parse(nodeString) as Node[];
    }

    return initialNodes as Node[];
};

const getEdgesState = () => {
    const edgeString =
        typeof window !== 'undefined' ? localStorage.getItem('edges') : null;

    if (edgeString) {
        return JSON.parse(edgeString) as Edge[];
    }

    return initialEdge as Edge[];
};

const initialState: NodeGraphState = {
    graphExecution: {
        isExecuting: false,
        nodeId: '',
    },
    slidingSheet: {
        isEditingNode: false,
        nodeId: '',
        isShowingTemplates: false,
        isShowingSavedGraphs: false,
    },

    nodes: getNodesState(),
    edges: getEdgesState(),
    chatModelOptions: modelOptions,
    nodeOptions,
    contextMenuPosition: {
        projectedPosition: {
            x: 200,
            y: 200,
        },
        position: {
            x: 200,
            y: 200,
        },
    },
    apiKeyItems: [],

    settings: {
        openaiKeyId: Utils.loadFromLocalStorage('openaiKeyId'),
    },
    singleNodeExecution: {
        node: undefined,
        isExecutingSetOn: false,
    },
};

export const nodeGraphSlice = createSlice({
    name: 'nodeGraph',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setNodeGraphEditing: (
            state,
            action: PayloadAction<{
                isEditingNode: boolean;
                nodeId: string;
            }>,
        ) => {
            state.slidingSheet = {
                isEditingNode: action.payload.isEditingNode,
                nodeId: action.payload.nodeId ?? state.slidingSheet.nodeId,
                isShowingTemplates: false,
                isShowingSavedGraphs: false,
            };
        },
        displayNodeTemplatesSheets: (state) => {
            state.slidingSheet = {
                ...state.slidingSheet,
                isShowingTemplates: true,
            };
        },
        displayLoadStoredGraphsSheets: (state) => {
            state.slidingSheet = {
                ...state.slidingSheet,
                isShowingSavedGraphs: true,
            };
        },

        updateNodesChanges: (state, action: PayloadAction<NodeChange[]>) => {
            state.nodes = applyNodeChanges(action.payload, state.nodes);

            Utils.saveToLocalStorage('nodes', state.nodes);
        },

        updateEdgesChanges: (state, action: PayloadAction<EdgeChange[]>) => {
            state.edges = applyEdgeChanges(action.payload, state.edges);
            Utils.saveToLocalStorage('edges', state.edges);
        },

        setContextMenuClickPosition: (
            state,
            action: PayloadAction<ContextMenuPosition>,
        ) => {
            state.contextMenuPosition = action.payload;
        },

        updateCurrentlySelectedNode: (state, action: PayloadAction<Node>) => {
            state.currentlySelectedNode = action.payload;
        },

        setExecution: (
            state,
            action: PayloadAction<{
                // isAbortSet:boolean
                isExecuting: boolean;
                nodeId?: string;
            }>,
        ) => {
            state.graphExecution.isExecuting = action.payload.isExecuting;

            if (action.payload.nodeId) {
                state.graphExecution.nodeId = action.payload.nodeId;
            }
        },
        setNodeState: (
            state,
            action: PayloadAction<{
                nodeState: ExecutionState;
                nodeId: string;
            }>,
        ) => {
            const node = state.nodes.find(
                (n) => n.id === action.payload.nodeId,
            );
            if (node) {
                node.data.executionState = action.payload.nodeState;
            }
        },

        onExecuteGraph: (
            state,
            action: PayloadAction<{ nodes: Node[]; edges: Edge[] }>,
        ) => {},
        setApiKeyId: (state, action: PayloadAction<string>) => {
            state.settings.openaiKeyId = action.payload;

            Utils.saveToLocalStorage('openaiKeyId', action.payload);
        },
        executeSingleNode: (
            state,
            action: PayloadAction<{
                node?: Node;
                isExecutingSetOn: boolean;
            }>,
        ) => {
            state.singleNodeExecution = action.payload;
        },
    },

    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(executeNodeGraphThunk.pending, (state, action) => {});
        builder.addCase(executeNodeGraphThunk.fulfilled, (state, action) => {});
        builder.addCase(executeNodeGraphThunk.rejected, (state, action) => {});

        // listUserApiKeysThunk
        builder.addCase(listUserApiKeysThunk.fulfilled, (state, action) => {
            state.apiKeyItems = action.payload as ApiKeyItem[];
        });
    },
});

export const {
    setNodeGraphEditing,
    updateCurrentlySelectedNode,
    updateNodesChanges,
    updateEdgesChanges,
    setContextMenuClickPosition,
    setExecution,
    onExecuteGraph,
    setApiKeyId,
    executeSingleNode,
    setNodeState,
    displayNodeTemplatesSheets,
    displayLoadStoredGraphsSheets,
} = nodeGraphSlice.actions;

export const chatModelOptions = (state: RootState) =>
    state.nodeGraph.chatModelOptions;

export default nodeGraphSlice.reducer;
