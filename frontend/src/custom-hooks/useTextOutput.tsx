import GraphUtils from '@/app/utils/graphUtils';
import handleIds from '@/components/custom/template-graphs/handle-ids';
import { TextOutputNodeData } from '@/types/nodeGraphTypes';
import { Edge, Node, useReactFlow } from 'reactflow';

export default function useTextOutputNode() {
    const reactFlow = useReactFlow();

    const findTextOutputNodesGivenAnyNodeId = (nodeId: string) => {
        //todo: Make generic
        const textOutputNodes = [];

        const targetEdges = reactFlow
            .getEdges()
            .filter((e) => e.source === nodeId);
        +handleIds.chatModelNode.targetHandles.prompt;
        const outputEdges = targetEdges.filter(
            (tEdge) =>
                tEdge.targetHandle &&
                tEdge.targetHandle.includes(
                    'textOutput' +
                        handleIds.outputTextNode.targetHandles.textTarget,
                ),
        );

        for (const outputEdge of outputEdges) {
            const tNode = reactFlow
                .getNodes()
                .find(
                    (n) => n.id === outputEdge?.target,
                ) as Node<TextOutputNodeData>;

            if (tNode) {
                textOutputNodes.push(tNode);
            }
        }

        return textOutputNodes;
    };

    const updateTextOutputNode = (nodeId: string, responseData?: string) => {
        const textOutputNodes = findTextOutputNodesGivenAnyNodeId(nodeId);

        //////////////////////////////////////////////////////////////////
        // update mutiple node with data
        const dataMap = new Map<string, Partial<TextOutputNodeData>>();

        textOutputNodes.forEach((tNode) => {
            const dataValue = {
                output: {
                    text: responseData ?? '',
                },
            };

            dataMap.set(tNode.id, dataValue);
        });

        GraphUtils.updateMultiNodeData<TextOutputNodeData>(reactFlow, dataMap);
    };

    return { findTextOutputNodesGivenAnyNodeId, updateTextOutputNode };
}
