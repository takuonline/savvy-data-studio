'use client';

// @ts-ignore
import {
    useAppDispatch, // useAppSelector
} from '@/app/hooks';
import GraphUtils from '@/app/utils/graphUtils';
import Utils from '@/app/utils/utils';
import GraphBgContextMenu from '@/components/custom/node-graph/GraphBgContextMenu';
import GraphExecution from '@/components/custom/node-graph/GraphExecution';
import NodeContextMenu from '@/components/custom/node-graph/NodeContextMenu';
import ChatModelNode from '@/components/custom/node-graph/custom-nodes/ChatModelNode';
import DocumentInputNode from '@/components/custom/node-graph/custom-nodes/DocumentInputNode';
import ImageInputNode from '@/components/custom/node-graph/custom-nodes/ImageInputNode';
import TextInputNode from '@/components/custom/node-graph/custom-nodes/TextInputNode';
import TextOutputNode from '@/components/custom/node-graph/custom-nodes/TextOutputNode';
import VectorSearchNode from '@/components/custom/node-graph/custom-nodes/VectorSearchNode';
import NodeEditingSheetGeneral from '@/components/custom/node-graph/node-editing-sheet/NodeEditingSheet';
import withAuth from '@/components/custom/withAuth';
import { Toaster } from '@/components/ui/toaster';
import {
    setContextMenuClickPosition,
    setNodeGraphEditing,
    updateCurrentlySelectedNode, // updateNodesChanges,
} from '@/features/nodeGraphState/nodeGraphSlice';
import React from 'react';
import ReactFlow, {
    Background,
    Connection,
    Controls,
    Edge,
    EdgeTypes,
    HandleType,
    MiniMap,
    Node,
    NodeMouseHandler,
    NodeTypes,
    OnConnectEnd,
    ReactFlowInstance,
    addEdge,
    updateEdge,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

const nodeTypes: NodeTypes = {
    textInput: TextInputNode,
    imageInput: ImageInputNode,
    textOutput: TextOutputNode,
    chatModel: ChatModelNode,
    documentInput: DocumentInputNode,
    vectorSearch: VectorSearchNode,
};
const edgeTypes: EdgeTypes = {
    // labeledEdge: LabeledEdge,
};

const onInit = (reactFlowInstance: ReactFlowInstance) => {
    reactFlowInstance.fitView();
};

const NodeGraph = () => {
    const [showGraphBgContextMenu, setShowGraphBgContextMenu] =
        React.useState<boolean>(false);
    const [showNodeContextMenu, setShowNodeContextMenu] =
        React.useState<boolean>(false);
    const edgeUpdateSuccessful = React.useRef(true);
    const dispatch = useAppDispatch();
    const reactFlowWrapper = React.useRef(null);

    const [nodes, setNodes, onNodesChange] = useNodesState(
        Utils.loadFromLocalStorage('nodes') ?? [],
    );

    const [edges, setEdges, onEdgesChange] = useEdgesState(
        Utils.loadFromLocalStorage('edges') ?? [],
    );

    const reactFlow = useReactFlow();
    const onConnect = React.useCallback(
        (connection: Connection) => {
            setEdges((oldEdges) => addEdge(connection, oldEdges));
        },
        [setEdges],
    );

    const onConnectEnd: OnConnectEnd = React.useCallback(
        (event: MouseEvent | TouchEvent) => {
            GraphUtils.onConnectEnd(reactFlow);
            console.log('onConnectEnd');
        },
        [reactFlow],
    );

    const edgesCopy = JSON.parse(JSON.stringify(edges)) as Edge[];
    const edgesWithUpdatedTypes = edgesCopy.map((edge) => {
        edge.animated = true;
        return edge;
    });

    const handleCommonContextMenuOpenLogic = React.useCallback(
        (event: React.MouseEvent<Element, MouseEvent>) => {
            event.preventDefault();

            if (reactFlowWrapper.current) {
                const { top, left } = (
                    reactFlowWrapper.current as HTMLDivElement
                ).getBoundingClientRect();

                const pos = reactFlow.project({
                    x: event.clientX - left,
                    y: event.clientY - top,
                });

                dispatch(
                    setContextMenuClickPosition({
                        projectedPosition: pos,
                        position: {
                            x: event.clientX,
                            y: event.clientY,
                        },
                    }),
                );
            }
        },
        [dispatch, reactFlow],
    );

    const onPaneContextMenu = React.useCallback(
        (event: React.MouseEvent<Element, MouseEvent>) => {
            event.preventDefault();

            if (reactFlowWrapper.current) {
                handleCommonContextMenuOpenLogic(event);
                setShowNodeContextMenu(false);
                setShowGraphBgContextMenu(true);
            }
        },
        [handleCommonContextMenuOpenLogic],
    );

    React.useEffect(() => {
        const handleClick = (ev: MouseEvent) => {
            type CustomInputElement = Element & { 'data-id': string };

            setShowGraphBgContextMenu(false);
            setShowNodeContextMenu(false);
        };
        window.addEventListener('click', handleClick);
        // window.addEventListener("contextmenu", handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
            // window.removeEventListener("contextmenu", handleClick);
        };
    }, []);

    const onEdgeUpdateStart = React.useCallback(
        (
            event: React.MouseEvent<Element, MouseEvent>,
            edge: Edge<any>,
            handleType: HandleType,
        ) => {
            edgeUpdateSuccessful.current = false;
        },
        [],
    );

    const onEdgeUpdate = React.useCallback(
        (oldEdge: Edge, newConnection: Connection) => {
            edgeUpdateSuccessful.current = true;

            updateEdge(oldEdge, newConnection, edges);
        },
        [edges],
    );

    const onEdgeUpdateEnd = React.useCallback(
        (_: MouseEvent | TouchEvent, edge: Edge) => {
            if (!edgeUpdateSuccessful.current) {
                GraphUtils.removeEdge(reactFlow, edge.id);
            }
            edgeUpdateSuccessful.current = true;
        },
        [reactFlow],
    );

    const onNodeContextMenu: NodeMouseHandler = (
        e: React.MouseEvent,
        node: Node,
    ) => {
        handleCommonContextMenuOpenLogic(e);

        dispatch(updateCurrentlySelectedNode(node));
        setShowGraphBgContextMenu(false);
        setShowNodeContextMenu(true);
    };

    const onNodeDoubleClick: NodeMouseHandler = (
        event: React.MouseEvent,
        node: Node,
    ) =>
        dispatch(
            setNodeGraphEditing({
                isEditingNode: true,
                nodeId: node.id,
            }),
        );

    return (
        <div className=" h-[95vh] ">
            <NodeEditingSheetGeneral />

            <ReactFlow
                nodes={nodes}
                edges={edgesWithUpdatedTypes}
                onConnect={onConnect}
                onConnectEnd={onConnectEnd}
                attributionPosition="bottom-left"
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onPaneContextMenu={onPaneContextMenu}
                ref={reactFlowWrapper}
                onNodesChange={onNodesChange}
                onNodeDoubleClick={onNodeDoubleClick}
                onNodeContextMenu={onNodeContextMenu}
                onEdgesChange={onEdgesChange}
                onEdgeUpdate={onEdgeUpdate}
                onEdgeUpdateStart={onEdgeUpdateStart}
                onEdgeUpdateEnd={onEdgeUpdateEnd}
                // maxZoom={0.7}
                onInit={onInit}
                className="rounded-tl-3xl "

                // onClick={(e) => setShowContextMenu(false)}
            >
                <MiniMap
                    zoomable
                    pannable
                    maskStrokeWidth={4}
                    maskStrokeColor="rgb(var(--primary))"
                    maskColor={'rgb(0, 0, 0, 0.3)'}
                    nodeColor={'rgb(var(--primary))'}
                    className="rounded [&_svg]:bg-background "
                />

                <Controls
                    // className="[&_button]:bg-background [&_button]:bg-opacity-20 [&_button]:border-primary [&_svg]:bg-primary [&>path]:bg-primary "
                    className=" "
                />
                <Background color="#aaa" gap={16} />
                <GraphExecution />
            </ReactFlow>

            {showGraphBgContextMenu && <GraphBgContextMenu />}
            {showNodeContextMenu && <NodeContextMenu />}
        </div>
    );
};

export default NodeGraph;
