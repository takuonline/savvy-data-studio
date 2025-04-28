import { TabsContent } from '@/components/ui/tabs';

import DataGrid from '../data-grid/DataGrid';
import { SimpleTableComponent } from './SimpleTableCard';

export default function Tab2(props: { value: string }) {
    return (
        <TabsContent value={props.value} className=" px-12 py-2">
            <DataGrid />
            {/* <SimpleTableComponent /> */}
        </TabsContent>
    );
}
