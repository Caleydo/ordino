// Gets into the phovea.ts
import * as React from 'react';
import { useEffect } from 'react';
import Select from 'react-select';
import { useAsync } from 'tdp_core';
import { ReprovisynRestUtils } from 'reprovisyn';
export function CosmicView({ parameters, onParametersChanged }) {
    useEffect(() => {
        if (!parameters) {
            onParametersChanged({ currentId: null });
        }
    }, [parameters, onParametersChanged]);
    const { status, value } = useAsync(ReprovisynRestUtils.getEntityMappingsFromTo, ['Cellline', 'Cosmic', parameters.currentId ? [parameters.currentId] : null]);
    return parameters.currentId && status === 'success' ? (React.createElement("iframe", { className: "w-100 h-100", src: `https://cancer.sanger.ac.uk/cell_lines/sample/overview?id=${value[0]}&genome=38` })) : (React.createElement("div", null, "Make a Selection"));
}
// Toolbar ?
export function CosmicViewHeader({ selection, parameters, onParametersChanged }) {
    const options = selection.map((s) => {
        return { value: s, label: s };
    });
    useEffect(() => {
        if (parameters.currentId && selection.length === 0) {
            onParametersChanged({ currentId: null });
        }
        else if (selection.length > 0 && !selection.includes(parameters.currentId)) {
            onParametersChanged({ currentId: selection[0] });
        }
    }, [selection, parameters.currentId, onParametersChanged]);
    return (React.createElement("div", { className: "d-flex align-items-center", style: { width: '200px' } },
        React.createElement("div", { className: "flex-grow-1" },
            React.createElement(Select, { options: options, onChange: (e) => {
                    onParametersChanged({ currentId: e.value });
                }, value: { value: parameters.currentId, label: parameters.currentId } }))));
}
export const cosmicConfiguration = () => {
    return {
        viewType: 'simple',
        defaultParameters: {
            currentId: null,
        },
        view: CosmicView,
        tab: null,
        header: CosmicViewHeader,
    };
};
//# sourceMappingURL=CosmicProxyView.js.map