// Gets into the phovea.ts
import * as React from 'react';
import Select from 'react-select';
export function CosmicView({ desc, data, dataDesc, selection, filters, parameters = { currentSelection: '' }, onSelectionChanged, onFiltersChanged, onParametersChanged }) {
    return React.createElement("iframe", { className: 'w-100 h-100', src: "https://cancer.sanger.ac.uk/cosmic" });
}
export function CosmicViewHeader({ desc, data, dataDesc, selection, filters, parameters = {
    currentSelection: ''
}, onSelectionChanged, onFiltersChanged, onParametersChanged }) {
    const options = selection.map((s) => {
        return { value: s, label: s };
    });
    return React.createElement(Select, { options: options });
}
//# sourceMappingURL=CosmicProxyView.js.map