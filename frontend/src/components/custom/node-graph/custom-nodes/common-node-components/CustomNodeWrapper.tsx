import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { ExecutionState } from '@/components/enums/Enums';
import Config from '@/lib/constants';
import React from 'react';
import {   NodeResizeControl,  } from 'reactflow';

const controlStyle = {
    background: 'transparent',
    border: 'none',
};

export default function CustomNodeWrapper({
    children,
    nodeTitle,
    className,
    executionState,
    nodeId,
}: {
    children: React.ReactNode;
    nodeTitle: string;
    executionState: ExecutionState;
    className?: {
        title?: string;
        content?: string;
        card?: string;
    };

    nodeId: string;
}) {
    const graphExecution = useAppSelector(
        (state: RootState) => state.nodeGraph.graphExecution,
    );
    const [executionStyles, setExecutionStyles] =
        React.useState<keyof typeof Config.EXECUTION_STYLES>('executing');

    React.useEffect(() => {
        if (graphExecution.isExecuting && graphExecution.nodeId === nodeId) {
            setExecutionStyles('executing');
        } else if (
            graphExecution.isExecuting &&
            graphExecution.nodeId !== nodeId
        ) {
            setExecutionStyles('waiting');
        } else {
            switch (executionState) {
                case ExecutionState.ready:
                    setExecutionStyles('idle');
                    break;
                // case ExecutionState.executing:
                //   setExecutionStyles("executing");

                //   break;
                case ExecutionState.success:
                    setExecutionStyles('idle');

                    break;
                case ExecutionState.error:
                    setExecutionStyles('error');
                    break;
                case ExecutionState.paused:
                    break;
                default:
                    break;
            }
        }
    }, [graphExecution, nodeId, executionState]);

    React.useEffect(() => {
        switch (executionState) {
            case ExecutionState.ready:
                setExecutionStyles('idle');

                break;
            case ExecutionState.executing:
                setExecutionStyles('executing');

                break;
            case ExecutionState.success:
                setExecutionStyles('idle');

                break;
            case ExecutionState.error:
                setExecutionStyles('error');
                break;
            case ExecutionState.paused:
                break;
            default:
                break;
        }
    }, [executionState]);

    return (
        <>
            <div
                className={`absolute bottom-0 top-0 flex min-h-full  min-w-full flex-col space-y-2 rounded-xl bg-background p-2  py-3 pb-2 ${Config.EXECUTION_STYLES[executionStyles]}  ${className?.card}  `}
            >
                <div
                    className={`textinput-node__header px-2 text-sm text-primary ${className?.title}`}
                >
                    <strong>{nodeTitle}</strong>
                </div>
                <div
                    className={`textinput-node__body relative mt-2 flex w-full flex-grow flex-col bg-foreground p-2 text-xs ${className?.content}`}
                >
                    {children}
                </div>
            </div>
            <NodeResizeControl style={controlStyle}>
                <ResizeIcon />
            </NodeResizeControl>
        </>
    );
}

function ResizeIcon() {
    return (
        <div className="absolute bottom-2 right-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="rgb(var(--primary))"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                // style={{ position: "absolute", right: 5, bottom: 13 }}
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <polyline points="16 20 20 20 20 16" />
                <line x1="14" y1="14" x2="20" y2="20" />
                <polyline points="8 4 4 4 4 8" />
                <line x1="4" y1="4" x2="10" y2="10" />
            </svg>
        </div>
    );
}
