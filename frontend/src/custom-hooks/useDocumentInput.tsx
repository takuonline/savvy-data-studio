import { useAppDispatch, useAppSelector } from '@/app/hooks';
import GraphUtils from '@/app/utils/graphUtils';
import DocumentSourceItem from '@/components/custom/node-graph/custom-nodes/common-node-components/DocumentSourceItem';
import DocumentProcessingService from '@/services/DocumentProcessingService';
import {
    DocumentInputNodeData,
    DocumentItemRequest,
    DocumentItemType,
    TextOutputNodeData,
} from '@/types/nodeGraphTypes';
import React, {
    InputHTMLAttributes,
    memo,
    use,
    useCallback,
    useEffect,
    useState,
} from 'react';
import {
    Edge,
    Node,
    NodeProps,
    NodeResizeControl,
    Position,
    useReactFlow,
} from 'reactflow';

export default function useDocumentInput({ nodeId }: { nodeId: string }) {
    const dispatch = useAppDispatch();

    const { getNode } = useReactFlow();
    const reactFlow = useReactFlow();

    const data = getNode(nodeId)!.data as DocumentInputNodeData;

    const onDelete = useCallback(
        (fileName: string) => {
            const dataValue: DocumentInputNodeData = {
                ...data,
                documents: data.documents.filter((v) => v.name !== fileName),
            };

            GraphUtils.updateNodeData<DocumentInputNodeData>(
                reactFlow,
                nodeId,
                dataValue,
            );
        },

        [data, nodeId, reactFlow],
    );

    const onDocumentChangeContextLength = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const dataValue: DocumentInputNodeData = {
                ...data,
                contextLength: +event.target.value,
            };

            GraphUtils.updateNodeData<DocumentInputNodeData>(
                reactFlow,
                nodeId,
                dataValue,
            );
        },
        [data, nodeId, reactFlow],
    );

    const onDocumentChangeFile = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files
                ? Array.from(event.target.files)
                : ([] as File[]);
            console.log(files);

            let fileList: DocumentItemRequest[] = []; // List to hold file data

            const processFile = (file: File, callback: () => void): void => {
                const reader = new FileReader();
                reader.onload = (e: ProgressEvent<FileReader>) => {
                    fileList.push({
                        name: file.name,
                        type: file.type,
                        blob: reader.result,
                        // blob: e.target?.result,
                        size: file.size.toString(),
                    });

                    callback(); // Proceed to next file or dispatch
                };
                // var enc = new TextEncoder();
                // var enc = new TextDecoder("utf-8");

                //   reader.readAsArrayBuffer(file);
                //   reader.readAsText(file);
                reader.readAsArrayBuffer(file);
            };

            const saveFileContentsToCloud = async (
                documents: DocumentItemRequest[],
            ) => {
                const results =
                    await DocumentProcessingService.uploadProcessStoreDocuments(
                        documents,

                        nodeId,
                    );
                console.log('=====   results   ==== ');

                if (results.results) {
                    const processedDocs: DocumentItemType[] = [];

                    for (const doc of documents) {
                        const item = results.results.find(
                            (v) => v.file_name == doc.name,
                        );

                        if (item) {
                            processedDocs.push({
                                ...doc,
                                blob: null,
                                url: item.url ?? '',
                            });
                        }
                    }

                    const dataValue: DocumentInputNodeData = {
                        ...data,
                        documents: [...data.documents, ...processedDocs],
                    };

                    GraphUtils.updateNodeData<DocumentInputNodeData>(
                        reactFlow,
                        nodeId,
                        dataValue,
                    );
                }
            };

            const processFilesRecursively = (index: number = 0): void => {
                if (files && index < files.length) {
                    processFile(files[index], () =>
                        processFilesRecursively(index + 1),
                    );
                } else {
                    saveFileContentsToCloud(fileList);
                }
            };

            if (files) {
                processFilesRecursively(); // Start processing files
            }
        },
        [data, nodeId, reactFlow],
    );

    const handleDocumentsUpload = (isSearchable: boolean) => {
        return (
            <div className={`mb-5 flex flex-wrap justify-center gap-2`}>
                {data.documents &&
                    data.documents.map(
                        (item: DocumentItemType, index: number) =>
                            isSearchable ? (
                                <div key={index}>{item.name}</div>
                            ) : (
                                <DocumentSourceItem
                                    key={index}
                                    onDelete={onDelete}
                                    fileItem={item}
                                    index={index}
                                />
                            ),
                    )}
            </div>
        );
    };

    return {
        onDocumentChangeFile,
        onDocumentChangeContextLength,
        onDelete,
        handleDocumentsUpload,
    };
}
