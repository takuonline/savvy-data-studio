import NodeTextInput from '@/components/custom/node-graph/custom-nodes/common-node-components/NodeTextInput';
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
import { Input } from '@/components/ui/input';
import NodeGraphServices from '@/services/NodeGraphServices';
import { ErrorMessage } from '@hookform/error-message';
import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useReactFlow } from 'reactflow';

export default function SaveNodeGraph(props: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { getEdges, getNodes } = useReactFlow();

    const {
        register,
        handleSubmit,
        formState: { errors, isLoading },
    } = useForm();

    const onSubmit: SubmitHandler<FieldValues> = async (d) => {
        setErrorMessage('');

        console.log(' = = = = sending request   =  = =  ');
        console.log(d);

        const nodeData = {
            nodes: getNodes(),
            edges: getEdges(),
            label: d.graphLabel,
            description: d.graphDescription,
        };

        const response = await NodeGraphServices.saveNodeGraph({
            nodeData,
        });

        if (!response.message) {
            props.onOpenChange(false);
            return;
        } else if (response.message) {
            setErrorMessage(response.message);
        } else {
            console.log(response);

            setErrorMessage('Error connecting to server');
        }
    };

    return (
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
            <DialogContent className="rounded-2xl border-border sm:max-h-[40rem] sm:max-w-[30rem]">
                <DialogHeader>
                    <DialogTitle>Save graph state</DialogTitle>
                    {/* <DialogDescription>{"Save graph"} </DialogDescription> */}
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-10 grid gap-8 py-4 ">
                        <div className="flex flex-col items-start justify-start gap-4  ">
                            <Input
                                id="label"
                                type="text"
                                placeholder="Graph Name"
                                {...register('graphLabel', {
                                    required: true,
                                    maxLength: {
                                        value: 50,
                                        message:
                                            'You have exceeded the max length of this field of 50',
                                    },
                                })}
                                style={{}}
                            />
                        </div>
                        <div className="text-xs text-red-600 ">
                            <ErrorMessage
                                errors={errors}
                                name="confirmPassword"
                            />
                        </div>

                        <div className="   flex flex-col items-start justify-start gap-4 ">
                            <div className="h-full w-full rounded border border-border">
                                <NodeTextInput
                                    placeholder="Graph Description"
                                    className="h-20 w-full rounded border active:border-white "
                                    register={register('graphDescription', {
                                        maxLength: {
                                            value: 200,
                                            message:
                                                'You have exceeded the max length of this field of 200',
                                        },
                                    })}
                                />
                            </div>

                            <div className="text-xs text-red-600 ">
                                <ErrorMessage
                                    errors={errors}
                                    name="confirmPassword"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className=" flex w-full flex-wrap gap-y-5 ">
                        <Button
                            type="submit"
                            className="w-full rounded bg-primary "
                            variant="ghost"
                        >
                            {'Save'}
                        </Button>
                        {isLoading && (
                            <p className="my-2 py-4 text-center text-primary">
                                Loading...
                            </p>
                        )}

                        {errorMessage && (
                            <p className=" mb-2 w-full text-center text-sm text-red-600 ">
                                {errorMessage}
                            </p>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
