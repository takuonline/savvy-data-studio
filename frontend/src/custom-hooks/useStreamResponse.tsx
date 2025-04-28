import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { ExecutionState } from '@/components/enums/Enums';
import { setNodeState } from '@/features/nodeGraphState/nodeGraphSlice';
import Config from '@/lib/constants';
import { ModelQueryData } from '@/types/nodeGraphTypes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import useTextOutputNode from './useTextOutput';

export default function useStreamResponse() {
    const connection = useRef<{ [key: string]: WebSocket } | null>(null);
    const processingList = useRef<string[]>([]);

    const { updateTextOutputNode } = useTextOutputNode();
    const messageChunksRef = useRef<{
        [key: string]: string;
    }>({});

    const dispatch = useAppDispatch();
    const openaiKeyId = useAppSelector(
        (state: RootState) => state.nodeGraph.settings.openaiKeyId,
    );

    const waitForProcessing = (): Promise<void> => {
        return new Promise((resolve) => {
            const checkRef = () => {
                if (processingList.current.length === 0) {
                    resolve();
                } else {
                    setTimeout(checkRef, 200);
                }
            };
            checkRef();
        });
    };

    const triggerStreaming = useCallback(
        async (chatStateItem: {
            nodeId: string;
            conversationId: string;
            userPrompt: ModelQueryData | undefined;
        }): Promise<ExecutionState> => {
            processingList.current = [
                ...processingList.current,
                chatStateItem.nodeId,
            ];

            const socket = new WebSocket(
                Config.WS_URL +
                    `conversation/${chatStateItem.conversationId}?oaid=${openaiKeyId}/`,
            );

            socket.addEventListener('open', () => {
                console.log('WebSocket Connected');
                messageChunksRef.current[chatStateItem.nodeId] = '';

                dispatch(
                    setNodeState({
                        nodeId: chatStateItem.nodeId,
                        nodeState: ExecutionState.executing,
                    }),
                );

                socket.send(
                    JSON.stringify({
                        message: chatStateItem.userPrompt,
                    }),
                );
            });

            socket.addEventListener('message', (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.message) {
                        messageChunksRef.current[chatStateItem.nodeId] +=
                            data.message;
                        updateTextOutputNode(
                            chatStateItem.nodeId,
                            messageChunksRef.current[chatStateItem.nodeId],
                        );
                    } else if (data.done) {
                        dispatch(
                            setNodeState({
                                nodeId: chatStateItem.nodeId,
                                nodeState: ExecutionState.success,
                            }),
                        );
                        if (connection.current) {
                            connection.current[chatStateItem.nodeId]?.close();
                        }
                    }
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            });
            socket.addEventListener('error', (error) => {
                console.error('WebSocket Error:', error);
                toast.error('Error receiving message from server');
                return ExecutionState.error;
            });

            socket.addEventListener('close', (event) => {
                dispatch(
                    setNodeState({
                        nodeId: chatStateItem.nodeId,
                        nodeState: ExecutionState.success,
                    }),
                );

                if (connection.current) {
                    connection.current[chatStateItem.nodeId]?.close();
                }

                processingList.current = processingList.current.filter(
                    (v) => v !== chatStateItem.nodeId,
                );

                console.log(
                    '=== \\/ processingList.length after dropping \\/ ===',
                );
                console.log(processingList.current.length);
            });

            connection.current = {
                ...connection.current,
                [chatStateItem.nodeId]: socket,
            };

            await waitForProcessing();

            return ExecutionState.success;
        },
        [dispatch, openaiKeyId],
    );

    return { triggerStreaming };
}
