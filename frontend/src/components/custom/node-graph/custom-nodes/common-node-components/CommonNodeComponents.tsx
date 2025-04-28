import React from 'react';
import { useReactFlow, useStoreApi } from 'reactflow';

function NodeSelect({
    value,
    nodeId,
    options,
    selectionTitle,
}: {
    value: string;

    nodeId: string;
    options: {
        value: string;
        label: string;
    }[];
    selectionTitle?: string;
}) {
    const { setNodes } = useReactFlow();
    const store = useStoreApi();

    const onChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        const { nodeInternals } = store.getState();

        setNodes(
            Array.from(nodeInternals.values()).map((node) => {
                if (node.id === nodeId) {
                    node.data = {
                        ...node.data,
                        modelName: evt.target.value,
                    };
                }

                return node;
            }),
        );
    };

    return (
        <div className="textinput-node__select ">
            <div>{selectionTitle + ':' ?? 'Select:'} </div>
            <select
                className="nodrag h-full w-full bg-white bg-opacity-5 px-2 py-1"
                onChange={onChange}
                value={value}
            >
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        className="bg-foreground px-2 py-3 font-medium"
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export { NodeSelect };
