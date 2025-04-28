import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import GraphUtils from '@/app/utils/graphUtils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
import { TextInputNodeData, TextOutputNodeData } from '@/types/nodeGraphTypes';
import { Node, useReactFlow } from 'reactflow';

import { NodeSheetDescription } from '../NodeSheetDescription';
import NodeTextInput from '../custom-nodes/common-node-components/NodeTextInput';
import { NodeEditingSheetWrapper } from './NodeEditingSheetWrapper';

export default function NodeEditingSheetTextOutputNode({
    nodeId,
}: {
    nodeId: string;
}) {
    const reactFlow = useReactFlow();
    const node = reactFlow.getNode(nodeId);

    if (!node || node.type !== 'textOutput') {
        return;
    }

    // const onChangeDescription = (
    //   event: React.ChangeEvent<HTMLTextAreaElement>,
    // ) => {
    //   const dataVakue: TextOutputNodeData = {
    //     ...node.data,
    //     description: event.target.value,
    //   };

    //   GraphUtils.updateReactFlowNode<TextInputNodeData>(reactFlow, nodeId, dataVakue);
    // };

    const onChangePrompt = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const dataVakue: TextOutputNodeData = {
            ...node.data,
            prompt: {
                textPrompt: event.target.value,
            },
        };

        GraphUtils.updateNodeData<TextInputNodeData>(
            reactFlow,
            nodeId,
            dataVakue,
        );
    };
    return (
        <NodeEditingSheetWrapper>
            <SheetContent className="border-none">
                <SheetHeader className="mb-7 mt-5">
                    <NodeSheetDescription nodeId={nodeId} />
                </SheetHeader>

                <p className="mb-2 text-sm font-bold">{'Prompt text'}</p>
                <div className="bg-foreground   text-xs">
                    <NodeTextInput
                        onChange={onChangePrompt}
                        textValue={node.data.output.text ?? ''}
                        placeholder=""
                        className="bg-foreground"
                    />
                </div>
            </SheetContent>
        </NodeEditingSheetWrapper>
    );
}
