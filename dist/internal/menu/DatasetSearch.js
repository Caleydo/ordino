import React from 'react';
import Select from 'react-select';
const DatasetSearchBox = () => {
    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ];
    return (React.createElement(Select, { isMulti: true, options: options }));
};
//# sourceMappingURL=DatasetSearch.js.map