import { ComponentProps } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

type HandleProps = ComponentProps<typeof Handle> & {
    label: string;
};

export default function LabeledHandle({
    type,
    position,
    label,
    id,
    className,
}: HandleProps) {
    let transform = '-top-0.5 ';

    switch (position) {
        case Position.Left:
            transform = transform + `left-5 `;
            break;
        case Position.Right:
            transform = transform + `right-5 `;
            break;

        default:
            transform = `-top-1.5 `;
            break;
    }
    const { getEdges } = useReactFlow();

    return (
        <div className={`relative h-2 w-2 ${className}`}>
            <Handle
                className={`p-1.5 `}
                type={type}
                position={position}
                id={id}
            >
                <div
                    className={` nodrag nopan absolute bg-transparent text-xs font-extralight opacity-60 ${transform}`}
                >
                    {label}
                </div>
            </Handle>
        </div>
    );
}
