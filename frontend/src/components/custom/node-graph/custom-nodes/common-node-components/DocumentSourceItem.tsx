import { DocumentItemType } from '@/types/nodeGraphTypes';
import { FileIcon, TrashIcon } from 'lucide-react';

export default function DocumentSourceItem(props: {
    children?: React.ReactNode;
    fileItem: DocumentItemType;
    index: number;
    onDelete: (fileItem: string) => void;
}) {
    return (
        <div className="flex ">
            <div className=" flex w-[18rem] items-center rounded-xl bg-background px-4 py-4 text-xs">
                <FileIcon className="w-1/12" />

                <p className="ml-2 w-9/12">{props.fileItem.name}</p>
            </div>
            <div className=" flex flex-col justify-start ">
                {/* <PencilIcon className="text-primary p-1 " /> */}
                <TrashIcon
                    className=" p-1 text-destructive hover:cursor-pointer"
                    onClick={() => props.onDelete(props.fileItem.name)}
                />
            </div>
        </div>
    );
}
