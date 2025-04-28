'use client';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
    NodeTemplate,
    TEMPLATES,
    getTemplate,
    nodeTemplates,
} from '@/components/custom/template-graphs/templates';
import { ActiveSidebarPageEnum } from '@/components/enums/Enums';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from '@/components/ui/command';
import { activeSidebar } from '@/features/activeSidebar/activeSidebar';
import { setAuthStatus } from '@/features/auth/authSlice';
import {
    CalendarIcon,
    EnvelopeClosedIcon,
    FaceIcon,
    GearIcon,
    PersonIcon,
    RocketIcon,
} from '@radix-ui/react-icons';
import { Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useReactFlow } from 'reactflow';

import { DeleteAllNodes } from './dialogs/DeleteAllNodes';
import Settings from './settings/Settings';

const NodeTemplateNavSearchItem = ({
    template,
    index,
}: {
    template: NodeTemplate;
    index: number;
}) => {
    const reactFlow = useReactFlow();

    const handleOnClick = () => {
        const viewPort = reactFlow.getViewport();

        console.log(' ========    command item =========  ');
        console.log(viewPort);

        const { nodes, edges } = getTemplate(template.templateId, {
            x: viewPort.x,
            y: viewPort.y,
        });

        reactFlow.addNodes(nodes);
        reactFlow.addEdges(edges);
    };

    return (
        <CommandItem onSelect={handleOnClick}>
            <span>{template.templateTitle}</span>
        </CommandItem>
    );
};

function SuggestionsNavSearchGroup() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    return (
        <CommandGroup
            heading="Suggestions"
            className="bg-background text-white"
        >
            <CommandItem
                onSelect={() => {
                    dispatch(setAuthStatus(false));
                    router.push('/login');
                }}
            >
                <PersonIcon className="mr-2 h-4 w-4" />
                Logout
            </CommandItem>
        </CommandGroup>
    );
}

export default function NavbarSearch() {
    const [isActive, setIsActive] = React.useState<boolean>(false);
    const activeSidebarPage = useAppSelector(activeSidebar);
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);

    return (
        <Command
            className=" absolute h-auto w-full "
            onBlur={(e) => {
                setTimeout(() => {
                    setIsActive(false);
                }, 200);
            }}
            onFocus={() => setIsActive(true)}
        >
            <CommandInput
                className="w-full text-xs"
                placeholder="Type a command or search..."
                autoComplete="new-password"
            />
            {isActive && (
                <CommandList className=" max-h-[50rem] bg-background ">
                    <CommandEmpty>No results found.</CommandEmpty>
                    {<SuggestionsNavSearchGroup></SuggestionsNavSearchGroup>}
                    <CommandSeparator />
                    {activeSidebarPage === ActiveSidebarPageEnum.Dashboard && (
                        <CommandGroup heading="Settings">
                            <CommandItem>
                                <PersonIcon className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                                <CommandShortcut>Ctrl + P</CommandShortcut>
                            </CommandItem>
                            <CommandItem>
                                <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
                                <span>Mail</span>
                                <CommandShortcut>Ctrl + B</CommandShortcut>
                            </CommandItem>
                            <CommandItem>
                                <GearIcon className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                                <CommandShortcut>Ctrl + S</CommandShortcut>
                            </CommandItem>

                            {/* <Settings /> */}
                        </CommandGroup>
                    )}
                    <CommandSeparator />
                    {activeSidebarPage === ActiveSidebarPageEnum.NodeGraph && (
                        <CommandGroup heading="Node Templates">
                            {nodeTemplates.map((v, index) => (
                                <NodeTemplateNavSearchItem
                                    key={v.templateId + index}
                                    index={index}
                                    template={v}
                                />
                            ))}
                        </CommandGroup>
                    )}
                    {activeSidebarPage === ActiveSidebarPageEnum.NodeGraph && (
                        <CommandGroup heading="Node options">
                            <CommandItem onSelect={() => setOpenDialog(true)}>
                                <Trash2Icon className="mr-2 h-4 w-4" />
                                <span>Clear Canvas</span>
                            </CommandItem>
                        </CommandGroup>
                    )}
                </CommandList>
            )}

            <DeleteAllNodes
                open={openDialog}
                onOpenChange={(open: boolean) => {
                    setOpenDialog(open);
                }}
            />
        </Command>
    );
}
