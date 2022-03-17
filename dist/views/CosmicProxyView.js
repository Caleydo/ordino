// Gets into the phovea.ts
import * as React from 'react';
import { useEffect } from 'react';
import Select from 'react-select';
export function CosmicView({ parameters, onParametersChanged }) {
    useEffect(() => {
        if (!parameters) {
            onParametersChanged({ currentId: '' });
        }
    });
    console.log(parameters);
    return React.createElement("iframe", { className: "w-100 h-100", src: "https://cancer.sanger.ac.uk/cosmic" });
}
// Toolbar ?
export function CosmicViewHeader({ selection, onParametersChanged }) {
    const options = selection.map((s) => {
        return { value: s, label: s };
    });
    return (React.createElement("div", { style: { width: '200px' } },
        React.createElement(Select, { options: options, onChange: (e) => {
                onParametersChanged({ currentId: e.value });
            } })));
}
export const cosmicConfiguration = () => {
    return {
        viewType: 'simple',
        view: CosmicView,
        tab: null,
        header: CosmicViewHeader,
    };
};
//# sourceMappingURL=CosmicProxyView.js.map