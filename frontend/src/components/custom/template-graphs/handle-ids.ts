import { AVAILABLE_NODES } from '@/features/nodeGraphState/state-defaults';

// chatModelNode: {
//     id: "",
//     type: "chatModel",

//     style: defaultStyles.chatNodeStyle,
//   },
//   inputTextNode: {
//     id: "",
//     type: "textInput",

//   },

//   outputTextNode: {
//     id: "",
//     type: "textOutput",

//   },
//   inputImageNode: {
//     id: "",
//     type: "imageInput",

//   },

//   inputDocumentNode: {
//     id: "",
//     type: "documentInput",
//     position: { x: 0, y: 0 },
//     data: {
//       documents: [],
//       label: "Document Input",
//       executionState: ExecutionState.ready,
//     },
//     style: defaultStyles.documentInputNodeStyle,
//   },

//   vectorSearchNode: {
//     id: "",
//     type: "vectorSearch",

//   },

export type HandleIds = {
    [key: string]: {
        sourceHandles: {
            [key: string]: string;
        };
        targetHandles: { [key: string]: string };
    };
};

const handleIds = {
    inputTextNode: {
        sourceHandles: {
            textSource: '-text-source-',
        },
    },
    inputImageNode: {
        sourceHandles: {
            imageSource: '-image-source-',
        },
    },
    inputDocumentNode: {
        sourceHandles: {
            processedDocumentSource: '-document-source-',
        },
    },
    chatModelNode: {
        targetHandles: {
            systemPrompt: '-system-prompt-',
            prompt: '-prompt-',
            documentPrompt: '-document-prompt-',
            imagePrompt: '-image-prompt-',
        },
        sourceHandles: {
            textSource: '-text-source-',
        },
    },

    outputTextNode: {
        sourceHandles: {
            textSource: '-text-source-',
        },
        targetHandles: {
            textTarget: '-text-target-',
        },
    },

    vectorSearchNode: {
        sourceHandles: {
            searchTextInput: '-search-text-source-',
        },
        targetHandles: {
            searchTextOutput: '-search-text-target-',
        },
    },
};

export default handleIds;
