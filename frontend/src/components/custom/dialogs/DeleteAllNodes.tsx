'use client';

import { useAppDispatch } from '@/app/hooks';
import GraphUtils from '@/app/utils/graphUtils';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { TrashIcon } from 'lucide-react';
import { useReactFlow } from 'reactflow';

export function DeleteAllNodes(props: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const reactFlow = useReactFlow();
    const dispatch = useAppDispatch();

    return (
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
            <DialogContent className="top-[40%] rounded-2xl  border border-border px-8 py-10 sm:max-w-[350px]">
                <DialogHeader>
                    {/* <DialogTitle>Delete all nodes?</DialogTitle> */}

                    <div className=" flex w-full items-center justify-center  ">
                        {/* <Avatar className=""> */}
                        <TrashIcon className="m-2 flex h-20 w-20 items-center justify-center rounded-full bg-foreground p-5 text-center text-red-500 " />
                        {/* </Avatar> */}
                    </div>
                </DialogHeader>
                <DialogDescription className="text-md px-6 text-center">
                    {' Do you want to delete all the nodes and connections?'}{' '}
                </DialogDescription>
                <DialogFooter>
                    <Button
                        className="rounded  bg-red-500 hover:bg-foreground"
                        onClick={() => {
                            GraphUtils.deleteAll(reactFlow);

                            props.onOpenChange(false);
                        }}
                    >
                        {'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
