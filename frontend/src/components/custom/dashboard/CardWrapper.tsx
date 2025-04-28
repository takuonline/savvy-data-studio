'use client';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import React from 'react';

import SelectAggregation from './SelectAggregation';

export default function CardWrapper(props: {
    title: string;

    showFilter?: boolean;
    children: React.ReactNode;
    className?: string;
}) {
    const showFilter = props.showFilter ?? true;

    let aggComponent = (
        <SelectAggregation
            options={['Yearly', 'Monthly', 'Daily']}
            title={'Agregation'}
        />
    );

    if (!showFilter) {
        aggComponent = <div></div>;
    }

    const className = ` flex flex-col rounded-2xl w-4/12 p-5 ${props.className} `;

    return (
        <>
            <Card className={` h-96  ${className}`}>
                <CardTitle className="flex w-full items-center justify-between font-semibold ">
                    <p className=" text-xl">{props.title}</p>
                    {aggComponent}
                </CardTitle>

                <div className=" pt-2">{props.children}</div>
            </Card>
        </>
    );
}
