'use client';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import GraphUtils from '@/app/utils/graphUtils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useClickNodeExecution from '@/custom-hooks/useClickNodeExecution';
import {
    // duplicateNode,
    setExecution,
    setNodeGraphEditing,
} from '@/features/nodeGraphState/nodeGraphSlice';
import React from 'react';
import { Node } from 'reactflow';
import { useReactFlow } from 'reactflow';
import { toast } from 'sonner';

// type ContextCommandItem = typeof ContextMenuItem & typeof  CommandItem;

type NodeContextMenuOption = {
    onClick: (a: any) => void;

    label: string;
};
type NodeContextMenuItemProps = {
    option: NodeContextMenuOption;
};
function NodeContextMenuItem({ option }: NodeContextMenuItemProps) {
    const reactFlow = useReactFlow();

    const currentlySelectedNode = useAppSelector((state: RootState) => {
        return state.nodeGraph.currentlySelectedNode;
    });
    return (
        <DropdownMenuItem
            onClick={() => option.onClick(currentlySelectedNode)}
            className=" text-white hover:bg-foreground  hover:text-primary focus:bg-foreground "
        >
            <div className="p-0  data-[highlighted]:bg-transparent data-[highlighted]:text-primary">
                {option.label}
            </div>
        </DropdownMenuItem>
    );
}

export default function NodeContextMenu({}: {}) {
    const dispatch = useAppDispatch();
    const openaiKeyId = useAppSelector(
        (state: RootState) => state.nodeGraph.settings.openaiKeyId,
    );

    const { onClickNodeExecution } = useClickNodeExecution();
    const reactFlow = useReactFlow();
    const contextMenuPosition = useAppSelector(
        (state: RootState) => state.nodeGraph.contextMenuPosition.position,
    );

    const onDeleteNode = React.useCallback(
        (node: Node) => {
            GraphUtils.deleteNode(reactFlow, node.id);
        },
        [reactFlow],
    );

    const onDuplicateNode = React.useCallback(
        (node: Node) => {
            GraphUtils.duplicateNode(reactFlow, node);
        },
        [reactFlow],
    );

    const onExecute = React.useCallback(
        (node: Node) => {
            if (!openaiKeyId) {
                console.error('Please enter an OpenAI API Key in the settings');
                toast(
                    <p className="text-destructive">
                        {' '}
                        Please enter an OpenAI API Key in the settings
                    </p>,
                );
                return;
            }

            dispatch(setExecution({ nodeId: node.id, isExecuting: true }));
            onClickNodeExecution(node);
        },
        [dispatch, onClickNodeExecution],
    );

    const onEditConfigurations = React.useCallback(
        (node: Node) => {
            dispatch(
                setNodeGraphEditing({
                    isEditingNode: true,
                    nodeId: node.id,
                }),
            );
        },
        [dispatch],
    );

    const nodeContextMenuOptions = React.useMemo(
        () => [
            {
                label: 'Duplicate',
                onClick: onDuplicateNode,
            },

            {
                label: 'Delete',
                onClick: onDeleteNode,
            },
            {
                label: 'Edit configuration',
                onClick: onEditConfigurations,
            },
            {
                label: 'Execute Node',
                onClick: onExecute,
            },
        ],
        [onDeleteNode, onDuplicateNode, onEditConfigurations, onExecute],
    );

    return (
        <DropdownMenu open={true}>
            <DropdownMenuContent
                style={{
                    top: `${contextMenuPosition.y}px`,
                    left: `${+contextMenuPosition.x - 30}px`,
                }}
                className={` absolute w-44 cursor-pointer rounded-xl border bg-background`}
                onContextMenu={(e) => e.preventDefault()}
            >
                <p className="border-b p-2 text-sm font-bold">Node Options</p>

                <div className="rounded-b-xl bg-background  text-xs">
                    {nodeContextMenuOptions.map((option, index) => (
                        <NodeContextMenuItem key={index} option={option} />
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
