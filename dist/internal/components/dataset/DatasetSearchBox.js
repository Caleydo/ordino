import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { RestBaseUtils, RestStorageUtils, StoreUtils } from 'tdp_core';
import { Species, SpeciesUtils } from 'tdp_gene';
import { AsyncPaginate } from 'react-select-async-paginate';
import Highlighter from 'react-highlight-words';
import { I18nextManager, IDTypeManager, UserSession } from 'phovea_core';
import { GraphContext } from '../../menu/StartMenuReact';
import { SESSION_KEY_NEW_ENTRY_POINT } from '../..';
export function DatasetSearchBox({ placeholder, dbViewSuffix, idType: idtype, db, base, entityName }) {
    const [items, setItems] = React.useState(null);
    const { graph, manager, app } = React.useContext(GraphContext);
    const search = (query) => {
        return RestBaseUtils.getTDPLookup(db, base + dbViewSuffix, {
            column: entityName,
            species: SpeciesUtils.getSelectedSpecies(),
            query
        });
    };
    const loadOptions = async (inputValue, _, { page }) => {
        const options = await search(inputValue);
        return {
            options: options.items,
            hasMore: options.more,
            additional: {
                page: page + 1,
            },
        };
    };
    function formatOptionLabel(option, ctx) {
        if (!ctx.inputValue || ctx.selectValue.some((o) => o.id === option.id)) {
            return option.text;
        }
        return (React.createElement(Highlighter, { highlightClassName: "YourHighlightClass", searchWords: [ctx.inputValue], autoEscape: true, textToHighlight: option.text }));
    }
    // Todo load view id from extension point
    const initNewSession = (event, view, options, defaultSessionValues = null) => {
        event.preventDefault();
        UserSession.getInstance().store(SESSION_KEY_NEW_ENTRY_POINT, {
            view,
            options,
            defaultSessionValues
        });
        manager.newGraph();
    };
    const saveDataset = () => {
        StoreUtils.editDialog(null, I18nextManager.getInstance().i18n.t(`tdp:core.editDialog.listOfEntities.default`), async (name, description, isPublic) => {
            const idStrings = items === null || items === void 0 ? void 0 : items.map((i) => i.id);
            const idType = IDTypeManager.getInstance().resolveIdType(idtype);
            const ids = await idType.map(idStrings);
            const response = await RestStorageUtils.saveNamedSet(name, idType, ids, {
                key: Species.SPECIES_SESSION_KEY,
                value: SpeciesUtils.getSelectedSpecies()
            }, description, isPublic);
            // this.push(response);
        });
    };
    const extra = {
        search: {
            ids: items === null || items === void 0 ? void 0 : items.map((i) => i.id),
            type: 'gene'
        }
    };
    return (React.createElement(Row, null,
        React.createElement(Col, null,
            React.createElement(AsyncPaginate, { placeholder: placeholder, noOptionsMessage: () => 'No results found', isMulti: true, loadOptions: loadOptions, onChange: setItems, defaultOptions: true, formatOptionLabel: formatOptionLabel, getOptionLabel: (option) => option.text, getOptionValue: (option) => option.id, captureMenuScroll: false, additional: {
                    page: 1
                } })),
        React.createElement(Button, { variant: "secondary", disabled: !(items === null || items === void 0 ? void 0 : items.length), className: "mr-2 pt-1 pb-1", onClick: (event) => app.initNewSession('celllinedb_start', extra) }, "Open"),
        React.createElement(Button, { variant: "outline-secondary", className: "mr-2 pt-1 pb-1", disabled: !(items === null || items === void 0 ? void 0 : items.length), onClick: saveDataset }, "Save as set")));
}
//# sourceMappingURL=DatasetSearchBox.js.map