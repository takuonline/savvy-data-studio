import Utils from '@/app/utils/utils';
import { AVAILABLE_NODES } from '@/features/nodeGraphState/state-defaults';
import { Edge, Node, ReactFlowInstance, XYPosition } from 'reactflow';

// Define a generic type that extends the base Node data structure to accommodate custom data types.
type NodeDataPartial<T> = Partial<T>;

// The utility function to update a node's data within React Flow.
function updateMultiNodeData<T>(
    reactFlowInstance: ReactFlowInstance,
    dataMap: Map<string, NodeDataPartial<T>>,
): void {
    const nodeIds = Array.from(dataMap.keys());
    reactFlowInstance.setNodes((nodes: Node<T>[]) =>
        nodes.map((node: Node<T>) => {
            if (nodeIds.includes(node.id)) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        ...dataMap.get(node.id),
                    },
                };
            }
            return node;
        }),
    );
}
// The utility function to update a node's data within React Flow.
function updateNodeData<T>(
    reactFlowInstance: ReactFlowInstance,
    nodeId: string, // The ID of the node to update
    updateNodeData: NodeDataPartial<T>, // The data to update the node with
): void {
    reactFlowInstance.setNodes((nodes: Node<T>[]) =>
        nodes.map((node: Node<T>) => {
            if (node.id === nodeId) {
                // Create a new node object with updated data
                return {
                    ...node,
                    data: {
                        ...node.data,
                        ...updateNodeData,
                    },
                };
            }
            return node;
        }),
    );
}

function deleteNode(
    reactFlowInstance: ReactFlowInstance,
    nodeId: string,
): void {
    reactFlowInstance.setNodes((nodes) =>
        nodes.filter((node) => node.id !== nodeId),
    );

    Utils.saveToLocalStorage('nodes', reactFlowInstance.getNodes());
}

function duplicateNode(
    reactFlowInstance: ReactFlowInstance,
    nodeToDuplicate: Node,
): void {
    // Deep copy the node
    const nodeCopy: Node = JSON.parse(JSON.stringify(nodeToDuplicate));

    // Assign a new unique ID
    nodeCopy.id = Utils.makeid();

    // Adjust the position (e.g., moving it 250px down)
    nodeCopy.position = { ...nodeCopy.position, y: nodeCopy.position.y + 250 };

    // Ensure the node is not selected
    nodeCopy.selected = false;

    // Add the duplicated node to the React Flow instance
    reactFlowInstance.setNodes((nodes) => [...nodes, nodeCopy]);

    Utils.saveToLocalStorage('nodes', reactFlowInstance.getNodes());
}

function removeEdge(
    reactFlowInstance: ReactFlowInstance,
    edgeId: string,
): void {
    reactFlowInstance.setEdges((edges) =>
        edges.filter((edge) => edge.id !== edgeId),
    );

    Utils.saveToLocalStorage('edges', reactFlowInstance.getEdges());
}

function addNewNode(
    reactFlowInstance: ReactFlowInstance,
    templateNodeKey: keyof typeof AVAILABLE_NODES,
    position: XYPosition,
): void {
    // Ensure the key exists in AVAILABLE_NODES to prevent runtime errors
    if (!(templateNodeKey in AVAILABLE_NODES)) {
        console.error(`No template node found for key: ${templateNodeKey}`);
        return;
    }

    // Retrieve the template node to be cloned
    const templateNode = AVAILABLE_NODES[templateNodeKey] as Node;

    // Clone the template node to create a new, unique node
    const newNode: Node = {
        ...templateNode,
        id: Utils.makeid(), // Generate a unique ID for the new node
        position, // Use the provided position
    };

    // Use the React Flow instance to add the new node
    reactFlowInstance.addNodes(newNode);

    Utils.saveToLocalStorage('nodes', reactFlowInstance.getNodes());
}

function deleteAll(reactFlowInstance: ReactFlowInstance): void {
    reactFlowInstance.deleteElements({
        nodes: reactFlowInstance.getNodes(),
        edges: reactFlowInstance.getEdges(),
    });

    console.log(reactFlowInstance.getNodes());
    console.log(reactFlowInstance.getEdges());

    Utils.saveToLocalStorage('nodes', []);
    Utils.saveToLocalStorage('edges', []);
}

function deleteAllAndAddNew(
    reactFlowInstance: ReactFlowInstance,
    newNodes: Node[],
    newEdges: Edge[],
): void {
    reactFlowInstance.deleteElements({
        nodes: reactFlowInstance.getNodes(),
        edges: reactFlowInstance.getEdges(),
    });

    reactFlowInstance.setNodes(newNodes);
    reactFlowInstance.setEdges(newEdges);

    Utils.saveToLocalStorage('nodes', newNodes);
    Utils.saveToLocalStorage('edges', newEdges);
}

function onConnectEnd(reactFlowInstance: ReactFlowInstance) {
    Utils.saveToLocalStorage('edges', reactFlowInstance.getEdges());
    Utils.saveToLocalStorage('nodes', reactFlowInstance.getNodes());

    console.log(reactFlowInstance.getEdges());
}

const GraphUtils = {
    deleteNode,
    duplicateNode,
    updateNodeData,
    updateMultiNodeData,
    removeEdge,
    addNewNode,
    deleteAllAndAddNew,
    deleteAll,
    onConnectEnd,
};

export default GraphUtils;
