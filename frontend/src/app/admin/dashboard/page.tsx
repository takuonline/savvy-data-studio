import Tab1 from '@/components/custom/dashboard/Tab1';
import Tab2 from '@/components/custom/dashboard/Tab2';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Dashboard() {
    const dataStateChangeStyle =
        'mx-1  data-[state=active]:text-primary data-[state=active]:border-primary hover:bg-background   data-[state=active]:border-b-4 ';
    return (
        <Tabs defaultValue="account" className="h-full w-full ">
            <TabsList className="grid w-5/12 grid-cols-2 items-start rounded-tl-3xl bg-foreground  p-0">
                <TabsTrigger
                    value="account"
                    className={` ${dataStateChangeStyle}   ml-0	data-[state=inactive]:rounded-tl-3xl `}
                >
                    Dashboard
                </TabsTrigger>

                <TabsTrigger
                    value="dataGrid"
                    className={` ${dataStateChangeStyle}   `}
                >
                    DataGrid
                </TabsTrigger>
            </TabsList>
            <Tab1 value="account" />
            <Tab2 value="dataGrid" />
        </Tabs>
    );
}
