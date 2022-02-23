import React from 'react';
import LineUpLite, { asTextColumn, asNumberColumn, asCategoricalColumn, asDateColumn, featureDefault } from '@lineup-lite/table';
import '@lineup-lite/table/dist/table.css';
export function Lineup() {
    const data = React.useMemo(() => [
        {
            name: 'Panchito Green',
            age: 10,
            shirtSize: 'S',
            birthday: new Date(2011, 1, 1),
            name2: 'Panchito Green',
            age2: 10,
            shirtSize2: 'S',
            birthday2: new Date(2011, 1, 1),
        },
        {
            name: 'Rubia Robker',
            age: 25,
            shirtSize: 'M',
            birthday: new Date(1996, 4, 13),
            name2: 'Rubia Robker',
            age2: 25,
            shirtSize2: 'M',
            birthday2: new Date(1996, 4, 13),
        },
        {
            name: 'Micheil Sappell',
            age: 50,
            shirtSize: 'L',
            birthday: new Date(1971, 8, 23),
            name2: 'Micheil Sappell',
            age2: 50,
            shirtSize2: 'L',
            birthday2: new Date(1971, 8, 23),
        },
        {
            name: 'Geoffrey Sprason',
            age: 30,
            shirtSize: 'M',
            birthday: new Date(1991, 11, 5),
            name2: 'Geoffrey Sprason',
            age2: 30,
            shirtSize2: 'M',
            birthday2: new Date(1991, 11, 5),
        },
        {
            name: 'Grissel Rounsefull',
            age: 21,
            shirtSize: 'S',
            birthday: new Date(2000, 6, 30),
            name2: 'Grissel Rounsefull',
            age2: 21,
            shirtSize2: 'S',
            birthday2: new Date(2000, 6, 30),
        },
    ], []);
    const repeatedData = React.useMemo(() => Array(100)
        .fill(0)
        .map((_, i) => data[i % data.length]), [data]);
    const columns = React.useMemo(() => [
        asTextColumn('name'),
        asNumberColumn('age'),
        asCategoricalColumn('shirtSize'),
        asDateColumn('birthday'),
        asTextColumn('name2'),
        asNumberColumn('age2'),
        asCategoricalColumn('shirtSize2'),
        asDateColumn('birthday2'),
    ], []);
    const features = React.useMemo(() => featureDefault(), []);
    return React.createElement(LineUpLite, { data: repeatedData, columns: columns, features: features });
}
//# sourceMappingURL=plotly.js.map