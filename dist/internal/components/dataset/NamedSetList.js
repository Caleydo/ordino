import { I18nextManager, UserSession, ENamedSetType, FormDialog, NotificationHandler, RestStorageUtils, StoreUtils, } from 'tdp_core';
import React from 'react';
import { ListItemDropdown } from '../../../components';
import { DatasetUtils } from './DatasetUtils';
export function NamedSetList({ headerIcon, headerText, value, status, onOpen }) {
    const testId = headerText.replace(/\s+/g, '-').toLowerCase(); // replace whtiespace by dash and make lowercase
    const [namedSets, setNamedSets] = React.useState([]);
    React.useEffect(() => {
        setNamedSets(value);
    }, [value]);
    const editNamedSet = (event, namedSet) => {
        event.preventDefault();
        StoreUtils.editDialog(namedSet, I18nextManager.getInstance().i18n.t(`tdp:core.editDialog.listOfEntities.default`), async (name, description, sec) => {
            const params = { name, description, ...sec };
            const editedSet = await RestStorageUtils.editNamedSet(namedSet.id, params);
            NotificationHandler.successfullySaved(I18nextManager.getInstance().i18n.t('tdp:core.NamedSetList.namedSet'), name);
            setNamedSets((sets) => sets.splice(sets.indexOf(namedSet), 1, editedSet));
        });
    };
    const deleteNamedSet = async (event, namedSet) => {
        event.preventDefault();
        const deleteIt = await FormDialog.areyousure(I18nextManager.getInstance().i18n.t('tdp:core.NamedSetList.dialogText', { name: namedSet.name }), {
            title: I18nextManager.getInstance().i18n.t('tdp:core.NamedSetList.deleteSet'),
        });
        if (deleteIt) {
            await RestStorageUtils.deleteNamedSet(namedSet.id);
            NotificationHandler.successfullyDeleted(I18nextManager.getInstance().i18n.t('tdp:core.NamedSetList.dashboard'), namedSet.name);
            setNamedSets((sets) => sets.splice(sets.indexOf(namedSet), 1));
        }
    };
    return (React.createElement("div", { className: "dataset-entry d-flex flex-column col-md-4 position-relative", "data-testid": testId },
        React.createElement("header", null,
            React.createElement("i", { className: `ms-1 me-2 ${headerIcon}` }),
            headerText),
        status === 'pending' && (React.createElement("p", { className: "p-1" },
            React.createElement("i", { className: "fas fa-circle-notch fa-spin" }),
            " ",
            I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.loadingSets'),
            ' ')),
        status === 'success' && value.length === 0 && React.createElement("p", { className: "p-1" }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.noSetsAvailable')),
        status === 'success' && value.length > 0 && (React.createElement("div", { role: "group", className: "dataset-entry-item btn-group-vertical justify-content-start position-static p-1" }, namedSets.map((namedSet, i) => {
            const canWrite = namedSet.type === ENamedSetType.NAMEDSET && UserSession.getInstance().canWrite(namedSet);
            return (
            // eslint-disable-next-line react/no-array-index-key
            React.createElement("div", { key: i, className: "dropdown-parent justify-content-between btn-group position-static" },
                React.createElement("button", { type: "button", className: "text-start ps-0 btn btn-link text-ordino-button-primary", "data-testid": `${namedSet.name.replace(/\s+/g, '-').toLowerCase()}-button`, title: DatasetUtils.toNamedSetTitle(namedSet), onClick: (event) => onOpen(event, namedSet) }, namedSet.name),
                canWrite ? (React.createElement(ListItemDropdown, null,
                    React.createElement("button", { type: "button", className: "dropdown-item", "data-testid": `${namedSet.name.replace(/\s+/g, '-').toLowerCase()}-button`, title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.editDatasetDetails'), onClick: (event) => editNamedSet(event, namedSet) }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.edit')),
                    React.createElement("button", { type: "button", className: "dropdown-item dropdown-delete", "data-testid": `${namedSet.name.replace(/\s+/g, '-').toLowerCase()}-button`, title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.delete'), onClick: (event) => deleteNamedSet(event, namedSet) }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.delete')))) : null));
        }))),
        status === 'error' && React.createElement("p", null,
            " ",
            I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.loadingError'))));
}
//# sourceMappingURL=NamedSetList.js.map