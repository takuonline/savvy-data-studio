'use client';

import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import React from 'react';

import CardWrapper from './CardWrapper';
import SelectAggregation from './SelectAggregation';

function GraphComponent() {
    let base = +new Date(1968, 9, 3);
    let oneDay = 24 * 3600 * 1000;
    let date = [];

    let data = [Math.random() * 300];

    for (let i = 1; i < 20000; i++) {
        var now = new Date((base += oneDay));
        date.push(
            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
        );
        data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
    }
    const option: echarts.EChartsOption = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    opacity: 0.07,
                },
            },
        },
        series: [
            {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar',
                barWidth: 15,
                showBackground: true,
                color: 'rgb(0, 168, 168)',
                backgroundStyle: {
                    opacity: 0.2,
                    //   color: "rgba(180, 180, 180, 0.2)",
                },
            },
        ],
    };
    return <ReactECharts option={option} notMerge={true} />;
}

export default function BarGraphCard(props: { title: string }) {
    return (
        <CardWrapper title={props.title} className="w-4/12">
            <GraphComponent />
        </CardWrapper>
    );
}
