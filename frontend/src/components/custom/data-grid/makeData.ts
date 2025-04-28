// import { faker } from '@faker-js/faker';

export type Person = {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    progress: number;
    status: 'relationship' | 'complicated' | 'single';
    subRows?: Person[];
};

const peopleDetails: Person[] = [
    {
        firstName: 'Jim',
        lastName: 'Roe',
        age: 25,
        visits: 457,
        progress: 23,
        status: 'relationship',
    },
    {
        firstName: 'Alice',
        lastName: 'Smith',
        age: 31,
        visits: 103,
        progress: 78,
        status: 'single',
    },
    {
        firstName: 'Bob',
        lastName: 'White',
        age: 22,
        visits: 674,
        progress: 45,
        status: 'complicated',
    },
    {
        firstName: 'Diane',
        lastName: 'Brown',
        age: 36,
        visits: 345,
        progress: 90,
        status: 'relationship',
    },
    {
        firstName: 'Chris',
        lastName: 'Davis',
        age: 29,
        visits: 112,
        progress: 37,
        status: 'single',
    },
    {
        firstName: 'Elaine',
        lastName: 'Miller',
        age: 42,
        visits: 988,
        progress: 65,
        status: 'relationship',
    },
    {
        firstName: 'Frank',
        lastName: 'Wilson',
        age: 19,
        visits: 204,
        progress: 12,
        status: 'complicated',
    },
    {
        firstName: 'Gina',
        lastName: 'Moore',
        age: 24,
        visits: 431,
        progress: 85,
        status: 'single',
    },
    {
        firstName: 'Harry',
        lastName: 'Taylor',
        age: 38,
        visits: 299,
        progress: 23,
        status: 'relationship',
    },
    {
        firstName: 'Irene',
        lastName: 'Anderson',
        age: 34,
        visits: 763,
        progress: 57,
        status: 'complicated',
    },
    {
        firstName: 'Jack',
        lastName: 'Thomas',
        age: 21,
        visits: 500,
        progress: 49,
        status: 'single',
    },
    {
        firstName: 'Kara',
        lastName: 'Jackson',
        age: 45,
        visits: 320,
        progress: 78,
        status: 'relationship',
    },
];

function getRandomPerson(): Person {
    const randomIndex = Math.floor(Math.random() * peopleDetails.length);
    return peopleDetails[randomIndex];
}

export function makeData(count: number): Person[] {
    return Array.from({ length: count }, () => getRandomPerson());
}
