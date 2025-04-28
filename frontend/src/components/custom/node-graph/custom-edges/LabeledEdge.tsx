import React, { FC } from 'react';
import {
    BaseEdge,
    EdgeLabelRenderer,
    EdgeProps,
    getBezierPath,
} from 'reactflow';

// this is a little helper component to render the actual edge label
function EdgeLabel({ transform, label }: { transform: string; label: string }) {
    return (
        <div
            style={{
                transform,
            }}
            className="nodrag nopan absolute bg-transparent p-3 text-xs font-extralight opacity-60 "
        >
            {label}
        </div>
    );
}

const LabeledEdge: FC<EdgeProps> = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
}) => {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <BaseEdge id={id} path={edgePath} />
            <EdgeLabelRenderer>
                {data.startLabel && (
                    <EdgeLabel
                        transform={`translate(0%, -50%) translate(${sourceX}px,${sourceY}px)`}
                        label={data.startLabel}
                    />
                )}
                {data.endLabel && (
                    <EdgeLabel
                        transform={`translate(-100%, -50%) translate(${targetX}px,${targetY}px)`}
                        label={data.endLabel}
                    />
                )}
            </EdgeLabelRenderer>
        </>
    );
};

export default LabeledEdge;
