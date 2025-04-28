'use client';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { ActiveSidebarPageEnum } from '@/components/enums/Enums';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { activeSidebar } from '@/features/activeSidebar/activeSidebar';
import { onSidebarNavigate } from '@/features/activeSidebar/activeSidebar';
import {
    BarChartIcon,
    CalendarIcon,
    EnvelopeClosedIcon,
    FaceIcon,
    GearIcon,
    HomeIcon,
    PersonIcon,
    RocketIcon,
    TableIcon,
} from '@radix-ui/react-icons';
import { Text } from '@radix-ui/themes';
import { redirect, useRouter } from 'next/navigation';
import React, { use, useEffect } from 'react';

import { Button } from '../ui/button';

type sideBarItem = {
    title: string;
    type: ActiveSidebarPageEnum;

    text?: number;
    icon?: React.ReactNode;
};

function ListItem(props: { item: sideBarItem; isActive: boolean }) {
    let badgeComponent = <div className="ml-auto"></div>;
    const dispatch = useAppDispatch();
    const { isActive } = props;

    const item = props.item;

    if (item.text) {
        badgeComponent = (
            <Badge
                className=" border-none text-accent "
                variant="outline"
                style={{}}
            >
                {item.text.toString()}
            </Badge>
        );
    }

    const activeStyle = {
        li: 'bg-foreground border-r-4 border-primary  hover:text-primary ',
        span: 'text-primary ',
    };

    return (
        <li
            className={` mx-5 flex rounded-xl py-1 ${
                !isActive && 'border-none'
            }  w-full justify-start hover:bg-foreground active:text-primary ${
                isActive && activeStyle.li
            } `}
            onClick={() => dispatch(onSidebarNavigate(item.type))}
        >
            <Button
                variant={'ghost'}
                className={`flex w-full justify-between hover:bg-transparent ${
                    isActive && activeStyle.span
                } `}
            >
                <div className="flex items-center">
                    {item.icon}
                    <span className="mx-4 text-sm ">{item.title}</span>
                </div>
                {badgeComponent}
            </Button>
        </li>
    );
}

export default function SideBar() {
    const activeSidebarPage = useAppSelector(activeSidebar);
    const router = useRouter();
    const sideBarItems: sideBarItem[] = [
        {
            title: 'Dashboard',
            type: ActiveSidebarPageEnum.Dashboard,
            icon: <HomeIcon />,
        },
        {
            title: 'LLM Nodes',
            type: ActiveSidebarPageEnum.NodeGraph,
            icon: <GearIcon />,
        },
        {
            title: 'Table',
            // text: 120,
            type: ActiveSidebarPageEnum.Table,
            icon: <TableIcon />,
        },
        // {
        //     title: 'Analytics',
        //     text: 20,
        //     type: ActiveSidebarPageEnum.Analytics,
        //     icon: <BarChartIcon />,
        // },
    ];

    useEffect(() => {
        console.log('activeSidebarPage', activeSidebarPage);
        router.push(`/admin/${activeSidebarPage}`);
    }, [activeSidebarPage, router]);

    return (
        <div className="w-72 flex-col items-center gap-x-10" onClick={() => {}}>
            <div className="mb-5 ml-4 flex w-full items-center justify-around gap-x-4 px-3 py-1">
                <Icons.appLogo className=" mr-4 h-full " />

                <Text className="w-full text-lg font-bold">
                    {'Data Studio'}
                </Text>
            </div>

            <ul className=" w-full space-y-2  ">
                {sideBarItems.map((v) => (
                    <ListItem
                        isActive={v.type === activeSidebarPage}
                        key={v.title}
                        item={v}
                    />
                ))}
            </ul>
        </div>
    );
}
