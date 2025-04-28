import { useAppDispatch } from '@/app/hooks';
import GraphUtils from '@/app/utils/graphUtils';
import handleIds from '@/components/custom/template-graphs/handle-ids';
import { ExecutionState } from '@/components/enums/Enums';
import { toast } from '@/components/ui/use-toast';
import {
    setExecution,
    setNodeState,
} from '@/features/nodeGraphState/nodeGraphSlice';
import DocumentProcessingService from '@/services/DocumentProcessingService';
import { TextOutputNodeData } from '@/types/nodeGraphTypes';
import { isAxiosError } from 'axios';
import { useCallback } from 'react';
import { Edge, Node, useReactFlow } from 'reactflow';

const useExecuteDocumentNode = () => {
    const dispatch = useAppDispatch();

    const reactFlow = useReactFlow();

    const executeDocumentInputNode = useCallback(
        async (documentNode: Node) => {
            dispatch(
                setExecution({ isExecuting: true, nodeId: documentNode.id }),
            );
            dispatch(
                setNodeState({
                    nodeId: documentNode.id,
                    nodeState: ExecutionState.executing,
                }),
            );

            const data = documentNode?.data.documents;

            console.log(
                '==================   DocumentProcessingService   ==================   ',
            );

            // find reactFlow.getEdges() where currentNode is the source
            const targetEdges = reactFlow
                .getEdges()
                .filter((e) => e.source === documentNode.id);

            // Of all the reactFlow.getEdges() where current node is the  input/source
            // find the one(s) which are connected to an ouputTextNode
            const edgeConnectedToOutputNodes = targetEdges.filter(
                (e) =>
                    e.targetHandle?.includes(
                        'textOutput' +
                            handleIds.outputTextNode.targetHandles.textTarget,
                    ),
            );

            for (const edgeConnectedToOutputNode of edgeConnectedToOutputNodes) {
                console.log(edgeConnectedToOutputNode);

                const isNodeInsideNodeArray = reactFlow
                    .getNodes()
                    .map((i) => i.id)
                    .includes(edgeConnectedToOutputNode.target);
                if (edgeConnectedToOutputNode && isNodeInsideNodeArray) {
                    // download text to send to textoutput node
                    const response =
                        await DocumentProcessingService.retrieveStoredDocuments(
                            data,

                            documentNode.id,
                        );

                    if (isAxiosError(response)) {
                        dispatch(setExecution({ isExecuting: false }));

                        dispatch(
                            setNodeState({
                                nodeId: documentNode.id,
                                nodeState: ExecutionState.error,
                            }),
                        );

                        toast({
                            title: 'Error ',
                            description: `Error retrieving documents`,
                            className: ' text-red-500',
                        });

                        return;
                    }

                    // reformat the data to be displayed in the textOutput node
                    const documentPromptData = response.data
                        .map(
                            (item: {
                                file_name: string;
                                data: string;
                                file_path: string;
                                node_id: number | string;
                            }) =>
                                `file_name: ${item.file_name}\n\ncontent: ${item.data}`,
                        )
                        .join('\n\n\n');

                    const tNode = reactFlow
                        .getNodes()
                        .find(
                            (n) => n.id === edgeConnectedToOutputNode.target,
                        ) as Node<TextOutputNodeData>;

                    //update output node with the data

                    const dataValue: TextOutputNodeData = {
                        ...tNode.data,

                        output: {
                            text: documentPromptData,
                        },
                    };

                    GraphUtils.updateNodeData<TextOutputNodeData>(
                        reactFlow,
                        tNode.id,
                        dataValue,
                    );
                }
            }

            dispatch(
                setNodeState({
                    nodeId: documentNode.id,
                    nodeState: ExecutionState.success,
                }),
            );
        },
        [dispatch, reactFlow],
    );

    return { executeDocumentInputNode };
};

export default useExecuteDocumentNode;
