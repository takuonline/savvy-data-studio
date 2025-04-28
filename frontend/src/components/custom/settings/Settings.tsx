'use client';

import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GearIcon, LockClosedIcon } from '@radix-ui/react-icons';
import React from 'react';

import OpenAiSettings from './OpenAiSettings';

export default function Settings() {
    const classNameCommon =
        'py-2 pr-12 my-2 data-[state=active]:text-primary data-[state=active]:bg-muted  rounded-[0.3rem]';
    return (
        <Dialog>
            <DialogTrigger className="m-0 flex w-full items-center rounded px-8 py-1 hover:bg-accent">
                <GearIcon className="mr-2 h-4 w-4 " />
                {'Settings'}
            </DialogTrigger>
            <DialogContent className=" flex flex-col items-start justify-start border-none sm:max-h-[35rem] sm:max-w-[45rem] ">
                <DialogHeader className=" ml-5  ">
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        {
                            "Make changes to your profile here. Click save when you're done."
                        }
                    </DialogDescription>
                </DialogHeader>

                <Tabs
                    defaultValue="openai"
                    className=" mx-3 flex h-[30rem] w-full items-start justify-start overflow-y-auto"
                    orientation="horizontal"
                    activationMode="automatic"
                >
                    <TabsList className="flex w-3/12 flex-col items-start justify-start bg-background">
                        <TabsTrigger
                            value="general"
                            className={`${classNameCommon} mt-0 `}
                        >
                            <GearIcon className="mr-2" />
                            General
                        </TabsTrigger>

                        <TabsTrigger
                            value="openai"
                            className={`${classNameCommon} `}
                        >
                            <LockClosedIcon className="mr-2" />
                            Openai
                        </TabsTrigger>
                    </TabsList>

                    <div className="w-8/12 ">
                        <TabsContent
                            value="general"
                            className=" flex w-full items-center justify-between "
                        >
                            <p> {'Theme'}</p>
                            <ThemeToggle />
                        </TabsContent>

                        <OpenAiSettings />
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
