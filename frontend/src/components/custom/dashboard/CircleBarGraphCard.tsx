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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import React from 'react';

import CardWrapper from './CardWrapper';
import SelectAggregation from './SelectAggregation';

// import echarts from "echarts/types/dist/echarts";

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
        title: [
            {
                // text: "Tangential Polar Bar Label Position (middle)",
            },
        ],
        polar: {
            //adjust radius size and % occupied by graph
            radius: [40, '70%'],
        },

        angleAxis: {
            max: 4,
            startAngle: 75,
            splitLine: {
                show: false,
            },
        },

        radiusAxis: {
            type: 'category',
            data: ['a', 'b', 'c', 'd'],
        },
        tooltip: {},
        series: {
            type: 'bar',
            showBackground: true,
            roundCap: true,
            colorBy: 'data',
            barWidth: 11,
            barGap: 20,
            barCategoryGap: 200,

            color: [
                '#0A6464',
                '#F9B47D',
                'rgba(243, 134, 48, 1)',
                'rgb(0, 168, 168)',
            ],
            backgroundStyle: {
                opacity: 0.2,
            },

            itemStyle: {
                borderCap: 'round',
            },
            data: [2, 1.2, 2.4, 3.6],
            coordinateSystem: 'polar',

            label: {
                show: false,
                position: 'middle',
                formatter: '{b}: {c}',
            },
        },
    };

    return <ReactECharts option={option} notMerge={true} />;
}

export default function CircleBarGraphCard(props: { title: string }) {
    return (
        <CardWrapper title={props.title} className="w-4/12">
            <GraphComponent />
        </CardWrapper>
    );
}
