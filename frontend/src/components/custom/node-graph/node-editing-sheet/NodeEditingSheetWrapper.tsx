import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { setNodeGraphEditing } from '@/features/nodeGraphState/nodeGraphSlice';

export function NodeEditingSheetWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useAppDispatch();
    const editingNode = useAppSelector(
        (state: RootState) => state.nodeGraph.slidingSheet,
    );

    return (
        <>
            <Sheet
                modal={false}
                open={
                    editingNode.isEditingNode ||
                    editingNode.isShowingTemplates ||
                    editingNode.isShowingSavedGraphs
                }
                defaultOpen={false}
                onOpenChange={(open) =>
                    dispatch(
                        setNodeGraphEditing({
                            isEditingNode: open,
                            nodeId: editingNode.nodeId,
                        }),
                    )
                }
            >
                {children}
            </Sheet>
        </>
    );
}
