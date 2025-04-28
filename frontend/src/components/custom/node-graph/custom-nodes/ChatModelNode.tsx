import { useAppSelector } from '@/app/hooks';
import { chatModelOptions } from '@/features/nodeGraphState/nodeGraphSlice';
import React, { memo } from 'react';
import { NodeProps, useReactFlow } from 'reactflow';
import { Position } from 'reactflow';

import handleIds from '../../template-graphs/handle-ids';
import { NodeSelect } from './common-node-components/CommonNodeComponents';
import CustomNodeWrapper from './common-node-components/CustomNodeWrapper';
import LabeledHandle from './common-node-components/LabeledHandle';

function ChatModelNode(props: NodeProps) {
    const node = props;
    const { data } = node;

    const chatModelOptionsArray = useAppSelector(chatModelOptions);

    return (
        <CustomNodeWrapper
            nodeTitle={data.label}
            nodeId={node.id}
            executionState={data.executionState}
        >
            <div className="relative  flex-grow ">
                <div className=" space-y-5 ">
                    <LabeledHandle
                        type="target"
                        label={'system_prompt'}
                        position={Position.Left}
                        id={`${node.type}${handleIds.chatModelNode.targetHandles.systemPrompt}${node.id}`}
                        className=" "
                    />
                    <LabeledHandle
                        type="target"
                        label={'prompt'}
                        position={Position.Left}
                        id={`${node.type}${handleIds.chatModelNode.targetHandles.prompt}${node.id}`}
                        className=""
                    />

                    <LabeledHandle
                        type="target"
                        label={'document'}
                        position={Position.Left}
                        id={`${node.type}${handleIds.chatModelNode.targetHandles.documentPrompt}${node.id}`}
                        className=""
                    />

                    {/* {showImage && (
            <LabeledHandle
              type="target"
              label={"image"}
              position={Position.Left}
              id={`${node.type}${handleIds.chatModelNode.targetHandles.imagePrompt}${node.id}`}
              className=" "
            />
          )} */}
                </div>

                <div className=" absolute right-0 top-0 space-y-7">
                    <LabeledHandle
                        type="source"
                        label={'model_output'}
                        position={Position.Right}
                        id={`${node.type}${handleIds.chatModelNode.sourceHandles.textSource}${node.id}`}
                    />
                </div>
            </div>

            <div className="mb-2  h-10 px-1">
                <NodeSelect
                    nodeId={node.id}
                    value={data.modelName}
                    options={chatModelOptionsArray}
                    selectionTitle="Select model"
                />
            </div>
        </CustomNodeWrapper>
    );
}

export default memo(ChatModelNode);
