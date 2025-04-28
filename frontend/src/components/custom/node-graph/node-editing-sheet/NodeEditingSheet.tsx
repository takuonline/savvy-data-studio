import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { toast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';
import { Node, useReactFlow } from 'reactflow';

import NodeEditingSheetChatModelNode from './NodeEditingSheetChatModelNode';
import NodeEditingSheetDocumentInputNode from './NodeEditingSheetDocumentInputNode';
import NodeEditingSheetLoadSavedGraphs from './NodeEditingSheetLoadSavedGraphs';
import NodeEditingSheetTextInputNode from './NodeEditingSheetTextInputNode';
import NodeEditingSheetTextOutputNode from './NodeEditingSheetTextOutputNode';
import NodeExecutionTemplatesSheet from './NodeExecutionTemplatesSheet';

export default function NodeEditingSheetGeneral(props: {}) {
    const slidingSheetOptions = useAppSelector((state: RootState) => {
        const slidingSheet = state.nodeGraph.slidingSheet;

        return slidingSheet;
    });

    const [componentContent, setComponentContent] = useState<React.ReactNode>();
    const { getNode } = useReactFlow();

    useEffect(() => {
        const node = getNode(slidingSheetOptions.nodeId);

        let itemType;

        if (node && slidingSheetOptions.isEditingNode) {
            itemType = node.type;
        } else if (slidingSheetOptions.isShowingTemplates) {
            itemType = 'templates';
        } else if (slidingSheetOptions.isShowingSavedGraphs) {
            itemType = 'loadGraphs';
        } else {
            return;
        }

        switch (itemType) {
            case 'chatModel':
                setComponentContent(
                    <NodeEditingSheetChatModelNode nodeId={node!.id} />,
                );
                break;
            case 'textInput':
                setComponentContent(
                    <NodeEditingSheetTextInputNode nodeId={node!.id} />,
                );
                break;
            case 'textOutput':
                setComponentContent(
                    <NodeEditingSheetTextOutputNode nodeId={node!.id} />,
                );
                break;
            case 'documentInput':
                setComponentContent(
                    <NodeEditingSheetDocumentInputNode nodeId={node!.id} />,
                );
                break;
            case 'templates':
                setComponentContent(<NodeExecutionTemplatesSheet />);
                break;
            case 'loadGraphs':
                setComponentContent(<NodeEditingSheetLoadSavedGraphs />);
                break;
            default:
                return;
        }
    }, [
        getNode,
        slidingSheetOptions.isEditingNode,
        slidingSheetOptions.isShowingSavedGraphs,
        slidingSheetOptions.isShowingTemplates,
        slidingSheetOptions.nodeId,
    ]);

    return componentContent;
}
