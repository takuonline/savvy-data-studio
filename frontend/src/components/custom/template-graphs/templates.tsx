import * as utils from '@/app/utils/utils';
import { AVAILABLE_NODES } from '@/features/nodeGraphState/state-defaults';
import {  NodeDataType } from '@/types/nodeGraphTypes';
import { Edge, Node, XYPosition } from 'reactflow';

import handleIds from './handle-ids';

AVAILABLE_NODES;

type TemplateType = {
    nodes: {
        [key: string]: Node<NodeDataType>;
    };
    edges: Edge[];
};

export const TEMPLATES: { [key: string]: TemplateType } = {
    template1: {
        nodes: {
            prompt: {
                ...AVAILABLE_NODES.inputTextNode,
                position: {
                    x: 110,
                    y: 527,
                },
            },
            chatModel: {
                ...AVAILABLE_NODES.chatModelNode,
                position: {
                    x: 600,
                    y: 527,
                },
            },
            outputText: {
                ...AVAILABLE_NODES.outputTextNode,
                position: {
                    x: 1026,
                    y: 491,
                },
            },
        },

        edges: [
            {
                source: 'prompt',
                target: 'chatModel',
                sourceHandle: handleIds.inputTextNode.sourceHandles.textSource,
                targetHandle: handleIds.chatModelNode.targetHandles.prompt,
                id: '',
            },

            {
                source: 'chatModel',
                target: 'outputText',
                sourceHandle: handleIds.chatModelNode.sourceHandles.textSource,
                targetHandle: handleIds.outputTextNode.targetHandles.textTarget,

                id: '',
            },
        ],
    },
    template2: {
        nodes: {
            prompt: {
                ...AVAILABLE_NODES.inputTextNode,
                position: {
                    x: 110,
                    y: 593,
                },
            },
            systemPrompt: {
                ...AVAILABLE_NODES.inputTextNode,
                position: {
                    x: 110,
                    y: 343,
                },
            },

            chatModel: {
                ...AVAILABLE_NODES.chatModelNode,
                position: {
                    x: 618,
                    y: 527,
                },
            },
            outputText: {
                ...AVAILABLE_NODES.outputTextNode,
                position: {
                    x: 1026,
                    y: 491,
                },
            },
        },

        edges: [
            {
                source: 'systemPrompt',
                target: 'chatModel',
                sourceHandle: handleIds.inputTextNode.sourceHandles.textSource,
                targetHandle:
                    handleIds.chatModelNode.targetHandles.systemPrompt,
                id: '',
            },

            {
                source: 'prompt',
                target: 'chatModel',
                sourceHandle: handleIds.inputTextNode.sourceHandles.textSource,
                targetHandle: handleIds.chatModelNode.targetHandles.prompt,
                id: '',
            },

            {
                source: 'chatModel',
                target: 'outputText',
                sourceHandle: handleIds.chatModelNode.sourceHandles.textSource,
                targetHandle: handleIds.outputTextNode.targetHandles.textTarget,

                id: '',
            },
        ],
    },
    template3: {
        nodes: {
            prompt: {
                ...AVAILABLE_NODES.inputTextNode,
                position: {
                    x: 100,
                    y: 500,
                },
            },
            // systemPrompt: {
            //   ...AVAILABLE_NODES.inputTextNode,
            //   position: {
            //     x: 110,
            //     y: 343,
            //   },
            // },
            documentPrompt: {
                ...AVAILABLE_NODES.inputDocumentNode,
                position: {
                    x: 100,
                    y: 800,
                },
            },
            chatModel: {
                ...AVAILABLE_NODES.chatModelNode,
                position: {
                    x: 600,
                    y: 500,
                },
            },
            outputText: {
                ...AVAILABLE_NODES.outputTextNode,
                position: {
                    x: 1026,
                    y: 500,
                },
            },
        },

        edges: [
            // {
            //   source: "systemPrompt",
            //   target: "chatModel",
            //   sourceHandle: handleIds.inputTextNode.sourceHandles.textSource,
            //   targetHandle: handleIds.chatModelNode.targetHandles.systemPrompt,
            //   id: "",
            // },

            {
                source: 'prompt',
                target: 'chatModel',
                sourceHandle: handleIds.inputTextNode.sourceHandles.textSource,
                targetHandle: handleIds.chatModelNode.targetHandles.prompt,
                id: '',
            },

            {
                source: 'documentPrompt',
                target: 'chatModel',
                sourceHandle:
                    handleIds.inputDocumentNode.sourceHandles
                        .processedDocumentSource,
                targetHandle:
                    handleIds.chatModelNode.targetHandles.documentPrompt,
                id: '',
            },

            {
                source: 'chatModel',
                target: 'outputText',
                sourceHandle: handleIds.chatModelNode.sourceHandles.textSource,
                targetHandle: handleIds.outputTextNode.targetHandles.textTarget,

                id: '',
            },
        ],
    },
    template4: {
        nodes: {
            prompt: {
                ...AVAILABLE_NODES.inputTextNode,
                position: {
                    x: 110,
                    y: 593,
                },
            },
            systemPrompt: {
                ...AVAILABLE_NODES.inputTextNode,
                position: {
                    x: 110,
                    y: 343,
                },
            },
            documentPrompt: {
                ...AVAILABLE_NODES.inputDocumentNode,
                position: {
                    x: 110,
                    y: 856,
                },
            },
            chatModel: {
                ...AVAILABLE_NODES.chatModelNode,
                position: {
                    x: 618,
                    y: 527,
                },
            },
            outputText: {
                ...AVAILABLE_NODES.outputTextNode,
                position: {
                    x: 1026,
                    y: 491,
                },
            },

            outputTextDocument: {
                ...AVAILABLE_NODES.outputTextNode,
                position: {
                    x: 618,
                    y: 856,
                },
            },
        },

        edges: [
            {
                source: 'systemPrompt',
                target: 'chatModel',
                sourceHandle: handleIds.inputTextNode.sourceHandles.textSource,
                targetHandle:
                    handleIds.chatModelNode.targetHandles.systemPrompt,
                id: '',
            },

            {
                source: 'prompt',
                target: 'chatModel',
                sourceHandle: handleIds.inputTextNode.sourceHandles.textSource,
                targetHandle: handleIds.chatModelNode.targetHandles.prompt,
                id: '',
            },

            {
                source: 'documentPrompt',
                target: 'chatModel',
                sourceHandle:
                    handleIds.inputDocumentNode.sourceHandles
                        .processedDocumentSource,
                targetHandle:
                    handleIds.chatModelNode.targetHandles.documentPrompt,
                id: '',
            },

            {
                source: 'chatModel',
                target: 'outputText',
                sourceHandle: handleIds.chatModelNode.sourceHandles.textSource,
                targetHandle: handleIds.outputTextNode.targetHandles.textTarget,

                id: '',
            },

            {
                source: 'documentPrompt',
                target: 'outputTextDocument',
                sourceHandle:
                    handleIds.inputDocumentNode.sourceHandles
                        .processedDocumentSource,
                targetHandle: handleIds.outputTextNode.targetHandles.textTarget,
                id: '',
            },
        ],
    },
    template5: {
        nodes: {
            prompt: {
                ...AVAILABLE_NODES.inputTextNode,
                position: {
                    x: 110,
                    y: 593,
                },
            },
            systemPrompt: {
                ...AVAILABLE_NODES.inputTextNode,
                position: {
                    x: 110,
                    y: 343,
                },
            },
            documentPrompt: {
                ...AVAILABLE_NODES.inputDocumentNode,
                position: {
                    x: 110,
                    y: 856,
                },
            },
            chatModel: {
                ...AVAILABLE_NODES.chatModelNode,
                position: {
                    x: 618,
                    y: 527,
                },
            },

            outputText: {
                ...AVAILABLE_NODES.outputTextNode,
                position: {
                    x: 1026,
                    y: 500,
                },
            },
            chatModel2: {
                ...AVAILABLE_NODES.chatModelNode,
                position: {
                    x: 1700,
                    y: 380,
                },
            },

            prompt2: {
                ...AVAILABLE_NODES.inputTextNode,
                position: {
                    x: 1026,
                    y: 200,
                },
            },

            outputText2: {
                ...AVAILABLE_NODES.outputTextNode,
                position: {
                    x: 2100,
                    y: 200,
                },
            },

            outputTextDocument: {
                ...AVAILABLE_NODES.outputTextNode,
                position: {
                    x: 618,
                    y: 856,
                },
            },
        },

        edges: [
            {
                source: 'systemPrompt',
                target: 'chatModel',
                sourceHandle: handleIds.inputTextNode.sourceHandles.textSource,
                targetHandle:
                    handleIds.chatModelNode.targetHandles.systemPrompt,
                id: '',
            },

            {
                source: 'prompt',
                target: 'chatModel',
                sourceHandle: handleIds.inputTextNode.sourceHandles.textSource,
                targetHandle: handleIds.chatModelNode.targetHandles.prompt,
                id: '',
            },

            {
                source: 'documentPrompt',
                target: 'chatModel',
                sourceHandle:
                    handleIds.inputDocumentNode.sourceHandles
                        .processedDocumentSource,
                targetHandle:
                    handleIds.chatModelNode.targetHandles.documentPrompt,
                id: '',
            },

            {
                source: 'chatModel',
                target: 'outputText',
                sourceHandle: handleIds.chatModelNode.sourceHandles.textSource,
                targetHandle: handleIds.outputTextNode.targetHandles.textTarget,

                id: '',
            },

            {
                source: 'documentPrompt',
                target: 'outputTextDocument',
                sourceHandle:
                    handleIds.inputDocumentNode.sourceHandles
                        .processedDocumentSource,
                targetHandle: handleIds.outputTextNode.targetHandles.textTarget,
                id: '',
            },

            {
                source: 'outputText',
                target: 'chatModel2',
                sourceHandle: handleIds.outputTextNode.sourceHandles.textSource,
                targetHandle: handleIds.chatModelNode.targetHandles.prompt,
                id: '',
            },

            {
                source: 'prompt2',
                target: 'chatModel2',
                sourceHandle: handleIds.inputTextNode.sourceHandles.textSource,
                targetHandle:
                    handleIds.chatModelNode.targetHandles.systemPrompt,
                id: '',
            },

            {
                source: 'chatModel2',
                target: 'outputText2',
                sourceHandle: handleIds.chatModelNode.sourceHandles.textSource,
                targetHandle: handleIds.outputTextNode.targetHandles.textTarget,
                id: '',
            },
        ],
    },
};

function updateNewNode(newNode: Node<NodeDataType>, position?: XYPosition) {
    newNode.id = utils.makeid();

    //  x+1 <---- x ---->x-1

    //           y+1
    //           / \
    //            |
    //            y
    //            |
    //           \ /
    //           y-1

    if (position) {
        newNode.position = {
            x: newNode.position.x - position.x,
            y: newNode.position.y - position.y,
        } as XYPosition;
    }

    return newNode;
}

export function getTemplate(templateId: string, position?: XYPosition) {
    const template = JSON.parse(JSON.stringify(TEMPLATES[templateId]));

    const nodes: Node[] = [];
    const edges: Edge[] = template.edges;
    console.log('========  position  ========');

    console.log(position);

    for (var i = 0; i < Object.keys(template.nodes).length; i++) {
        let nodeKey = Object.keys(template.nodes)[i];

        template.nodes[nodeKey] = updateNewNode(
            template.nodes[nodeKey],
            position,
        );

        nodes.push(template.nodes[nodeKey]);
    }

    for (const edge of edges) {
        const sNode = template.nodes[edge.source] as Node;

        edge.id = utils.makeid();

        edge.source = sNode.id;
        edge.sourceHandle = (sNode.type ?? '') + edge.sourceHandle + sNode.id;
        console.log(sNode.type ?? '' + edge.sourceHandle + sNode.id);
        console.log('sNode.type:', sNode.type);

        console.log('edge.sourceHandle:', edge.sourceHandle);
        console.log('sNode.id:', sNode.id);

        console.log('edge.sourceHandle:', edge.sourceHandle);

        const tNode = template.nodes[edge.target] as Node;
        edge.target = tNode.id;
        edge.targetHandle = (tNode.type ?? '') + edge.targetHandle + tNode.id;
    }

    return {
        edges,
        nodes,
    };
}

export type NodeTemplate = {
    templateTitle: string;
    templateId: string;
};

export const nodeTemplates: NodeTemplate[] = [
    {
        templateTitle: 'Basic Template',
        templateId: 'template1',
    },

    {
        templateTitle: 'System prompt Template',
        templateId: 'template2',
    },

    {
        templateTitle: 'Document prompt Template',
        templateId: 'template3',
    },
    {
        templateTitle: 'Document prompt with textOutput Template',
        templateId: 'template4',
    },

    {
        templateTitle: 'Multilayer Document prompt Template',
        templateId: 'template5',
    },
];
