
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
