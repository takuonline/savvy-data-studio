import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useDocumentInput from '@/custom-hooks/useDocumentInput';
import { chatModelConfigDefault } from '@/features/nodeGraphState/state-defaults';
import DocumentProcessingService from '@/services/DocumentProcessingService';
import {
    DocumentInputNodeData,
    DocumentItemType,
} from '@/types/nodeGraphTypes';
import { useDroppable } from '@dnd-kit/core';
import { AxiosError, AxiosResponse } from 'axios';
import { FileIcon, PencilIcon, TrashIcon } from 'lucide-react';
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

export function DocumentNodeCoreLogic({
    nodeId,
    ...props
}: {
    nodeId: string;
}) {
    const { getNode } = useReactFlow();
    const node = getNode(nodeId);

    const data = node!.data as DocumentInputNodeData;

    const {
        onDocumentChangeFile,
        onDocumentChangeContextLength,
        handleDocumentsUpload,
    } = useDocumentInput({
        nodeId,
    });

    return (
        <div className=" flex-grow ">
            <div className="flex flex-col items-center justify-center ">
                <div className="mb-4 flex w-full items-center justify-between">
                    <Label htmlFor={`context ${nodeId} `} className="  ">
                        {'Context length cutoff'}
                    </Label>
                    <Input
                        id={`context ${nodeId} `}
                        type="number"
                        value={
                            data.contextLength ??
                            chatModelConfigDefault.maxTokens
                        }
                        onChange={onDocumentChangeContextLength}
                        // max={10_000_000}
                        min={256}
                        className="  w-32 rounded-full border bg-background text-center "
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/plain, text/html, .pdf"
                    />
                </div>

                <Button
                    variant={'outline'}
                    className="filetype mt-2  w-full  rounded-full border  text-center hover:bg-primary"
                >
                    <Label htmlFor={`files ${nodeId} `} className=" w-full">
                        {'Upload Documents'}
                    </Label>

                    <Input
                        multiple
                        id={`files ${nodeId} `}
                        type="file"
                        onChange={
                            onDocumentChangeFile as React.ChangeEventHandler<HTMLInputElement>
                        }
                        className="filetype hidden w-[1px] "
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/plain, text/html, .pdf, application/json"
                    />
                </Button>
                <div className="mb-4 mt-4 flex w-full justify-center text-[10px]">
                    <p className="mr-2 font-bold ">{'Supported types: '}</p>
                    <p className="mb-1">
                        {' '}
                        {'pdf, csv, txt, json, html, markdown  '}
                    </p>
                </div>
                <div className="mb-4 w-full border-b border-dashed border-white/10"></div>

                {handleDocumentsUpload(false)}
            </div>
        </div>
    );
}

function DocumentInputNode(props: NodeProps<DocumentInputNodeData>) {
    const node = props;
    const { data } = node;

    return (
        <CustomNodeWrapper
            nodeTitle={data.label}
            className={{
                card: ` `,
                content: '  ',
            }}
            executionState={data.executionState}
            nodeId={node.id}
        >
            <div className="relative flex h-10 justify-end">
                <LabeledHandle
                    type="source"
                    label={'document_output'}
                    position={Position.Right}
                    id={`${node.type}${handleIds.inputDocumentNode.sourceHandles.processedDocumentSource}${node.id}`}
                />
            </div>

            <div className="mb-4 w-full border-b  border-dashed border-white/10"></div>

            <DocumentNodeCoreLogic nodeId={node.id} />
        </CustomNodeWrapper>
    );
}

export default memo(DocumentInputNode);
