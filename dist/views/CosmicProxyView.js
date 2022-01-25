// Gets into the phovea.ts
import * as React from 'react';
export function CosmicView({ desc, data, dataDesc, selection, filters, parameters = {
    currentVisType: 'scatterplot'
}, onSelectionChanged, onFiltersChanged, onParametersChanged }) {
    return React.createElement("iframe", { className: 'w-100 h-100', src: "https://cancer.sanger.ac.uk/cosmic" });
}
//# sourceMappingURL=CosmicProxyView.js.map