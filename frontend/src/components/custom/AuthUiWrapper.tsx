'use client';

import { Icons } from '@/components/icons';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import React from 'react';

type LoginProp = {
    children: React.ReactNode;
    title: string;
    className?: string;
};
export default function AuthUiWrapper({
    children,
    title,
    className,
}: LoginProp) {
    return (
        <Card
            className={`  flex flex-col rounded-xl border-border  px-9 pt-6  ${className}`}
        >
            <CardHeader className="relative items-center space-y-3 pt-8 text-center  ">
                <Icons.appLogo className=" size-16 " />

                <CardTitle className="text-2xl font-medium ">{title}</CardTitle>
            </CardHeader>
            {children}
        </Card>
    );
}
