import {
    NodeTemplate,
    TEMPLATES,
    getTemplate,
    nodeTemplates,
} from '@/components/custom/template-graphs/templates';
import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useMemo } from 'react';
import { useReactFlow } from 'reactflow';

import { NodeEditingSheetWrapper } from './NodeEditingSheetWrapper';

const NodeTemplateItem = ({ template }: { template: NodeTemplate }) => {
    const reactFlow = useReactFlow();

    const nodeTypes = useMemo(() => {
        return Object.values(TEMPLATES[template.templateId].nodes).map(
            (n) => n.type,
        );
    }, [template.templateId]);

    const handleOnClick = () => {
        const viewPort = reactFlow.getViewport();

        const { nodes, edges } = getTemplate(template.templateId, {
            x: viewPort.x,
            y: viewPort.y,
        });

        reactFlow.addNodes(nodes);
        reactFlow.addEdges(edges);
    };

    return (
        <div
            className="mx-1 my-4 overflow-y-auto   rounded-xl border border-transparent bg-background px-4 py-4 hover:cursor-pointer hover:border-white hover:bg-primary"
            onClick={handleOnClick}
        >
            <div className="text-md font-extrabold ">
                {template.templateTitle}
            </div>

            <hr className="mb-4 mt-2 border-b" />

            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2 ">
                {nodeTypes.map((item, index) => (
                    <div key={index}>
                        <Badge className="border-1 bg-foreground hover:bg-background ">
                            {item ?? ''}
                        </Badge>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function NodeExecutionTemplatesSheet(props: {}) {
    return (
        <NodeEditingSheetWrapper>
            <SheetContent className="overflow-y-auto  border-none">
                <SheetHeader className="mb-7 mt-5">
                    <SheetTitle className=" mb-2  text-xl text-primary ">
                        {'Templates'}
                    </SheetTitle>
                </SheetHeader>

                <p className="mb-2 text-sm font-bold">{'Prompt text'}</p>
                <div className="bg-foreground px-4 py-3 text-xs ">
                    {nodeTemplates.map((v, index) => (
                        <NodeTemplateItem
                            key={v.templateId + index}
                            template={v}
                        />
                    ))}
                </div>
            </SheetContent>
        </NodeEditingSheetWrapper>
    );
}
