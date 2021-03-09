import React from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import {RestBaseUtils, RestStorageUtils, StoreUtils} from 'tdp_core';
import {Species, SpeciesUtils} from 'tdp_gene';
import {FormatOptionLabelMeta} from 'react-select';
import {AsyncPaginate} from 'react-select-async-paginate';
import Highlighter from 'react-highlight-words';
import {I18nextManager, IDTypeManager, UserSession} from 'phovea_core';
import {OrdinoAppContext, SESSION_KEY_NEW_ENTRY_POINT} from '../..';
import {IDataSourceConfig} from 'tdp_publicdb';

interface IDatasetSearchBoxProps {
    placeholder: string;
    viewId: string;
    datasource: IDataSourceConfig;
}

export function DatasetSearchBox({placeholder, datasource, viewId}: IDatasetSearchBoxProps) {
    const {db, base, dbViewSuffix, entityName, idType: idtype} = datasource;
    const [items, setItems] = React.useState<IdTextPair[]>(null);
    const {app} = React.useContext(OrdinoAppContext);
    const search = (query: string): Promise<{more: boolean, items: Readonly<IdTextPair>[]}> => {
        return RestBaseUtils.getTDPLookup(db, base + dbViewSuffix, {
            column: entityName,
            species: SpeciesUtils.getSelectedSpecies(),
            query
        });
    };


    const loadOptions = async (inputValue: string, _, {page}: {page: number}) => {
        const options = await search(inputValue);
        return {
            options: options.items,
            hasMore: options.more,
            additional: {
                page: page + 1,
            },
        };
    };

    function formatOptionLabel(option: IdTextPair, ctx: FormatOptionLabelMeta<IdTextPair, true>) {
        if (!ctx.inputValue || ctx.selectValue.some((o) => o.id === option.id)) {
            return option.text;
        }
        return (
            <Highlighter
                highlightClassName="YourHighlightClass"
                searchWords={[ctx.inputValue]}
                autoEscape={true}
                textToHighlight={option.text}
            />
        );
    }

    const open = (event: React.MouseEvent<HTMLElement, MouseEvent>, view: string, options: any) => {
        event.preventDefault();
        UserSession.getInstance().store(SESSION_KEY_NEW_ENTRY_POINT, {
            view,
            options,
        });
        app.graphManager.newGraph();
    };


    // Todo push named sets
    const saveDataset = () => {
        StoreUtils.editDialog(null, I18nextManager.getInstance().i18n.t(`tdp:core.editDialog.listOfEntities.default`), async (name, description, isPublic) => {
            const idStrings = items?.map((i) => i.id);

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
            ids: items?.map((i) => i.id),
            type: 'gene'
        }
    };
    return (
        <Row>
            <Col >
                <AsyncPaginate
                    placeholder={placeholder}
                    noOptionsMessage={() => 'No results found'}
                    isMulti={true}
                    loadOptions={loadOptions}
                    onChange={setItems}
                    defaultOptions
                    formatOptionLabel={formatOptionLabel}
                    getOptionLabel={(option) => option.text}
                    getOptionValue={(option) => option.id}
                    captureMenuScroll={false}
                    additional={{
                        page: 1
                    }}
                />
            </Col>
            <Button variant="secondary" disabled={!items?.length} className="mr-2 pt-1 pb-1" onClick={(event) => open(event, viewId, extra)}>Open</Button>
            <Button variant="outline-secondary" className="mr-2 pt-1 pb-1" disabled={!items?.length} onClick={saveDataset}>Save as set</Button>
        </Row>
    );
}
