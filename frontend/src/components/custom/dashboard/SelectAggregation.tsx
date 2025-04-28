import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';

// import echarts from "echarts/types/dist/echarts";

type SelectProp = {
    options: string[];
    title: string;
};

export default function SelectAggregation(props: SelectProp) {
    const { options, title } = props;

    return (
        <Select>
            <SelectTrigger className="w-12/12 rounded-full border-foreground px-6 py-5 [&>span]:text-primary">
                <p className="mr-4 text-xs font-extralight opacity-40">
                    {title}
                </p>

                <SelectValue placeholder={options[0]} />
            </SelectTrigger>

            <SelectContent>
                {options.map((v) => (
                    <SelectItem className="text-xs" key={v} value={v}>
                        {v}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
