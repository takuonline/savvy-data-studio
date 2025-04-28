import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import GraphUtils from '@/app/utils/graphUtils';
import { Button } from '@/components/ui/button';
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
import { toast } from '@/components/ui/use-toast';
import {
    DocumentInputNodeData,
    TextInputNodeData,
} from '@/types/nodeGraphTypes';
import React from 'react';
import { Node, NodeProps, useReactFlow } from 'reactflow';

import { NodeSheetDescription } from '../NodeSheetDescription';
import { DocumentNodeCoreLogic } from '../custom-nodes/DocumentInputNode';
import NodeTextInput from '../custom-nodes/common-node-components/NodeTextInput';
import { NodeEditingSheetWrapper } from './NodeEditingSheetWrapper';

export default function NodeEditingSheetDocumentInputNode({
    nodeId,
}: {
    nodeId: string;
}) {
    const reactFlow = useReactFlow();

    const node = reactFlow.getNode(nodeId);

    if (!node || node.type !== 'documentInput') {
        toast({
            title: 'Error',
            description: 'Unable to render node editing sheet',
        });

        return null;
    }

    return (
        <NodeEditingSheetWrapper>
            <SheetContent className="border-none">
                <SheetHeader className="mb-7 mt-5">
                    <NodeSheetDescription nodeId={nodeId} />
                </SheetHeader>

                <DocumentNodeCoreLogic nodeId={node.id} />
            </SheetContent>
        </NodeEditingSheetWrapper>
    );
}
