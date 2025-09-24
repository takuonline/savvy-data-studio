'use client';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import React from 'react';

import CardWrapper from './CardWrapper';
import SelectAggregation from './SelectAggregation';

function LogItem(props: { logItem: { title: string; descriptions: string } }) {
    const { logItem } = props;
    return (
        <div className="relative w-11/12 rounded border border-white/10 bg-foreground px-3 py-4 hover:border-primary ">
            <p className="mb-1 text-xs ">{logItem.title}</p>
            <p className="text-[0.65rem] font-extralight opacity-60">
                {logItem.descriptions}
            </p>

            <div className="absolute  -right-7 top-0 flex h-full flex-col justify-around gap-y-2">
                <div className="relative h-full text-primary">
                    <div className="absolute h-full w-full rounded bg-primary opacity-10 "></div>
                    <PencilIcon className="h-full w-6 p-1 text-primary" />
                </div>

                <div className="relative h-full text-accent">
                    <div className="absolute h-full w-full rounded bg-primary opacity-10 "></div>
                    <Trash2Icon className=" h-full w-6 p-1 text-destructive " />
                </div>
            </div>
        </div>
    );
}

export default function ActivityLogCard(props: { title: string }) {
    const logItems = [
        {
            title: 'Google project Apply Review',
            descriptions: 'Complete in 3 hours',
        },
        {
            title: 'Google project Apply Review',
            descriptions: 'Complete in 3 hours',
        },
        {
            title: 'Google project Apply Review',
            descriptions: 'Complete in 3 hours',
        },
        {
            title: 'Google project Apply Review',
            descriptions: 'Complete in 3 hours',
        },
        {
            title: 'Google project Apply Review',
            descriptions: 'Complete in 3 hours',
        },
        {
            title: 'Google project Apply Review',
            descriptions: 'Complete in 3 hours',
        },
    ];

    return (
        <CardWrapper
            showFilter={false}
            title={props.title}
            className=" w-[30%] overflow-y-auto  "
        >
            <div className="space-y-4 pt-7">
                {logItems.map((v, i) => (
                    <LogItem key={i} logItem={v} />
                ))}
            </div>
        </CardWrapper>
    );
}
