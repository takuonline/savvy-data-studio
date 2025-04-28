'use client';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { setApiKeyId } from '@/features/nodeGraphState/nodeGraphSlice';
import { ApiKeyItem } from '@/types/nodeGraphTypes';
import { KeyIcon } from 'lucide-react';
import { XIcon } from 'lucide-react';
import React from 'react';

export default function ApiKeyCardItem(props: {
    item: ApiKeyItem;
    onDelete: (id: string) => void;
}) {
    const activeApiKeyId = useAppSelector(
        (state: RootState) => state.nodeGraph.settings.openaiKeyId,
    );
    const dispatch = useAppDispatch();

    const setActivateApiKeyId = (id: number) => {
        dispatch(setApiKeyId(id));
    };

    return (
        <div className=" relative mb-4 flex w-full items-center space-x-4 rounded-xl border border-border p-4">
            <KeyIcon />

            <Label
                htmlFor={`${props.item.id}-ApiKeyCardItem`}
                className="flex-1 space-y-1"
            >
                <p className="text-sm font-light leading-none">
                    {props.item.name}
                </p>
                <p className="text-xs font-extralight text-muted-foreground">
                    {`Secret key: ${props.item.api_key_redacted}  `}
                </p>

                <p className="text-xs font-extralight text-muted-foreground">
                    {`Created on: ${props.item.created_at}  `}
                </p>
            </Label>

            <Switch
                id={`${props.item.id}-ApiKeyCardItem`}
                className={'mt-7 border border-primary  bg-red-400'}
                checked={props.item.id === activeApiKeyId}
                onCheckedChange={(checked: boolean) => {
                    if (checked) {
                        setActivateApiKeyId(props.item.id);
                    } else {
                        setActivateApiKeyId('');
                    }
                }}
            />

            <XIcon
                onClick={() => {
                    console.log(props.item.id);
                    console.log(props.item);

                    props.onDelete(props.item.id);
                }}
                className=" absolute right-1 top-0 h-7 w-7 p-1.5   text-destructive hover:opacity-70"
            />
        </div>
    );
}
