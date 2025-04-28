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
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            },
        },
        title: {
            left: 'center',
            // text: "Large Area Chart",
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none',
                },
                restore: {},
                saveAsImage: {},
            },
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date,

            splitLine: {
                show: false,
            },
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],

            splitLine: {
                show: true,
                lineStyle: {
                    opacity: 0.07,
                    type: 'dashed',
                },
            },
        },
        // dataZoom: [
        //   {
        //     type: "inside",
        //     start: 0,
        //     end: 10,
        //   },
        //   {
        //     start: 0,
        //     end: 10,
        //   },
        // ],

        series: [
            {
                name: 'Fake Data',
                type: 'line',
                // symbol: "none",
                // sampling: "lttb",

                itemStyle: {
                    color: 'rgb(0, 168, 168)',
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(0, 168, 168,1)',
                        },
                        {
                            offset: 1,
                            color: 'rgba(0, 168, 168,0)',
                        },
                    ]),
                },
                data: data,
            },
        ],
    };

    return (
        <ReactECharts
            option={option}
            notMerge={true}
            // lazyUpdate={true}

            // showLoading
            // theme={"theme_name"}
            // onChartReady={onChartReadyCallback}
            // onEvents={EventsDict} //   opts={}
        />
    );
}

export default function AreaGraphCard(props: { title: string }) {
    return (
        <CardWrapper title={props.title} className="w-7/12">
            <GraphComponent />
        </CardWrapper>
    );
}
