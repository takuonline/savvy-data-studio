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
import { useNodeDescription } from '@/custom-hooks/useNodeDescription';
import { TextInputNodeData } from '@/types/nodeGraphTypes';
import { useReactFlow } from 'reactflow';

import { NodeSheetDescription } from '../NodeSheetDescription';
import NodeTextInput from '../custom-nodes/common-node-components/NodeTextInput';
import { NodeEditingSheetWrapper } from './NodeEditingSheetWrapper';

export default function NodeEditingSheetTextInputNode({
    nodeId,
}: {
    nodeId: string;
}) {
    const reactFlow = useReactFlow();
    const node = reactFlow.getNode(nodeId);

    if (!node || node.type !== 'textInput') {
        return;
    }

    const onChangePrompt = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        GraphUtils.updateNodeData<TextInputNodeData>(
            reactFlow,
            nodeId,
            { prompt: { textPrompt: event.target.value } }, // New data to merge
        );
    };

    return (
        <NodeEditingSheetWrapper>
            <SheetContent className="border-none">
                <SheetHeader className="mb-7 mt-5">
                    <NodeSheetDescription nodeId={nodeId} />
                </SheetHeader>
                ;<p className="mb-2 text-xs font-bold">{'Prompt text'}</p>
                <div className="bg-foreground text-xs">
                    <NodeTextInput
                        onChange={onChangePrompt}
                        textValue={node.data.prompt?.textPrompt}
                        placeholder=""
                        className="bg-foreground"
                    />
                </div>
            </SheetContent>
        </NodeEditingSheetWrapper>
    );
}
