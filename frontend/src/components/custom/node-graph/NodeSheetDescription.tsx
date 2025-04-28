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

import NodeTextInput from './custom-nodes/common-node-components/NodeTextInput';

export function NodeSheetDescription(props: { nodeId: string }) {
    const { description, onChangeDescription, nodeLabel } = useNodeDescription(
        props.nodeId,
    );
    return (
        <>
            <SheetTitle className=" mb-2  text-xl text-primary">
                {nodeLabel}
            </SheetTitle>

            <p className="text-xs font-bold">{'Node Description'}</p>

            <SheetDescription className="">
                <NodeTextInput
                    onChange={onChangeDescription}
                    textValue={description}
                    placeholder=""
                    className="bg-foreground"
                />
            </SheetDescription>
        </>
    );
}
