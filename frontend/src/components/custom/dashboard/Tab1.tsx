import { TabsContent } from '@/components/ui/tabs';
// import { GearIcon, BarChartIcon, } from "@radix-ui/react-icons";
import {
    BarChartIcon,
    CalculatorIcon,
    DollarSignIcon,
    SettingsIcon,
    TrendingUpIcon,
    UserPlusIcon,
} from 'lucide-react';

import ActivityLogCard from './ActivityLogCard';
import AreaGraphCard from './AreaGraphCard';
import BarGraphCard from './BarGraphCard';
import BasicLineGraphCard from './BasicLineChartCard';
import CircleBarGraphCard from './CircleBarGraphCard';
import MetricCard from './MetricCard';
import SimpleTableCard from './SimpleTableCard';

export type MetricItem = {
    metricTitle: string;
    metricValue: string;
    additionalMetric: number;
    additionalMetricDescription: string;
    icon?: React.ReactNode;
};

export default function Tab1(props: { value: string }) {
    const iconStyle = 'w-20 h-20 p-4 text-primary rounded-full bg-foreground ';
    const metrics: MetricItem[] = [
        {
            metricTitle: 'Total Sales',
            metricValue: '$756,789.00',
            additionalMetric: 24,
            additionalMetricDescription: ' vs last month',
            icon: <TrendingUpIcon className={iconStyle} />,
        },
        {
            metricTitle: 'Net Income',
            metricValue: '$84,255.00',
            additionalMetric: 34,
            additionalMetricDescription: ' vs last month',
            icon: <DollarSignIcon className={iconStyle} />,
        },

        {
            metricTitle: 'New Customers',
            metricValue: '1 243',
            additionalMetric: -5,
            additionalMetricDescription: ' from last quarter',
            icon: <UserPlusIcon className={iconStyle} />,
        },
        // {
        //   metricTitle: "Operational Costs",
        //   metricValue: "$63,200.00",
        //   additionalMetric: -9,
        //   additionalMetricDescription: " since last year",
        //   icon: <CalculatorIcon className={iconStyle} />,
        // },
    ];
    return (
        <TabsContent value={props.value} className="px-5  ">
            <div className="mb-5 mt-5 flex flex-wrap gap-4">
                {metrics.map((v: MetricItem) => (
                    <MetricCard key={v.metricTitle} metricItem={v} />
                ))}

                <AreaGraphCard title={'Sales Overview'} />

                <CircleBarGraphCard title={'Growth Overview'} />

                <BarGraphCard title={'User Activations'} />
                <BasicLineGraphCard title={'Transactions'} />
                <ActivityLogCard title={'Latest Activity'} />
                <SimpleTableCard title={'Recent Orders'} />
            </div>
        </TabsContent>
    );
}
