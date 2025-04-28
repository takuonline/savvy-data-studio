import { useAppDispatch } from '@/app/hooks';
import { SettingsTextInputField } from '@/components/custom/settings/SettingsTextInputField';
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
import {
    listUserApiKeysThunk,
    setApiKeyId,
} from '@/features/nodeGraphState/nodeGraphSlice';
import NodeGraphServices from '@/services/NodeGraphServices';
import { isAxiosError } from 'axios';
import React from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import LoadingSpinner from '../LoadingSpinner';

export function ApiKeyDialog(props: {
    openDialog: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const dispatch = useAppDispatch();

    const [showApiKey, setShowApiKey] = React.useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit: SubmitHandler<FieldValues> = async (
        d: FieldValues,
        event?: React.BaseSyntheticEvent,
    ) => {
        const response = await NodeGraphServices.postUserApiKeys({
            name: d.apiKeyLabelName,
            apiKey: d.openaiApiKey,
            organizationName: d.organizationName,
            organizationId: d.organizationId,
            openaiTimeout: d.openaiTimeout,
        });

        if (isAxiosError(response)) {
            console.log(response);
            toast.error('Error adding API key');
        }else {



            dispatch(setApiKeyId(response.data.id));
            toast.success('API key added successfully');

            dispatch(listUserApiKeysThunk());

            props.onOpenChange(false);
        }
    };

    return (
        <Dialog open={props.openDialog} onOpenChange={props.onOpenChange}>
            <DialogTrigger asChild className="">
                <Button
                    size={'sm'}
                    className=" rounded-lg text-xs hover:bg-primary hover:opacity-90"
                >
                    {'Add new key'}
                </Button>
            </DialogTrigger>
            <DialogContent className="rounded-xl border-border sm:max-w-[30rem] ">
                <DialogHeader>
                    <DialogTitle>{'Add new key'}</DialogTitle>
                    <DialogDescription>
                        {' Add a new api key'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3  ">
                    <div className="flex flex-col items-start">
                        <SettingsTextInputField
                            type="text"
                            labelTitle="Name"
                            description="A label of your key"
                            formRegister={register('apiKeyLabelName', {
                                required: 'This field is required',
                                maxLength: {
                                    value: 100,
                                    message:
                                        'You have exceeded the max length of this field of 100',
                                },
                            })}
                            errors={errors}
                        />

                        <div className="relative flex w-full">
                            <SettingsTextInputField
                                labelTitle="OpenAI API keys(required)"
                                autoComplete="new-password"
                                type={showApiKey ? 'text' : 'password'}
                                errors={errors}
                                description="This field is for entering your unique OpenAI API key, which provides secure access to OpenAI's API services."
                                formRegister={register('openaiApiKey', {
                                    required: 'This field is required',
                                    maxLength: {
                                        value: 100,
                                        message:
                                            'You have exceeded the max length of this field of 100',
                                    },
                                })}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full rounded bg-primary "
                        variant="ghost"
                    >
                        {isSubmitting ? (
                            <>
                                <LoadingSpinner /> {'Submitting...'}{' '}
                            </>
                        ) : (
                            'Submit'
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
