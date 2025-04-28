'use client';

import {
    ColumnDef,
    ColumnResizeMode,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import React from 'react';

import CardWrapper from './CardWrapper';

type Person = {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    status: string;
    progress: number;
};

const defaultData: Person[] = [
    {
        firstName: 'tanner',
        lastName: 'linsley',
        age: 24,
        visits: 100,
        status: 'In Relationship',
        progress: 50,
    },
    {
        firstName: 'tandy',
        lastName: 'miller',
        age: 40,
        visits: 40,
        status: 'Single',
        progress: 80,
    },

    {
        firstName: 'joe',
        lastName: 'dirte',
        age: 45,
        visits: 20,
        status: 'Complicated',
        progress: 10,
    },
    {
        firstName: 'tanner',
        lastName: 'linsley',
        age: 24,
        visits: 100,
        status: 'In Relationship',
        progress: 50,
    },

    {
        firstName: 'joe',
        lastName: 'dirte',
        age: 45,
        visits: 20,
        status: 'Complicated',
        progress: 10,
    },
    {
        firstName: 'tanner',
        lastName: 'linsley',
        age: 24,
        visits: 100,
        status: 'In Relationship',
        progress: 50,
    },
    {
        firstName: 'sarah',
        lastName: 'martin',
        age: 30,
        visits: 40,
        status: 'Single',
        progress: 75,
    },
    {
        firstName: 'mike',
        lastName: 'jones',
        age: 52,
        visits: 15,
        status: 'Married',
        progress: 20,
    },
    {
        firstName: 'lucy',
        lastName: 'smith',
        age: 28,
        visits: 30,
        status: 'Engaged',
        progress: 60,
    },
    {
        firstName: 'chris',
        lastName: 'johnson',
        age: 33,
        visits: 50,
        status: 'Single',
        progress: 80,
    },
    {
        firstName: 'angela',
        lastName: 'white',
        age: 27,
        visits: 25,
        status: 'Complicated',
        progress: 30,
    },
    {
        firstName: 'robert',
        lastName: 'brown',
        age: 44,
        visits: 60,
        status: 'Married',
        progress: 90,
    },
    {
        firstName: 'emily',
        lastName: 'davis',
        age: 35,
        visits: 70,
        status: 'In Relationship',
        progress: 40,
    },
    {
        firstName: 'daniel',
        lastName: 'miller',
        age: 21,
        visits: 10,
        status: 'Single',
        progress: 50,
    },
    {
        firstName: 'jessica',
        lastName: 'wilson',
        age: 29,
        visits: 20,
        status: 'Engaged',
        progress: 100,
    },
    {
        firstName: 'thomas',
        lastName: 'moore',
        age: 36,
        visits: 85,
        status: 'Married',
        progress: 65,
    },
    {
        firstName: 'laura',
        lastName: 'taylor',
        age: 40,
        visits: 75,
        status: 'In Relationship',
        progress: 55,
    },
    {
        firstName: 'ryan',
        lastName: 'anderson',
        age: 22,
        visits: 45,
        status: 'Single',
        progress: 35,
    },
    {
        firstName: 'sophia',
        lastName: 'thomas',
        age: 26,
        visits: 55,
        status: 'Complicated',
        progress: 45,
    },
    {
        firstName: 'ethan',
        lastName: 'jackson',
        age: 48,
        visits: 65,
        status: 'Married',
        progress: 85,
    },
    {
        firstName: 'olivia',
        lastName: 'white',
        age: 31,
        visits: 35,
        status: 'Engaged',
        progress: 25,
    },
    {
        firstName: 'noah',
        lastName: 'harris',
        age: 37,
        visits: 90,
        status: 'In Relationship',
        progress: 70,
    },
    {
        firstName: 'mia',
        lastName: 'martin',
        age: 34,
        visits: 80,
        status: 'Single',
        progress: 20,
    },
    {
        firstName: 'jacob',
        lastName: 'lee',
        age: 19,
        visits: 5,
        status: 'Complicated',
        progress: 10,
    },
    {
        firstName: 'isabella',
        lastName: 'young',
        age: 25,
        visits: 60,
        status: 'Married',
        progress: 30,
    },
    {
        firstName: 'mason',
        lastName: 'hernandez',
        age: 38,
        visits: 95,
        status: 'In Relationship',
        progress: 95,
    },
    {
        firstName: 'emma',
        lastName: 'king',
        age: 42,
        visits: 10,
        status: 'Single',
        progress: 5,
    },
    {
        firstName: 'logan',
        lastName: 'wright',
        age: 29,
        visits: 110,
        status: 'Engaged',
        progress: 75,
    },
    {
        firstName: 'avery',
        lastName: 'lopez',
        age: 32,
        visits: 120,
        status: 'Married',
        progress: 60,
    },
    {
        firstName: 'james',
        lastName: 'hill',
        age: 46,
        visits: 30,
        status: 'Complicated',
        progress: 40,
    },
    {
        firstName: 'charlotte',
        lastName: 'scott',
        age: 23,
        visits: 40,
        status: 'Single',
        progress: 70,
    },
    {
        firstName: 'benjamin',
        lastName: 'green',
        age: 39,
        visits: 50,
        status: 'In Relationship',
        progress: 85,
    },
    {
        firstName: 'harper',
        lastName: 'adams',
        age: 41,
        visits: 65,
        status: 'Engaged',
        progress: 95,
    },
    {
        firstName: 'lucas',
        lastName: 'nelson',
        age: 20,
        visits: 15,
        status: 'Single',
        progress: 10,
    },
];

const defaultColumns: ColumnDef<Person>[] = [
    {
        id: 'firstName',
        accessorKey: 'firstName',
        header: () => <span>firstName</span>,
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
    },
    {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
    },

    {
        id: 'age',
        accessorKey: 'age',
        header: () => <span>Age</span>,
        footer: (props) => props.column.id,
    },
    {
        id: 'visits',
        accessorKey: 'visits',
        header: () => <span>Visits</span>,
        footer: (props) => props.column.id,
    },
    {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        footer: (props) => props.column.id,
    },
    {
        id: 'progress',
        accessorKey: 'progress',
        header: 'Profile Progress',
        footer: (props) => props.column.id,
    },
];
export function SimpleTableComponent() {
    const [data, setData] = React.useState(() => [...defaultData]);
    const [columns] = React.useState<typeof defaultColumns>(() => [
        ...defaultColumns,
    ]);

    const [columnResizeMode, setColumnResizeMode] =
        React.useState<ColumnResizeMode>('onChange');

    const rerender = React.useReducer(() => ({}), {})[1];

    const table = useReactTable({
        data,
        columns,
        columnResizeMode,
        getCoreRowModel: getCoreRowModel(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
    });

    return (
        <>
            <div className="overflow-x-auto ">
                <table
                    className=" border-separate border-spacing-y-1  overflow-x-auto"
                    {...{
                        style: {
                            width: table.getCenterTotalSize(),
                        },
                    }}
                >
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-3 py-1 text-start text-sm  font-normal capitalize opacity-40"
                                        {...{
                                            colSpan: header.colSpan,
                                            style: {
                                                width: header.getSize(),
                                            },
                                        }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                        <div
                                            {...{
                                                onMouseDown:
                                                    header.getResizeHandler(),
                                                onTouchStart:
                                                    header.getResizeHandler(),
                                                className: `resizer ${
                                                    header.column.getIsResizing()
                                                        ? 'isResizing'
                                                        : ''
                                                }`,
                                                style: {
                                                    transform:
                                                        columnResizeMode ===
                                                            'onEnd' &&
                                                        header.column.getIsResizing()
                                                            ? `translateX(${
                                                                  table.getState()
                                                                      .columnSizingInfo
                                                                      .deltaOffset
                                                              }px)`
                                                            : '',
                                                },
                                            }}
                                        />
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="  ">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="bg-foreground px-3  py-2  text-start "
                                        {...{
                                            style: {
                                                width: cell.column.getSize(),
                                            },
                                        }}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default function SimpleTableCard(props: { title: string }) {
    return (
        <CardWrapper title={props.title} className="w-full overflow-x-auto">
            <SimpleTableComponent />
        </CardWrapper>
    );
}
