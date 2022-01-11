/*
 * Created by Stefan Luger on 06.12.17
 */
import { ResolveUtils } from 'tdp_core';
import { ProxyView } from 'tdp_core';
/**
 * Proxy view for the idType Cosmic which fetches the original cell line data based on the mapping from Cell line to
 * Cosmic.
 */
export class CosmicProxyView extends ProxyView {
    async getSelectionSelectData(names) {
        const cosmics = await ResolveUtils.resolveIds(this.selection.idtype, this.selection.range, 'Cosmic');
        console.log(this.selection.idtype, this.selection.range, cosmics);
        return Promise.resolve(cosmics.map((cosmicId, index) => ({
            value: cosmicId,
            name: `${names[index]} (${cosmicId || 'N/A'})`,
            data: cosmicId,
        })));
    }
    /**
     * Specific error message to display.
     * @param {string} selectedItemId The mapped cosmic id for the selected cell line.
     */
    showErrorMessage(selectedItemId) {
        super.showErrorMessage(selectedItemId);
        this.$node.html(`<p>This cell line is not available in the COSMIC database.</p>`);
    }
}
//# sourceMappingURL=CosmicProxyView.js.map