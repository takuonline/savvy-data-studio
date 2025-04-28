import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import GraphUtils from '@/app/utils/graphUtils';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageInputNodeData } from '@/types/nodeGraphTypes';
import { Image as ImageIcon } from 'lucide-react';
import React, {
    InputHTMLAttributes,
    memo,
    use,
    useCallback,
    useEffect,
} from 'react';
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

export function ImageDialog(props: {
    children?: React.ReactNode;
    fileItem: string;
    index: number;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        alt="preview image"
                        src={props.fileItem}
                        className=" h-20 w-20 "
                    />
                }
            </DialogTrigger>
            <DialogContent className=" h-fit border-none bg-transparent">
                {
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        alt="preview image"
                        src={props.fileItem}
                        className=" h-fit"
                    />
                }
            </DialogContent>
        </Dialog>
    );
}

function ImageInputNode(props: NodeProps<ImageInputNodeData>) {
    const node = props;
    const { data } = node;
    const graphExecution = useAppSelector(
        (state: RootState) => state.nodeGraph.graphExecution,
    );
    const dispatch = useAppDispatch();
    // const nodeImages = useAppSelector( (state:RootState) => state.nodeGraph.nodes.find( n =>  node.id === n.id )   );
    const reactFlow = useReactFlow();

    // const [images, setImages] = React.useState<File[]>([]);

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
            ? Array.from(event.target.files)
            : ([] as File[]);

        const dataValue = {
            ...data,
            images: [
                ...data.images,
                ...files.map((v) => URL.createObjectURL(v)),
            ],
        } as ImageInputNodeData;

        GraphUtils.updateNodeData<ImageInputNodeData>(
            reactFlow,
            node.id,
            dataValue,
        );
    };

    return (
        <CustomNodeWrapper
            nodeTitle={data.label}
            className={{
                card: '   ',
                content: ' ',
            }}
            executionState={data.executionState}
            nodeId={node.id}
        >
            <div className="relative flex h-10 justify-end">
                <LabeledHandle
                    type="source"
                    label={'image_output'}
                    position={Position.Right}
                    id={`${node.type}}${handleIds.inputImageNode.sourceHandles.imageSource}${node.id}`}
                />
            </div>
            <div className=" flex-grow  ">
                <div className="flex flex-col items-center justify-center">
                    <Button
                        variant={'outline'}
                        className="filetype mb-5 mt-3 rounded-full  border border-none px-20 text-center  hover:bg-primary"
                    >
                        <ImageIcon />
                        <Label htmlFor={`files ${node.id} `} className="  ">
                            {'Pick an Image'}
                        </Label>

                        <Input
                            multiple
                            id={`files ${node.id} `}
                            type="file"
                            onChange={
                                onImageChange as React.ChangeEventHandler<HTMLInputElement>
                            }
                            className="filetype hidden w-[1px]"
                            accept="image/png, image/gif, image/jpeg"
                        />
                    </Button>

                    <div className="flex flex-wrap gap-5 overflow-y-auto">
                        {data.images &&
                            data.images.map(
                                (fileItem: string, index: number) => (
                                    <ImageDialog
                                        key={index}
                                        fileItem={fileItem}
                                        index={index}
                                    />
                                ),
                            )}
                    </div>
                </div>
            </div>
        </CustomNodeWrapper>
    );
}

export default memo(ImageInputNode);
