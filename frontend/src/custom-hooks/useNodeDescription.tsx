import GraphUtils from '@/app/utils/graphUtils';
import { TextInputNodeData } from '@/types/nodeGraphTypes';
import { useState } from 'react';
import { useReactFlow } from 'reactflow';

export const useNodeDescription = (nodeId: string) => {
    const reactFlow = useReactFlow();
    const node = reactFlow.getNode(nodeId);
    const [description, setDescription] = useState<string>(
        node?.data.description ?? '',
    );

    const onChangeDescription = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        if (!node) {
            return;
        }
        const updatedDescription = event.target.value;
        setDescription(updatedDescription);

        const updatedNodeData: TextInputNodeData = {
            ...node.data,
            description: updatedDescription,
        };

        GraphUtils.updateNodeData<TextInputNodeData>(
            reactFlow,
            nodeId,
            updatedNodeData,
        );
    };

    return {
        description,
        onChangeDescription,
        nodeLabel: node?.data.label,
    };
};
