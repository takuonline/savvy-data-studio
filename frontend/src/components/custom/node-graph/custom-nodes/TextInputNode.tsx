import { RootState } from '@/app/store';
import GraphUtils from '@/app/utils/graphUtils';
import { TextInputNodeData } from '@/types/nodeGraphTypes';
import React, { memo } from 'react';
import { Node, NodeProps, Position, useReactFlow } from 'reactflow';

import handleIds from '../../template-graphs/handle-ids';
import CustomNodeWrapper from './common-node-components/CustomNodeWrapper';
import LabeledHandle from './common-node-components/LabeledHandle';
import NodeTextInput from './common-node-components/NodeTextInput';

function TextInputNode(props: NodeProps<TextInputNodeData>) {
    const nodeProps = props;
    const { data } = nodeProps;

    const reactFlow = useReactFlow();

    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        GraphUtils.updateNodeData<TextInputNodeData>(reactFlow, nodeProps.id, {
            prompt: { textPrompt: event.target.value },
        });
    };

    return (
        <CustomNodeWrapper
            nodeTitle={data.label}
            executionState={data.executionState}
            className={{
                card: '   ',
                content: ' ',
            }}
            nodeId={nodeProps.id}
        >
            <div className="relative  mb-4 flex flex-col items-end space-y-4">
                <LabeledHandle
                    type="source"
                    label={'input'}
                    position={Position.Right}
                    id={`${nodeProps.type}${handleIds.inputTextNode.sourceHandles.textSource}${nodeProps.id}`}
                />
            </div>
            <div className=" flex-grow ">
                <NodeTextInput
                    textValue={data.prompt?.textPrompt}
                    onChange={onChange}
                />
            </div>
        </CustomNodeWrapper>
    );
}

export default memo(TextInputNode);
