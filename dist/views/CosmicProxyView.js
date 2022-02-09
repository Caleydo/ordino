// Gets into the phovea.ts
import * as React from 'react';
import { useEffect } from 'react';
import Select from 'react-select';
export function CosmicView({ desc, data, dataDesc, selection, idFilter, parameters, onSelectionChanged, onIdFilterChanged, onParametersChanged }) {
    useEffect(() => {
        if (!parameters) {
            onParametersChanged({ currentId: '' });
        }
    }, []);
    console.log(parameters);
    return React.createElement("iframe", { className: 'w-100 h-100', src: "https://cancer.sanger.ac.uk/cosmic" });
}
//Toolbar ?
export function CosmicViewHeader({ desc, data, dataDesc, selection, idFilter, parameters, onSelectionChanged, onIdFilterChanged, onParametersChanged }) {
    const options = selection.map((s) => {
        return { value: s, label: s };
    });
    return React.createElement("div", { style: { width: '200px' } },
        React.createElement(Select, { options: options, onChange: (e) => {
                onParametersChanged({ currentId: e.value });
            } }));
}
//# sourceMappingURL=CosmicProxyView.js.map