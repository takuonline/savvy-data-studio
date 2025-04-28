import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import React from 'react';

import { MetricItem } from './Tab1';

export default function MetricCard(props: { metricItem: MetricItem }) {
    const {
        metricTitle,
        metricValue,
        additionalMetric,
        additionalMetricDescription,
        icon,
    } = props.metricItem;

    const isNegativeNumber = additionalMetric ? additionalMetric < 0 : false;
    const dynamicStyle = isNegativeNumber
        ? `bg-[color:rgb(var(--accent),.1)]  text-accent `
        : `bg-[color:rgb(var(--primary),.1)]  text-primary `;

    return (
        <Card className=" flex w-[22rem] rounded-2xl px-2 py-7 ">
            <div className=" flex w-4/12 items-center justify-center">
                {icon}
            </div>

            <div className="flex w-8/12 flex-col gap-2 ">
                <CardTitle className="text-sm font-light ">
                    {metricTitle}
                </CardTitle>
                <CardDescription className="grid gap-x-10 text-lg font-bold">
                    {metricValue}
                </CardDescription>

                <div className="flex items-baseline">
                    <Badge className={dynamicStyle}>
                        {additionalMetric > 0 ? '+' : ''}
                        {additionalMetric}%
                    </Badge>
                    {additionalMetricDescription}
                </div>
            </div>
        </Card>
    );
}
