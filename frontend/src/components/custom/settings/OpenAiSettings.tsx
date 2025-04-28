import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NodeGraphServices from '@/services/NodeGraphServices';
import { ApiKeyItem } from '@/types/nodeGraphTypes';
import { isAxiosError } from 'axios';
import React from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

import LoadingSpinner from '../LoadingSpinner';
import { ApiKeyDialog } from '../dialogs/ApiKeyDialog';
import ApiKeyCardItem from './ApiKeyCardItem';

export default function OpenAiSettings() {
    const { data, isLoading, error, mutate } = useSWR(
        'nodeGraph/listUserApiKeys',
        (_) => NodeGraphServices.listUserApiKeys(),
    );

    const apiKeyItems = !isAxiosError(data)
        ? (data?.data?.results as ApiKeyItem[])
        : ([] as ApiKeyItem[]);
    const [openDialog, setSetOpenDialog] = React.useState<boolean>(false);

    const handleOpenDialog = (open: boolean) => {
        setSetOpenDialog(open);
    };

    const onDelete = async (id: string) => {
        const response = await NodeGraphServices.deleteUserApiKey(id);

        if (isAxiosError(response)) {
            toast.error(response.message);
        } else {
            mutate();
            // dispatch(listUserApiKeysThunk());
            toast.success('Successfully deleted key');
            setSetOpenDialog(false);
        }
    };

    return (
        <TabsContent
            value="openai"
            className=" mx-1 flex w-full flex-col   overflow-y-auto"
        >
            {error ? (
                <p className=" text-destructive">Error: {error.message}</p>
            ) : isLoading ? (
                <div className="h-full w-full ">
                    {' '}
                    <LoadingSpinner />
                </div>
            ) : apiKeyItems?.length > 0 ? (
                apiKeyItems?.map((apiItem) => {
                    return (
                        <ApiKeyCardItem
                            key={apiItem.id}
                            item={apiItem}
                            onDelete={onDelete}
                        />
                    );
                })
            ) : (
                <p className="flex w-full text-center text-sm font-normal  ">
                    {'No API keys found'}
                </p>
            )}

            <ApiKeyDialog
                openDialog={openDialog}
                onOpenChange={handleOpenDialog}
            />
        </TabsContent>
    );
}
