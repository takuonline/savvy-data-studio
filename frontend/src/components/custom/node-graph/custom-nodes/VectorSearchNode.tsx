import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import GraphUtils from '@/app/utils/graphUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useDocumentInput from '@/custom-hooks/useDocumentInput';
import useTextOutputNode from '@/custom-hooks/useTextOutput';
import { setExecution } from '@/features/nodeGraphState/nodeGraphSlice';
import DocumentProcessingService from '@/services/DocumentProcessingService';
import { VectorSearchNodeData } from '@/types/nodeGraphTypes';
import { AxiosError, AxiosResponse } from 'axios';
import { SendHorizontalIcon } from 'lucide-react';
import React from 'react';
import { NodeProps, Position, useReactFlow } from 'reactflow';
import { toast } from 'sonner';

import handleIds from '../../template-graphs/handle-ids';
import CustomNodeWrapper from './common-node-components/CustomNodeWrapper';
import LabeledHandle from './common-node-components/LabeledHandle';
import NodeTextInput from './common-node-components/NodeTextInput';

function VectorSearchNode(props: NodeProps<VectorSearchNodeData>) {
    const node = props;
    const { data } = node;

    const { onDocumentChangeFile, onDelete, handleDocumentsUpload } =
        useDocumentInput({
            nodeId: node.id,
        });

    const { updateTextOutputNode } = useTextOutputNode();

    const [searchText, setSearchText] = React.useState<string>('');

    const dispatch = useAppDispatch();
    const reactFlow = useReactFlow();
    const { getEdges, getNodes } = reactFlow;

    const llmApiKeyId = useAppSelector(
        (state: RootState) => state.nodeGraph.settings.openaiKeyId,
    );

    const handleInitSearch = async () => {
        dispatch(setExecution({ isExecuting: true, nodeId: node.id }));

        console.log('=======  init search  =======');

        if (!llmApiKeyId) {
            toast.error('Please enter an API Key in the settings');
            return;
        }

        const response =
            (await DocumentProcessingService.uploadAndSearchDocuments(
                data.documents,
                node.id,
                llmApiKeyId,
            )) as AxiosError | AxiosResponse;

        if (response.status?.toString().startsWith('2')) {
            const dataValue: VectorSearchNodeData = {
                ...data,
                isSearchable: true,
            };

            GraphUtils.updateNodeData<VectorSearchNodeData>(
                reactFlow,
                node.id,
                dataValue,
            );
        }

        dispatch(setExecution({ isExecuting: false }));
    };

    const handleOnSearchQueryInput: (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => void = (event) => {
        setSearchText(event.target.value);
    };

    const onSearch = async () => {
        dispatch(setExecution({ isExecuting: true, nodeId: node.id }));

        if (!llmApiKeyId) {
            toast.error('Please enter an API Key in the settings');
            return;
        }
        const response = (await DocumentProcessingService.searchVectorDb(
            searchText,
            node.id,
            llmApiKeyId,
            4, //TODO: make this dynamic
        )) as AxiosError | AxiosResponse;

        if (response.status?.toString().startsWith('2')) {
            console.log((response as AxiosResponse).data.results);

            updateTextOutputNode(
                node.id,
                (response as AxiosResponse).data.results.map(
                    (v: String, idx: number) => `Result ${idx}:\n${v}\n\n\n`,
                ),
            );
        }

        dispatch(setExecution({ isExecuting: false }));
    };

    return (
        <CustomNodeWrapper
            nodeTitle={data.label}
            className={{
                card: `  `,
                content: ' ',
            }}
            executionState={data.executionState}
            nodeId={node.id}
        >
            {/* <div className="relative h-10 flex justify-start">
            <LabeledHandle
          type="target"
          label={"search_text"}
          position={Position.Left}
          id={`${node.type}${handleIds.vectorSearchNode.sourceHandles.searchTextInput}${node.id}`}
          className=" h-10 flex justify-start"
        />
      </div> */}
            <div className="relative flex h-10 justify-end">
                <LabeledHandle
                    type="source"
                    label={'search_output'}
                    position={Position.Right}
                    id={`${node.type}${handleIds.vectorSearchNode.targetHandles.searchTextOutput}${node.id}`}
                    className=" flex h-10 justify-end"
                />
            </div>

            <div className=" flex-grow  ">
                <div className="flex flex-col items-center justify-center ">
                    {data.isSearchable && (
                        <div className="relative mb-5 h-20 w-full">
                            <NodeTextInput
                                placeholder={'Type in you search text here...'}
                                textValue={searchText}
                                onChange={handleOnSearchQueryInput}
                                className="mb-5"
                            />

                            <SendHorizontalIcon
                                className="absolute bottom-2 right-2 cursor-pointer "
                                onClick={onSearch}
                            />
                        </div>
                    )}

                    {data.documents.length > 0 && !data.isSearchable && (
                        <Button
                            onClick={handleInitSearch}
                            variant={'outline'}
                            className="filetype mt-2  rounded-full border bg-white/10  px-20   text-center hover:bg-primary"
                        >
                            {'Start search'}
                        </Button>
                    )}

                    {!data.isSearchable && (
                        <>
                            <Button
                                variant={'outline'}
                                className="filetype mt-2 w-full  rounded-full border  text-center  hover:bg-primary"
                            >
                                <Label
                                    htmlFor={`files ${node.id} `}
                                    className=" w-full "
                                >
                                    {'Upload Documents'}
                                </Label>

                                <Input
                                    multiple
                                    id={`files ${node.id} `}
                                    type="file"
                                    onChange={
                                        onDocumentChangeFile as React.ChangeEventHandler<HTMLInputElement>
                                    }
                                    className="filetype hidden w-[1px]"
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/plain, text/html, .pdf"
                                />
                            </Button>
                            <div className="mb-5 flex w-full justify-center text-[10px]">
                                <p className="mr-2 font-bold ">
                                    {'Supported types: '}
                                </p>
                                <p>{'pdf, csv, txt, html, markdown  '}</p>
                            </div>
                        </>
                    )}

                    {data.isSearchable && (
                        <p className="mb-2 mt-2 text-xs font-bold">
                            {' '}
                            {'Searching insde the following documents:'}
                        </p>
                    )}

                    {handleDocumentsUpload(data.isSearchable)}
                </div>
            </div>
        </CustomNodeWrapper>
    );
}

export default React.memo(VectorSearchNode);
