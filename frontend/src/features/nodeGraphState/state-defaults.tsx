import { ExecutionState } from '@/components/enums/Enums';
import {
    ChatModelNodeData,
    ChatOpenAIConfiguration,
    DocumentInputNodeData,
    ImageInputNodeData,
    OutputNodeData,
    TextInputNodeData,
    TextOutputNodeData,
    VectorSearchNodeData,
} from '@/types/nodeGraphTypes';
import { Edge, Node } from 'reactflow';

import * as defaultStyles from './style-defaults';

export const chatModelConfigDefault: ChatOpenAIConfiguration = {
    cache: false,

    defaultHeaders: {},
    defaultQuery: {},
    httpClient: null, // Replace with actual default value if available
    maxRetries: 2,
    maxTokens: 2048,
    top_p: 1,
    metadata: {},
    modelKwargs: {},
    modelName: 'gpt-4o-mini',
    n: 1,

    streaming: false,
    tags: [],
    temperature: 0.7,
    verbose: false,
    model: '', // This should be set to a valid model ID
    prompt: '', // This should be set based on the use case
    bestOf: 1,
    echo: false,
    frequencyPenalty: 0,
    logitBias: null,
    logprobs: null,
    presencePenalty: 0,
    seed: null,
    stop: null,
    stream: false,
    suffix: null,

    user: undefined, // Optional field, set if required
};

export const initialNodes: Node<
    | TextInputNodeData
    | ChatModelNodeData
    | OutputNodeData
    | TextOutputNodeData
    | DocumentInputNodeData
    | VectorSearchNodeData
>[] = [
    //   {
    //     id: "5",
    //     type: "textOutput",
    //     position: { x: 700, y: 400 },
    //     data: {
    //       output: {
    //         text: `
    //         Certainly! Here are five concepts for retro-style arcade games:
    // 1. **Galactic Invader Quest**: Players control a spaceship fighting off waves of alien invaders in a pixelated, side-scrolling shooter. Each level introduces new alien types and boss fights, with power-ups and special weapons scattered throughout. The retro aesthetic is complemented by chiptune music and sound effects.
    // 2. **Neon Racer 2080**: In this top-down arcade racer set in a cyberpunk future, players navigate neon-lit cityscapes with retro-futuristic cars. The game features power sliding mechanics, police chases, and upgradeable vehicles, all wrapped up in an '80s synthwave soundtrack.
    // 3. **Pixel Quest: Dungeon Explorer**: This is a dungeon crawler with a retro 8-bit style where players choose a class (warrior, mage, rogue) and delve into procedurally generated dungeons filled with monsters, traps, and treasures. The goal is to reach the bottom level and defeat the final boss.
    // 4. **Retro Beatdown: Street Brawl**: Inspired by classic beat 'em ups, players fight through gang-infested streets to save their city. The game features cooperative play for up to four players, combo systems, and a variety of melee and ranged weapons. Pixel art and a gritty urban soundtrack set the mood.
    // 5. **Arcade Island Adventure**: Players embark on a quest across various islands, each with distinct environments and challenges. They'll solve puzzles, jump over obstacles, and defeat quirky bosses. The game combines platforming mechanics with adventure elements, presented in a colorful 16-bit style.
    // These games would capture the essence of classic arcade gaming while providing modern players with a nostalgic yet fresh experience.
    //         `,
    //       },
    //       label: "Text output",
    //       executionState: ExecutionState.ready,
    //     },
    //     style: defaultStyles.textOutputNodeStyle,
    //   },
];

export const initialEdge: Edge[] = [];

type AvailableNodesType = {
    chatModelNode: Node<ChatModelNodeData>;
    inputTextNode: Node<TextInputNodeData>;
    outputTextNode: Node<TextOutputNodeData>;
    inputImageNode: Node<ImageInputNodeData>;
    inputDocumentNode: Node<DocumentInputNodeData>;
    vectorSearchNode: Node<VectorSearchNodeData>;
};

export const AVAILABLE_NODES: AvailableNodesType = {
    chatModelNode: {
        id: '',
        type: 'chatModel',
        position: { x: 0, y: 0 },
        data: {
            modelName: 'gpt-4o',
            label: 'Chat model',
            configs: chatModelConfigDefault,
            executionState: ExecutionState.ready,
        },
        style: defaultStyles.chatNodeStyle,
    },
    inputTextNode: {
        id: '',
        type: 'textInput',
        position: { x: 0, y: 0 },
        data: {
            prompt: {
                textPrompt: '',
            },

            label: 'Text Input',
            executionState: ExecutionState.ready,
        },
        style: defaultStyles.textInputNodeStyle,
    },

    outputTextNode: {
        id: '',
        type: 'textOutput',
        position: { x: 0, y: 0 },
        data: {
            output: {
                text: '',
            },

            label: 'Text Output',
            executionState: ExecutionState.ready,
        },
        style: defaultStyles.textOutputNodeStyle,
    },
    inputImageNode: {
        id: '',
        type: 'imageInput',
        position: { x: 0, y: 0 },
        data: {
            executionState: ExecutionState.ready,

            images: [],
            label: 'Image Input',
        },
        style: defaultStyles.imageInputNodeStyle,
    },

    inputDocumentNode: {
        id: '',
        type: 'documentInput',
        position: { x: 0, y: 0 },
        data: {
            documents: [],
            label: 'Document Input',
            executionState: ExecutionState.ready,
        },
        style: defaultStyles.documentInputNodeStyle,
    },

    vectorSearchNode: {
        id: '',
        type: 'vectorSearch',
        position: { x: 0, y: 0 },
        data: {
            documents: [],
            isSearchable: false,
            label: 'Search Document',
            executionState: ExecutionState.ready,
        },
        style: defaultStyles.vectorSearchNodeStyle,
    },
};
