'use client';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import GraphUtils from '@/app/utils/graphUtils';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
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
import { AVAILABLE_NODES } from '@/features/nodeGraphState/state-defaults';
import React from 'react';
import { XYPosition, useReactFlow } from 'reactflow';

type NodeContextMenuItemProps = {
    option: {
        value: string;
        id: Number;
        label: string;
    };
};
function NodeContextMenuItem(props: NodeContextMenuItemProps) {
    const dispatch = useAppDispatch();
    const reactFlow = useReactFlow();

    const contextMenuXYPosition = useAppSelector(
        (state: RootState) =>
            state.nodeGraph.contextMenuPosition.projectedPosition,
    );
    return (
        <DropdownMenuItem
            className=" text-white hover:bg-foreground  hover:text-primary focus:bg-foreground"
            onSelect={() => {
                const nodeKey = props.option
                    .value as keyof typeof AVAILABLE_NODES;

                GraphUtils.addNewNode(
                    reactFlow,
                    nodeKey,
                    contextMenuXYPosition,
                );
            }}
        >
            <div className="p-0  data-[highlighted]:bg-transparent data-[highlighted]:text-primary">
                <div className="w-full p-2 py-1 text-xs data-[selected=true]:bg-foreground data-[selected=true]:text-primary  ">
                    {props.option.label}
                </div>
            </div>
        </DropdownMenuItem>
    );
}

export default function GraphBgContextMenu({}: {}) {
    const [value, setValue] = React.useState('');
    const nodeOptions = useAppSelector(
        (state: RootState) => state.nodeGraph.nodeOptions,
    );

    const contextMenuPosition = useAppSelector(
        (state: RootState) => state.nodeGraph.contextMenuPosition.position,
    );

    const { inputNodesOptions, processingNodesOptions, outputNodesOptions } =
        React.useMemo(() => {
            const inputNodesOptions = [
                'inputTextNode',
                'inputImageNode',
                'inputDocumentNode',
            ];

            const processingNodesOptions = [
                'vectorSearchNode',
                'chatModelNode',
            ];

            const outputNodesOptions = ['outputTextNode'];

            return {
                inputNodesOptions: nodeOptions.filter((v) =>
                    inputNodesOptions.includes(v.value),
                ),

                processingNodesOptions: nodeOptions.filter((v) =>
                    processingNodesOptions.includes(v.value),
                ),
                outputNodesOptions: nodeOptions.filter((v) =>
                    outputNodesOptions.includes(v.value),
                ),
            };
        }, [nodeOptions]);

    return (
        <DropdownMenu open={true}>
            <DropdownMenuContent
                className={` absolute w-44 cursor-pointer rounded-xl border  bg-background `}
                style={{
                    top: `${contextMenuPosition.y}px`,
                    left: `${+contextMenuPosition.x - 30}px`,
                }}
                onContextMenu={(e) => e.preventDefault()}
            >
                <DropdownMenuGroup className="p-1">
                    <DropdownMenuLabel className="border-b border-white/40 bg-background ">
                        {'Create Node'}
                    </DropdownMenuLabel>

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            Input Nodes
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                {inputNodesOptions.map((option) => (
                                    <NodeContextMenuItem
                                        key={option.value}
                                        option={option}
                                    />
                                ))}
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="hover:bg-foreground focus:bg-foreground">
                            Processing
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                {processingNodesOptions.map((option) => (
                                    <NodeContextMenuItem
                                        key={option.value}
                                        option={option}
                                    />
                                ))}
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            Output Nodes
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                {outputNodesOptions.map((option) => (
                                    <NodeContextMenuItem
                                        key={option.value}
                                        option={option}
                                    />
                                ))}
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuSeparator />
                </DropdownMenuGroup>

                {/* <DropdownMenuGroup className="p-1">
          {nodeOptions.map((option) => (
            <NodeContextMenuItem key={option.value} option={option} />
          ))}
        </DropdownMenuGroup> */}
            </DropdownMenuContent>
        </DropdownMenu>
        // </div>
    );
}
