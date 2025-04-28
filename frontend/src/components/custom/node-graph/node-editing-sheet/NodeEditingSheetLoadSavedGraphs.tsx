import GraphUtils from '@/app/utils/graphUtils';
import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import NodeGraphServices from '@/services/NodeGraphServices';
import { GraphMetadata, TextInputNodeData } from '@/types/nodeGraphTypes';
import { Trash2Icon, XIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edge, Node, useEdgesState, useNodesState } from 'reactflow';
import { useReactFlow } from 'reactflow';

import { NodeEditingSheetWrapper } from './NodeEditingSheetWrapper';

type NodeGraph = {
    nodes: Node[];
    edges: Edge[];
    label: string;
    description?: string;
};

const SavedGraphItem = (props: {
    graphItem: GraphMetadata;
    handleOnLoad: (a: GraphMetadata) => void;
    handleOnDelete: (a: string) => void;
}) => {
    const createdAt = new Date(props.graphItem.created_at).toUTCString();

    return (
        <div className="relative w-11/12">
            <div
                className="mx-1 my-4 overflow-y-auto rounded-xl border  border-border bg-background px-4 py-4 hover:cursor-pointer hover:border-white hover:bg-primary"
                onClick={() => props.handleOnLoad(props.graphItem)}
            >
                <div className="">
                    <p className="text-md font-extrabold ">{`Title: ${props.graphItem.label}`}</p>

                    <p className=" text-[0.6rem] font-extralight">{`Created on:${createdAt}`}</p>
                </div>

                {/* <hr className="border-b-2 border-dashed border-border mt-2 mb-4" /> */}

                {props.graphItem.description && (
                    <div className="mt-4 block flex-wrap gap-x-3 gap-y-2 ">
                        <p className="text-md font-extrabold ">{`Description:`}</p>
                        {props.graphItem.description}
                    </div>
                )}
            </div>
            <div className="absolute right-4 top-2 ">
                <XIcon
                    onClick={() => props.handleOnDelete(props.graphItem.id)}
                    className=" w-5  rounded  text-white/70  hover:text-red-600 "
                />
            </div>
        </div>
    );
};

export default function NodeEditingSheetLoadSavedGraphs(props: {}) {
    const reactFlow = useReactFlow();

    const [nodeGraphs, setNodeGraphs] = useState<GraphMetadata[]>([]);

    const fetchSavedItems = useCallback(async () => {
        const response = await NodeGraphServices.loadSavedNodeGraphs();

        if (response.results) {
            setNodeGraphs(response.results);
        }
    }, []);

    const handleOnLoad = (graphItem: GraphMetadata) => {
        if (graphItem) {
            console.log('graphItem');

            console.log(graphItem);

            const selectedNodeGraphToLoad = JSON.parse(
                graphItem.node_graph,
            ) as NodeGraph;
            console.log('selectedNodeGraphToLoad');
            console.log(selectedNodeGraphToLoad);

            GraphUtils.deleteAllAndAddNew(
                reactFlow,
                selectedNodeGraphToLoad.nodes,
                selectedNodeGraphToLoad.edges,
            );
        }
    };

    const handleOnDelete = async (id: string) => {
        const response = await NodeGraphServices.deleteNodeGraph({
            nodeGraphID: id,
        });

        if (response) {
            await fetchSavedItems();
        }
    };

    return (
        <NodeEditingSheetWrapper>
            <SheetContent className="overflow-y-auto  border-none">
                <SheetHeader className="mb-7 mt-5">
                    <SheetTitle className=" mb-2  text-xl text-primary ">
                        {'Saved Graphs'}
                    </SheetTitle>
                </SheetHeader>

                {nodeGraphs.length > 0 ? (
                    <div className=" bg-foreground px-4 py-3 text-xs ">
                        {nodeGraphs.map((v, index) => (
                            <SavedGraphItem
                                key={v.file_path}
                                graphItem={v}
                                handleOnLoad={handleOnLoad}
                                handleOnDelete={handleOnDelete}
                            />
                        ))}

                        {!nodeGraphs && (
                            <p className="text-5xl"> Loading... </p>
                        )}
                    </div>
                ) : (
                    <p className="text-sm  text-muted-foreground  ">
                        No saved graphs found
                    </p>
                )}
            </SheetContent>
        </NodeEditingSheetWrapper>
    );
}
