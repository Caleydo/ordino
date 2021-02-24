import { I18nextManager } from 'phovea_core';
import React, { useRef } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { ErrorAlertHandler, FormDialog, NotificationHandler, ProvenanceGraphMenuUtils } from 'tdp_core';
import { ListItemDropdown, SessionListItem } from '..';
import { useAsync } from '../../../hooks';
import { GraphContext } from '../../menu/StartMenuReact';
import { CommonSessionCard } from './CommonSessionCard';
export function byDateDesc(a, b) {
    return -((a.ts || 0) - (b.ts || 0));
}
export function TemporarySessionCard() {
    const parent = useRef(null);
    const stopEvent = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };
    const [tempSessions, setTempSessions] = React.useState(null);
    const { graph, manager } = React.useContext(GraphContext);
    const listSessions = React.useMemo(() => async () => {
        var _a;
        const tempSessions = (_a = (await manager.list())) === null || _a === void 0 ? void 0 : _a.filter((d) => !ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
        setTempSessions(tempSessions);
    }, []);
    const { status, error } = useAsync(listSessions);
    const deleteSession = async (event, value) => {
        stopEvent(event);
        const deleteIt = await FormDialog.areyousure(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.deleteIt', { name: value.name }));
        if (deleteIt) {
            await manager.delete(value);
            NotificationHandler.successfullyDeleted(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.session'), value.name);
            setTempSessions(tempSessions === null || tempSessions === void 0 ? void 0 : tempSessions.filter((t) => t.id !== value.id));
        }
        return false;
    };
    const saveSession = (event, value) => {
        stopEvent(event);
        ProvenanceGraphMenuUtils.persistProvenanceGraphMetaData(value).then((extras) => {
            if (extras !== null) {
                manager.importExistingGraph(value, extras, true).catch(ErrorAlertHandler.getInstance().errorAlert);
            }
        });
        return false;
    };
    const cloneSession = (event, value) => {
        stopEvent(event);
        manager.cloneLocal(value);
        return false;
    };
    // How to handle export of temorary and saved sessions
    const exportSession = (event, value) => {
        stopEvent(event);
        if (!graph) {
            return false;
        }
        console.log(graph);
        const r = graph.persist();
        console.log(r);
        const str = JSON.stringify(r, null, '\t');
        //create blob and save it
        const blob = new Blob([str], { type: 'application/json;charset=utf-8' });
        const a = new FileReader();
        a.onload = (e) => {
            const url = (e.target).result;
            const helper = parent.current.ownerDocument.createElement('a');
            helper.setAttribute('href', url);
            helper.setAttribute('target', '_blank');
            helper.setAttribute('download', `${graph.desc.name}.json`);
            parent.current.appendChild(helper);
            helper.click();
            helper.remove();
            NotificationHandler.pushNotification('success', I18nextManager.getInstance().i18n.t('tdp:core.EditProvenanceMenu.successMessage', { name: graph.desc.name }), NotificationHandler.DEFAULT_SUCCESS_AUTO_HIDE);
        };
        a.readAsDataURL(blob);
        return false;
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(CommonSessionCard, { cardName: "Temporary Sessions", faIcon: "fa-history", cardInfo: "A temporary session will only be stored in your local browser cache.It is not possible to share a link to states\n                            of this session with others. Only the 10 most recent sessions will be stored." }, tempSessions === null || tempSessions === void 0 ? void 0 : tempSessions.map((session) => {
            return React.createElement(SessionListItem, { key: session.id, status: status, value: session, error: error },
                React.createElement(Button, { variant: "outline-secondary", className: "mr-2 pt-1 pb-1", onClick: (event) => saveSession(event, session) }, "Save"),
                React.createElement(ListItemDropdown, { ref: parent },
                    React.createElement(Dropdown.Item, { onClick: (event) => cloneSession(event, session) }, "Clone"),
                    React.createElement(Dropdown.Item, { onClick: (event) => exportSession(event, session) }, "Export"),
                    React.createElement(Dropdown.Item, { className: "dropdown-delete", onClick: (event) => deleteSession(event, session) }, "Delete")));
        }))));
}
//# sourceMappingURL=TemporarySessionCard.js.map