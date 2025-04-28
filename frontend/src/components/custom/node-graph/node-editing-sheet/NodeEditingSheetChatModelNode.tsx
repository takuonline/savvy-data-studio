import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import GraphUtils from '@/app/utils/graphUtils';
import { Label } from '@/components/ui/label';
import {
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { chatModelConfigDefault } from '@/features/nodeGraphState/state-defaults';
import { cn } from '@/lib/utils';
import { ChatModelNodeData, TextInputNodeData } from '@/types/nodeGraphTypes';
import { useState } from 'react';
import { Node, useReactFlow } from 'reactflow';

import { NodeSheetDescription } from '../NodeSheetDescription';
import { NodeSelect } from '../custom-nodes/common-node-components/CommonNodeComponents';
import NodeTextInput from '../custom-nodes/common-node-components/NodeTextInput';
import { NodeEditingSheetWrapper } from './NodeEditingSheetWrapper';

type SliderProps = React.ComponentProps<typeof Slider> & {
    label: string;
    sliderKey: string;
    onSliderValueChange: (value: number[], sliderKey: string) => void;
};

export function LabeledSlider({
    className,
    label,
    defaultValue,
    onSliderValueChange,
    value,
    sliderKey,
    ...props
}: SliderProps) {
    return (
        <div className="">
            <div className="mb-4 flex items-center justify-between">
                <Label className="text-sm font-bold "> {label}</Label>
                <p className="rounded-full bg-foreground px-4 py-1 text-sm font-bold">
                    {value}
                </p>
            </div>

            <Slider
                className={cn(className)}
                {...props}
                // value={value}
                onValueChange={(value: number[]) => {
                    console.log(value);

                    //   setValue(value);
                    onSliderValueChange(value, sliderKey);
                }}
                value={value}
            />
        </div>
    );
}

export default function NodeEditingSheetChatModelNode({
    nodeId,
}: {
    nodeId: string;
}) {
    const dispatch = useAppDispatch();
    const reactFlow = useReactFlow();
    const node = reactFlow.getNode(nodeId);

    const chatModelOptionsArray = useAppSelector(
        (state: RootState) => state.nodeGraph.chatModelOptions,
    );

    if (!node || node.type !== 'chatModel') {
        return;
    }

    const onSliderValueChange = (value: number[], sliderKey: string) => {
        const valueParsed = value.constructor === Array ? value[0] : value;

        const nodeData: ChatModelNodeData = {
            ...node.data,
            configs: {
                ...node.data.configs,
                [sliderKey]: valueParsed,
            },
        };

        GraphUtils.updateNodeData<ChatModelNodeData>(
            reactFlow,
            nodeId,
            nodeData,
        );
    };
    return (
        <NodeEditingSheetWrapper>
            <SheetContent className="space-y-8 border-none">
                <SheetHeader className="mb-7 mt-5">
                    <NodeSheetDescription nodeId={nodeId} />
                </SheetHeader>

                <NodeSelect
                    nodeId={node.id}
                    value={node.data.modelName}
                    options={chatModelOptionsArray}
                    selectionTitle="Select model"
                />
                <LabeledSlider
                    label={'Temperature'}
                    defaultValue={[
                        chatModelConfigDefault.temperature as number,
                    ]}
                    min={0}
                    max={2}
                    step={0.01}
                    onSliderValueChange={onSliderValueChange}
                    sliderKey={'temperature'}
                    value={[
                        node.data.configs?.temperature ??
                            (chatModelConfigDefault.temperature as number),
                    ]}
                />
                <LabeledSlider
                    label={'Maximum length'}
                    defaultValue={[chatModelConfigDefault.maxTokens as number]}
                    min={1}
                    max={4096}
                    step={22}
                    sliderKey="maxTokens"
                    onSliderValueChange={onSliderValueChange}
                    value={[
                        node.data.configs?.maxTokens ??
                            (chatModelConfigDefault.maxTokens as number),
                    ]}
                />

                <LabeledSlider
                    label={'Top P'}
                    defaultValue={[1]}
                    min={0}
                    max={1}
                    step={0.02}
                    onSliderValueChange={onSliderValueChange}
                    sliderKey="top_p"
                    value={[
                        node.data.configs?.top_p ??
                            (chatModelConfigDefault.top_p as number),
                    ]}
                />

                <LabeledSlider
                    label={'Frequency penalty'}
                    defaultValue={[0]}
                    min={0}
                    max={2}
                    step={0.02}
                    onSliderValueChange={onSliderValueChange}
                    sliderKey="frequencyPenalty"
                    value={[
                        node.data.configs?.frequencyPenalty ??
                            (chatModelConfigDefault.frequencyPenalty as number),
                    ]}
                />

                <LabeledSlider
                    label={'Presence penalty'}
                    defaultValue={[0]}
                    min={0}
                    max={2}
                    step={0.02}
                    sliderKey="presencePenalty"
                    onSliderValueChange={onSliderValueChange}
                    value={[
                        node.data.configs?.presencePenalty ??
                            (chatModelConfigDefault.presencePenalty as number),
                    ]}
                />

                {/* <div>
          <NodeTextInput
            onChange={() => {}}
            textValue={""}
            placeholder=""
            className="bg-foreground"
          />
        </div> */}
            </SheetContent>
        </NodeEditingSheetWrapper>
    );
}
