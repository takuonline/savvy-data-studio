import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { ExecutionState } from '@/components/enums/Enums';
import { toast } from '@/components/ui/use-toast';
import { useExecuteChatModelNode } from '@/custom-hooks/useExecuteChatModelNode';
import {
    setExecution,
    setNodeState,
} from '@/features/nodeGraphState/nodeGraphSlice';
import { TextOutputNodeData } from '@/types/nodeGraphTypes';
import { useCallback } from 'react';
import { Edge, Node, useReactFlow } from 'reactflow';

import useExecuteDocumentNode from './useExecuteDocumentNode';
import useTextOutputNode from './useTextOutput';

export default function useClickNodeExecution() {
    const dispatch = useAppDispatch();
    const { getEdges, getNodes, getNode } = useReactFlow();
    const { executeChatModelNode } = useExecuteChatModelNode();
    const { executeDocumentInputNode } = useExecuteDocumentNode();
    const { findTextOutputNodesGivenAnyNodeId } = useTextOutputNode();

    const singleNodeExecutionState = useAppSelector(
        (state: RootState) => state.nodeGraph.singleNodeExecution,
    );
    const onClickNodeExecution = useCallback(
        async (node?: Node) => {
            const selectedNodeForExecution =
                node ?? singleNodeExecutionState.node;

            if (
                selectedNodeForExecution &&
                selectedNodeForExecution.type === 'chatModel'
            ) {
                ////////////////////////////////////////////////////////////
                ///  handle execution of chat node
                ////////////////////////////////////////////////////////////
                dispatch(
                    setExecution({
                        nodeId: selectedNodeForExecution.id,
                        isExecuting: true,
                    }),
                );

                await executeChatModelNode(selectedNodeForExecution);
                dispatch(setExecution({ isExecuting: false }));
            } else if (
                selectedNodeForExecution &&
                selectedNodeForExecution.type === 'documentInput'
            ) {
                ////////////////////////////////////////////////////////////
                ///  handle execution of document node
                ////////////////////////////////////////////////////////////

                //TODO: Fix duplicated logic

                (async () => {
                    // find edges where current executing Node is the source
                    const edgesWhereExecutingNodeIsSource = getEdges().filter(
                        (e) => e.source == selectedNodeForExecution?.id,
                    );

                    if (edgesWhereExecutingNodeIsSource) {
                        for (const e of edgesWhereExecutingNodeIsSource) {
                            // iterate over the edges in case there are multiple edges
                            // and execute all patsh
                            const tNode = getNodes().find(
                                (n) => n.id === e.target,
                            );

                            if (tNode?.type === 'chatModel') {
                                dispatch(
                                    setExecution({
                                        nodeId: tNode.id,
                                        isExecuting: true,
                                    }),
                                );

                                const res = await executeChatModelNode(tNode);

                                if (res == ExecutionState.error) {
                                    return;
                                }
                                // } else if (  tNode?.type === "documentInput" ) {
                                //   await executeDocumentInputNode(tNode, );
                            } else if (tNode?.type === 'textOutput') {
                                await executeDocumentInputNode(
                                    selectedNodeForExecution,
                                );
                            }
                        }
                    }

                    dispatch(setExecution({ isExecuting: false }));
                })();
            } else if (
                // isGraphExecuting &&
                // singleNodeExecutionState.isExecutingSetOn &&
                selectedNodeForExecution
            ) {
                ////////////////////////////////////////////////////////////
                ///  handle execution of node that is NOT chat or document
                ////////////////////////////////////////////////////////////

                const fullExecutionScope: Node[] = [];

                const executeNodeThatIsNotChatOrDocumentNodeRecursively =
                    async (executingNode: Node | undefined) => {
                        const executedTargetNodes: Node[] = [];

                        // find edges where current executing Node is the source
                        const edgesWhereExecutingNodeIsSource =
                            getEdges().filter(
                                (e) => e.source == executingNode?.id,
                            );

                        if (edgesWhereExecutingNodeIsSource) {
                            for (const e of edgesWhereExecutingNodeIsSource) {
                                // iterate over the edges in case there are multiple edges
                                // and execute all patsh
                                const tNode = getNode(e.target);

                                const hasNodeAlreadyExecuted =
                                    fullExecutionScope.find(
                                        (v) => v.id === tNode?.id,
                                    );

                                if (tNode && !hasNodeAlreadyExecuted) {
                                    tNode && executedTargetNodes.push(tNode);
                                } else {
                                    console.log(
                                        '==== node already executed ====',
                                    );

                                    //node has a been executed before
                                    continue;
                                }

                                if (tNode?.type === 'chatModel') {
                                    const res =
                                        await executeChatModelNode(tNode);

                                    if (res === ExecutionState.error) {
                                        return;
                                    }
                                } else if (tNode?.type === 'documentInput') {
                                    await executeDocumentInputNode(tNode);
                                } else {
                                    // raise error, node should not be here
                                    dispatch(
                                        setNodeState({
                                            nodeId: tNode?.id ?? '',
                                            nodeState: ExecutionState.error,
                                        }),
                                    );

                                    toast(
                                        <div>
                                            <p className="text-destructive">
                                                Error: Wrong node connection.
                                                Cannot connect{' '}
                                                {tNode?.data.label} and{' '}
                                                {executingNode?.data.label}
                                            </p>
                                        </div>,
                                    );

                                    return;
                                }
                            }
                        }

                        console.log('continue the graph recursively');

                        ////////////////////////////////////////////////////////////
                        ///  continue the graph  recursively
                        ////////////////////////////////////////////////////////////

                        // const uniqueExecutedTargetNodes = executedTargetNodes.filter(
                        //   (value, index, self) =>
                        //     index === self.findIndex((t) => t?.id === value?.id),
                        // );

                        /// first find all [Output nodes]
                        let textOutputNodesStore =
                            [] as Node<TextOutputNodeData>[];

                        for (const executedNode of executedTargetNodes) {
                            const nodeId = executedNode?.id;
                            if (nodeId) {
                                const textOutputNodes =
                                    findTextOutputNodesGivenAnyNodeId(nodeId);

                                textOutputNodesStore.push(...textOutputNodes);
                            }
                        }

                        if (!textOutputNodesStore) {
                            return;
                        }

                        fullExecutionScope.push(...executedTargetNodes);

                        for (const textOutputNode of textOutputNodesStore) {
                            await executeNodeThatIsNotChatOrDocumentNodeRecursively(
                                textOutputNode,
                            );
                        }
                    };

                //create and execute callback function
                (async () => {
                    // call recursive function

                    await executeNodeThatIsNotChatOrDocumentNodeRecursively(
                        selectedNodeForExecution,
                    );

                    dispatch(setExecution({ isExecuting: false }));
                })();
            }
        },
        [
            dispatch,
            executeChatModelNode,
            executeDocumentInputNode,
            findTextOutputNodesGivenAnyNodeId,
            getEdges,
            getNode,
            getNodes,
            singleNodeExecutionState.node,
        ],
    );

    return {
        onClickNodeExecution,
    };
}
