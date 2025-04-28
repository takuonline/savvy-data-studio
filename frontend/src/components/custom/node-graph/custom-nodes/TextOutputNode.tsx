import GraphUtils from '@/app/utils/graphUtils';
import { TextOutputNodeData } from '@/types/nodeGraphTypes';
import React, { memo } from 'react';
import {
    Node,
    NodeProps,
    NodeResizeControl,
    Position,
    useReactFlow,
} from 'reactflow';

import handleIds from '../../template-graphs/handle-ids';
import CustomNodeWrapper from './common-node-components/CustomNodeWrapper';
import LabeledHandle from './common-node-components/LabeledHandle';
import NodeTextInput from './common-node-components/NodeTextInput';

function TextOuputNode(props: NodeProps) {
    const node = props;
    const { data } = node;
    const reactFlow = useReactFlow();

    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = {
            ...data,

            output: {
                text: event.target.value,
            },
        } as TextOutputNodeData;

        GraphUtils.updateNodeData<TextOutputNodeData>(
            reactFlow,
            node.id,
            value,
        );
    };

    return (
        <CustomNodeWrapper
            nodeTitle={data.label}
            className={{
                card: ' ',
                content: ' ',
            }}
            executionState={data.executionState}
            nodeId={node.id}
        >
            <div className="relative h-10 ">
                <LabeledHandle
                    type="target"
                    label={'output'}
                    position={Position.Left}
                    className="absolute top-0"
                    id={`${node.type}${handleIds.outputTextNode.targetHandles.textTarget}${node.id}`}
                />
            </div>

            <div className="absolute right-0 space-y-7">
                <LabeledHandle
                    type="source"
                    label={'input'}
                    position={Position.Right}
                    className="absolute top-0"
                    id={`${node.type}${handleIds.outputTextNode.sourceHandles.textSource}${node.id}`}
                />
            </div>
            <div className=" flex-grow ">
                <NodeTextInput
                    placeholder={''}
                    textValue={data.output?.text ?? ''}
                    onChange={onChange}
                    className="bg-white/5"
                />
            </div>
        </CustomNodeWrapper>
    );
}

export default memo(TextOuputNode);
