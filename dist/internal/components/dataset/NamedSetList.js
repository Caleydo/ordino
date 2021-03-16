import React from 'react';
import { Button, ButtonGroup, Col, Dropdown } from 'react-bootstrap';
import { ENamedSetType, FormDialog, NotificationHandler, RestStorageUtils, StoreUtils } from 'tdp_core';
import { SESSION_KEY_NEW_ENTRY_POINT } from '../..';
import { ListItemDropdown } from '../common';
import { GraphContext } from '../../OrdinoAppComponent';
import { I18nextManager, UserSession } from 'phovea_core';
export function NamedSetList({ headerIcon, headerText, value, startViewId, status }) {
    const { manager } = React.useContext(GraphContext);
    const [namedSets, setNamedSets] = React.useState(null);
    React.useEffect(() => {
        setNamedSets(value);
    });
    // TODO: refactor init session handling
    const startAnalyis = (event, namedSet) => {
        event.preventDefault();
        const defaultSessionValues = {
            ['species']: 'human' // TODO: refactor to get the value as props
        };
        UserSession.getInstance().store(SESSION_KEY_NEW_ENTRY_POINT, {
            view: startViewId,
            options: { namedSet },
            defaultSessionValues
        });
        manager.newGraph();
    };
    const editNamedSet = (event, namedSet) => {
        event.preventDefault();
        StoreUtils.editDialog(namedSet, I18nextManager.getInstance().i18n.t(`tdp:core.editDialog.listOfEntities.default`), async (name, description, sec) => {
            const params = Object.assign({
                name,
                description
            }, sec);
            const editedSet = await RestStorageUtils.editNamedSet(namedSet.id, params);
            // TODO: is the notification necessary?
            NotificationHandler.successfullySaved(I18nextManager.getInstance().i18n.t('tdp:core.NamedSetList.namedSet'), name);
            setNamedSets((namedSets) => namedSets.splice(namedSets.indexOf(namedSet), 1, editedSet));
        });
    };
    const deleteNamedSet = async (event, namedSet) => {
        event.preventDefault();
        const deleteIt = await FormDialog.areyousure(I18nextManager.getInstance().i18n.t('tdp:core.NamedSetList.dialogText', { name: namedSet.name }), { title: I18nextManager.getInstance().i18n.t('tdp:core.NamedSetList.deleteSet') });
        if (deleteIt) {
            await RestStorageUtils.deleteNamedSet(namedSet.id);
            NotificationHandler.successfullyDeleted(I18nextManager.getInstance().i18n.t('tdp:core.NamedSetList.dashboard'), namedSet.name);
            setNamedSets((namedSets) => namedSets.splice(namedSets.indexOf(namedSet), 1));
        }
    };
    return (React.createElement(Col, { md: 4, className: "dataset-entry d-flex flex-column" },
        React.createElement("header", null,
            React.createElement("i", { className: `mr-2 ${headerIcon}` }),
            headerText),
        status === 'pending' &&
            React.createElement("p", null,
                React.createElement("i", { className: "fas fa-circle-notch fa-spin" }),
                " Loading sets..."),
        status === 'success' &&
            namedSets.length === 0 &&
            React.createElement("p", null, "No sets available"),
        status === 'success' &&
            namedSets.length > 0 &&
            React.createElement(ButtonGroup, { vertical: true }, namedSets.map((namedSet, i) => {
                const canWrite = namedSet.type === ENamedSetType.NAMEDSET && UserSession.getInstance().canWrite(namedSet);
                return (React.createElement(ButtonGroup, { key: i, className: "dropdown-parent justify-content-between" },
                    React.createElement(Button, { className: "text-left pl-0", style: { color: '#337AB7' }, variant: "link", onClick: (event) => startAnalyis(event, namedSet) }, namedSet.name),
                    canWrite ?
                        React.createElement(ListItemDropdown, null,
                            React.createElement(Dropdown.Item, { onClick: (event) => editNamedSet(event, namedSet) }, "Edit"),
                            React.createElement(Dropdown.Item, { className: "dropdown-delete", onClick: (event) => deleteNamedSet(event, namedSet) }, "Delete")) : null));
            })),
        status === 'error' && React.createElement("p", null, "Error when loading sets")));
}
//# sourceMappingURL=NamedSetList.js.map