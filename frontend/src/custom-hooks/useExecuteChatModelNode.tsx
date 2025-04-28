import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import handleIds from '@/components/custom/template-graphs/handle-ids';
import { ExecutionState } from '@/components/enums/Enums';
import { toast } from '@/components/ui/use-toast';
import {
    setExecution,
    setNodeState,
} from '@/features/nodeGraphState/nodeGraphSlice';
import { chatModelConfigDefault } from '@/features/nodeGraphState/state-defaults';
import NodeGraphServices from '@/services/NodeGraphServices';
import { ChatModelPrompt } from '@/types/graphExecutionTypes';
import {
    ChatModelNodeData,
    DocumentInputNodeData,
    ImageInputNodeData,
    ModelQueryData,
    TextInputNodeData,
    TextOutputNodeData,
} from '@/types/nodeGraphTypes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Edge, Node, useReactFlow } from 'reactflow';

import useStreamResponse from './useStreamResponse';

const useExecuteChatModelNode = () => {
    const dispatch = useAppDispatch();
    const reactFlow = useReactFlow();

    const openaiKeyId = useAppSelector(
        (state: RootState) => state.nodeGraph.settings.openaiKeyId,
    );

    const { triggerStreaming } = useStreamResponse();

    const prepareRequest = useCallback(
        (request: ChatModelPrompt, data: ChatModelNodeData) => {
            if (!openaiKeyId) {
                toast({
                    title: 'Error ',
                    description: 'Please enter an API Key in the settings',
                    className: ' text-red-500',
                });

                return;
            }

            const chatModel = {
                model_name: data.modelName,
                temperature: data.configs?.temperature,
                max_tokens: data.configs?.maxTokens,
                max_retries: data.configs?.maxRetries,
            };

            const chatPrompt = {
                system_prompt: request.systemPrompt,
                human_prompt: request.humanPrompt,
                document_prompt: request.documentPrompt,
                document_urls: request.documentUrls,
            };

            const queryData: ModelQueryData = {
                api_key_id: openaiKeyId,
                chat_model: chatModel,
                chat_prompt: chatPrompt,
                config: request.config,
            };

            console.log(
                '==================   queryData   ==================   ',
            );
            console.log(queryData);

            return queryData;
        },
        [openaiKeyId],
    );

    // const sendRequest = useCallback(
    //     async (request: ChatModelPrompt, data: ChatModelNodeData) => {
    //         const queryData = prepareRequest(request, data);

    //         if (!queryData) {
    //             return;
    //         }

    //         const response = await NodeGraphServices.executeNodeGraph({
    //             queryData,
    //         });

    //         if (isAxiosError(response)) {
    //             if (response.message) {
    //                 toast({
    //                     title: 'Error ',
    //                     description: response.message,
    //                     className: ' text-red-500',
    //                 });

    //                 return;
    //             } else {
    //                 toast({
    //                     title: 'Error ',
    //                     description:
    //                         'An error occured while executing the graph',
    //                     className: ' text-red-500',
    //                 });
    //             }
    //         }

    //         return response;
    //     },
    //     [prepareRequest],
    // );

    const executeChatModelNode = useCallback(
        async (chatModelNode: Node<ChatModelNodeData>) => {
            dispatch(
                setExecution({ nodeId: chatModelNode.id, isExecuting: true }),
            );

            const request: ChatModelPrompt = {
                systemPrompt: '',
                humanPrompt: '',
                imagePrompt: [],
                documentPrompt: '',
                documentUrls: [],
                config: {
                    doc_chunk_size: chatModelConfigDefault.maxTokens,
                },
            };

            const sourceEdges = reactFlow
                .getEdges()
                .filter((e) => e.target === chatModelNode.id);

            for (const sEdge of sourceEdges) {
                console.log(sEdge);
                console.log(
                    'chatModel' + handleIds.chatModelNode.targetHandles.prompt,
                );
                console.log(
                    'textInput' +
                        handleIds.inputTextNode.sourceHandles.textSource,
                );

                /////////////////////////       system-prompt node input       /////////////////////////
                if (
                    sEdge.targetHandle?.includes(
                        'chatModel' +
                            handleIds.chatModelNode.targetHandles.systemPrompt,
                    ) &&
                    sEdge.sourceHandle?.includes(
                        'textInput' +
                            handleIds.inputTextNode.sourceHandles.textSource,
                    )
                ) {
                    const sNode = reactFlow
                        .getNodes()
                        .find(
                            (n) => n.id === sEdge.source,
                        ) as Node<TextInputNodeData>;
                    request.systemPrompt += sNode?.data.prompt.textPrompt;

                    if (!sNode || !sNode.data.prompt.textPrompt) {
                        dispatch(setExecution({ isExecuting: false }));
                        //flag error node

                        dispatch(
                            setNodeState({
                                nodeId: sNode.id,
                                nodeState: ExecutionState.error,
                            }),
                        );
                        //remove is executing state on chat node
                        dispatch(
                            setNodeState({
                                nodeId: chatModelNode.id,
                                nodeState: ExecutionState.ready,
                            }),
                        );

                        if (sNode && !sNode.data.prompt.textPrompt) {
                            // if node is avalable but text prompt is empty
                            toast({
                                title: 'Error ',
                                description:
                                    'Please enter a prompt into the system text input Node',
                                className: ' text-red-500',
                            });
                        }

                        return ExecutionState.error;
                    } else {
                        dispatch(
                            setNodeState({
                                nodeId: sNode.id,
                                nodeState: ExecutionState.success,
                            }),
                        );
                    }
                }

                /////////////////////////    prompt node input    /////////////////////////
                else if (
                    sEdge.targetHandle?.includes(
                        'chatModel' +
                            handleIds.chatModelNode.targetHandles.prompt,
                    ) &&
                    sEdge.sourceHandle?.includes(
                        'textInput' +
                            handleIds.inputTextNode.sourceHandles.textSource,
                    )
                ) {
                    const sNode = reactFlow
                        .getNodes()
                        .find(
                            (n) => n.id === sEdge.source,
                        ) as Node<TextInputNodeData>;
                    dispatch(
                        setExecution({ isExecuting: true, nodeId: sNode.id }),
                    );
                    console.log(sNode?.data.prompt);

                    request.humanPrompt += `\n
                                            *****************************************************\n
                                            ${sNode?.data.prompt.textPrompt}
                                            `;

                    if (!sNode || !sNode.data.prompt.textPrompt) {
                        dispatch(setExecution({ isExecuting: false }));

                        //remove is executing state on chatnode
                        dispatch(
                            setNodeState({
                                nodeId: chatModelNode.id,
                                nodeState: ExecutionState.ready,
                            }),
                        );

                        //flag error node
                        dispatch(
                            setNodeState({
                                nodeId: sNode.id,
                                nodeState: ExecutionState.error,
                            }),
                        );

                        if (sNode && !sNode.data.prompt.textPrompt) {
                            // if node is avalable but text prompt is empty
                            toast({
                                title: 'Error ',
                                description:
                                    'Please enter a prompt into the prompt text input Node',
                                className: ' text-red-500',
                            });
                        }

                        return ExecutionState.error;
                    } else {
                        dispatch(
                            setNodeState({
                                nodeId: sNode.id,
                                nodeState: ExecutionState.success,
                            }),
                        );
                    }
                }

                ///////////////////////// Image node input  /////////////////////////
                else if (
                    sEdge.targetHandle?.includes(
                        'chatModel' +
                            handleIds.chatModelNode.targetHandles.imagePrompt,
                    )
                ) {
                    const sNode = reactFlow
                        .getNodes()
                        .find(
                            (n) => n.id === sEdge.source,
                        ) as Node<ImageInputNodeData>;

                    dispatch(
                        setExecution({ isExecuting: true, nodeId: sNode.id }),
                    );

                    request.imagePrompt = sNode?.data.images.map(
                        (v) => new File([v], v),
                    );

                    dispatch(
                        setNodeState({
                            nodeId: sNode.id,
                            nodeState: ExecutionState.success,
                        }),
                    );
                }
                /////////////////////////       Document node input        /////////////////////////
                else if (
                    sEdge.targetHandle?.includes(
                        'chatModel' +
                            handleIds.chatModelNode.targetHandles
                                .documentPrompt,
                    )
                ) {
                    const sNode = reactFlow
                        .getNodes()
                        .find(
                            (n) => n.id === sEdge.source,
                        ) as Node<DocumentInputNodeData>;

                    dispatch(
                        setExecution({ isExecuting: true, nodeId: sNode.id }),
                    );

                    //TODO: instead of using blob, should fetch data using url
                    request.documentPrompt += sNode.data.documents.map(
                        (v) => v.blob,
                    );
                    request.documentUrls = sNode.data.documents.map(
                        (v) => v.url,
                    );
                    request.config.doc_chunk_size = sNode.data.contextLength;

                    dispatch(
                        setExecution({
                            isExecuting: true,
                            nodeId: chatModelNode.id,
                        }),
                    );
                }
                /////////////////////////       Text Output Node as input    /////////////////////////
                else if (
                    sEdge.targetHandle?.includes(
                        'chatModel' +
                            handleIds.chatModelNode.targetHandles.systemPrompt,
                    ) &&
                    sEdge.sourceHandle?.includes(
                        'textOutput' +
                            handleIds.outputTextNode.sourceHandles.textSource,
                    )
                ) {
                    const sNode = reactFlow
                        .getNodes()
                        .find(
                            (n) => n.id === sEdge.source,
                        ) as Node<TextOutputNodeData>;

                    request.systemPrompt =
                        request.systemPrompt + '\n\n' + sNode?.data.output.text;
                } else if (
                    sEdge.targetHandle?.includes(
                        'chatModel' +
                            handleIds.chatModelNode.targetHandles.prompt,
                    ) &&
                    sEdge.sourceHandle?.includes(
                        'textOutput' +
                            handleIds.outputTextNode.sourceHandles.textSource,
                    )
                ) {
                    const sNode = reactFlow
                        .getNodes()
                        .find(
                            (n) => n.id === sEdge.source,
                        ) as Node<TextOutputNodeData>;

                    request.humanPrompt =
                        request.humanPrompt +
                        `\n\n"""\n${sNode?.data.output.text}\n"""`;
                }
            }

            dispatch(
                setExecution({ isExecuting: true, nodeId: chatModelNode.id }),
            );

            //// STream response

            console.log(`==== Running node ${chatModelNode.id}  ==== `);

            // dispatch(
            //     setNodeState({
            //         nodeId:  chatModelNode.id,
            //         nodeState: ExecutionState.executing,
            //     }),
            // );

            const newChatState = {
                nodeId: chatModelNode.id,
                conversationId: chatModelNode.id,
                userPrompt: prepareRequest(request, chatModelNode.data),
            };

            return await triggerStreaming(newChatState);

            // await setChatStateAsync(newChatState)
            //     .then((response) => {
            //         console.log('Chat Model Node Executed');
            //         return response
            //     })
            //     .catch((error) => {
            //         console.log('Chat Model Node Error');
            //         console.log(error);
            //         return ExecutionState.error;
            //     });

            //  /////////////////////////////////////   sendRequest    /////////////////////////////////////

            // const response = await sendRequest(request, chatModelNode.data);

            // if (!response) {
            //     dispatch(
            //         setNodeState({
            //             nodeId: chatModelNode.id,
            //             nodeState: ExecutionState.error,
            //         }),
            //     );
            //     return ExecutionState.error;
            // }
            // // ////////////////////////////////////  update output node    /////////////////////////////////////

            // updateTextOutputNode(
            //     chatModelNode.id,
            //     (response as AxiosResponse).data,
            // );

            // dispatch(
            //     setNodeState({
            //         nodeId: chatModelNode.id,
            //         nodeState: ExecutionState.success,
            //     }),
            // );

            // return ExecutionState.success;
        },
        [
            dispatch,
            reactFlow.getEdges(),
            reactFlow.getNodes(),
            prepareRequest,
            triggerStreaming,
        ],
    );

    useEffect(() => {});

    return {
        executeChatModelNode,
        // sendRequest
    };
};

export { useExecuteChatModelNode };
