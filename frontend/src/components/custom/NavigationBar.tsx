'use client';

import { useAppDispatch } from '@/app/hooks';
import NavbarSearch from '@/components/custom/NavbarSearch';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from '@/components/ui/menubar';
import { useUser } from '@/custom-hooks/useUser';
import { setAuthStatus } from '@/features/auth/authSlice';
import { PersonIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import LoadingSpinner from './LoadingSpinner';
import Settings from './settings/Settings';

export default function NavigationBar() {
    const dispatch = useAppDispatch();
    const { user, isLoading, isError } = useUser();

    const menuBarContentClassName = ' py-3 px-2';

    return (
        <nav className="mt-2 flex h-12  w-full items-start justify-between  ">
            <div className="relative z-20 mr-14 flex w-8/12 items-start">
                <NavbarSearch />
            </div>

            <Menubar className=" flex w-4/12   items-center  justify-end space-x-6 border-hidden ">
                <MenubarMenu>
                    <MenubarTrigger asChild>
                        <ThemeToggle />
                    </MenubarTrigger>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger className="mx-5 ">
                        <Avatar className="mr-2">
                            <AvatarImage src="/takulogo.bmp" alt="Avatar" />
                            <AvatarFallback>Profile picture</AvatarFallback>
                        </Avatar>

                        {isLoading ? <LoadingSpinner /> : user?.data.username}
                    </MenubarTrigger>
                    <MenubarContent
                        className={` ${menuBarContentClassName} px-0 py-1`}
                    >
                        <MenubarItem inset asChild>
                            <Settings />
                        </MenubarItem>

                        <MenubarSeparator />

                        <MenubarItem inset asChild>
                            <Link
                                href="/login"
                                onClick={() => dispatch(setAuthStatus(true))}
                            >
                                <PersonIcon className="mr-2 h-4 w-4" />
                                Logout
                            </Link>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </nav>
    );
}
