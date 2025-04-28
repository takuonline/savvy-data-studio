import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { ExecutionState } from '@/components/enums/Enums';
import { Button } from '@/components/ui/button';
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from '@/components/ui/menubar';
import { useExecuteChatModelNode } from '@/custom-hooks/useExecuteChatModelNode';
import useExecuteDocumentNode from '@/custom-hooks/useExecuteDocumentNode';
import {
    displayLoadStoredGraphsSheets,
    displayNodeTemplatesSheets,
    setExecution,
} from '@/features/nodeGraphState/nodeGraphSlice';
import {
    ChatModelNodeData,
    DocumentInputNodeData,
} from '@/types/nodeGraphTypes';
import { MoreVerticalIcon, SendHorizonalIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { Node, useReactFlow } from 'reactflow';

import { DeleteAllNodes } from '../dialogs/DeleteAllNodes';
import SaveNodeGraph from '../dialogs/SaveNodeGraph';

export default function GraphExecution() {
    const dispatch = useAppDispatch();
    const graphExecution = useAppSelector(
        (state: RootState) => state.nodeGraph.graphExecution,
    );
    const reactFlow = useReactFlow();

    const [openDialog, setOpenDialog] = useState<{
        openDialogDeleteAll: boolean;
        openDialogSaveGraph: boolean;
    }>({
        openDialogDeleteAll: false,
        openDialogSaveGraph: false,
    });

    const { executeChatModelNode } = useExecuteChatModelNode();
    const { executeDocumentInputNode } = useExecuteDocumentNode();
    const handleExecution = async () => {
        const { nodes, edges } = {
            nodes: reactFlow.getNodes(),
            edges: reactFlow.getEdges(),
        };

        const documentInputNodes = nodes.filter(
            (n: Node) => n.type === 'documentInput',
        );

        for (const documentInputNode of documentInputNodes as Array<
            Node<DocumentInputNodeData>
        >) {
            dispatch(
                setExecution({
                    isExecuting: true,
                    nodeId: documentInputNode.id,
                }),
            );

            await executeDocumentInputNode(documentInputNode);
        }

        //execute all Chat model nodes

        const chatModelNodes = nodes.filter(
            (n: Node) => n.type === 'chatModel',
        );

        for (const chatModelNode of chatModelNodes as Array<
            Node<ChatModelNodeData>
        >) {
            dispatch(
                setExecution({ isExecuting: true, nodeId: chatModelNode.id }),
            );

            const res = await executeChatModelNode(chatModelNode);

            if (res == ExecutionState.error) {
                dispatch(setExecution({ isExecuting: false }));
                return;
            }
        }

        dispatch(setExecution({ isExecuting: false }));
    };

    const notExecuting = (
        <Button
            variant={'ghost'}
            className="my-0 h-1 rounded bg-primary p-3 py-4 text-xs hover:bg-black/20"
            onClick={handleExecution}
        >
            {'Execute'} <SendHorizonalIcon className="ml-1 h-3 w-3" />
        </Button>
    );

    const executing = (
        <>
            <Button
                variant={'ghost'}
                className="my-0  h-1 rounded bg-accent p-3 py-4 text-xs hover:bg-accent"
                onClick={() => {
                    dispatch(setExecution({ isExecuting: false }));
                }}
            >
                {'Abort'} <XIcon className="ml-1 h-3 w-3" />
            </Button>
        </>
    );

    const content = graphExecution.isExecuting ? executing : notExecuting;

    return (
        <div
            className={`absolute right-12 top-2 z-50  flex cursor-pointer items-center justify-center rounded border-none bg-primary  text-xs ${
                graphExecution.isExecuting ? 'bg-accent' : 'bg-primary'
            }`}
        >
            <div>{content}</div>

            <Menubar className="-right-5 m-0 flex h-8 w-6 items-center justify-center rounded border-none bg-primary p-0 active:bg-transparent">
                <MenubarMenu>
                    <MenubarTrigger className=" m-0 rounded border-l-2 p-0  focus:bg-transparent  data-[hightlighted]:bg-transparent data-[state=open]:bg-transparent">
                        <MoreVerticalIcon className="h-8 py-[.4rem] hover:bg-black/20" />
                    </MenubarTrigger>

                    <MenubarContent className="rounded-xl bg-background px-2 py-4 ">
                        <MenubarItem
                            onClick={() => {
                                dispatch(displayNodeTemplatesSheets());
                            }}
                        >
                            Templates
                        </MenubarItem>
                        {/* <MenubarSeparator />
                        <MenubarItem
                            className="hover:bg-foreground "
                            onClick={() => {
                                // toast({
                                //   title:"title" ,
                                //   description:"description",
                                //   action: (
                                //     <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
                                //   ),
                                // })

                                console.log(' ====   getNodes   ====  ');

                                console.log(reactFlow.getNodes());

                                console.log(' ====   getEdges   ====  ');

                                console.log(reactFlow.getEdges());

                                console.log(' ====   getEdges   ====  ');

                                // console.log(reactFlow.getViewport());
                            }}
                        >
                            {'Debug: print nodes and edges'}
                        </MenubarItem> */}

                        <MenubarItem
                            onClick={() =>
                                setOpenDialog((oldState) => ({
                                    ...oldState,
                                    openDialogSaveGraph: true,
                                }))
                            }
                        >
                            {'Save Graph '}
                        </MenubarItem>
                        <MenubarItem
                            onClick={() => {
                                dispatch(displayLoadStoredGraphsSheets());
                            }}
                        >
                            {'Load Graphs '}
                        </MenubarItem>

                        <MenubarItem
                            onClick={() =>
                                setOpenDialog((oldState) => ({
                                    ...oldState,
                                    openDialogDeleteAll: true,
                                }))
                            }
                        >
                            {'Clear Canvas '}
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>

            <DeleteAllNodes
                open={openDialog.openDialogDeleteAll}
                onOpenChange={(open) => {
                    setOpenDialog((oldState) => ({
                        ...oldState,
                        openDialogDeleteAll: open,
                    }));
                }}
            />

            <SaveNodeGraph
                open={openDialog.openDialogSaveGraph}
                onOpenChange={(open) => {
                    setOpenDialog((oldState) => ({
                        ...oldState,
                        openDialogSaveGraph: open,
                    }));
                }}
            />
        </div>
    );
}
