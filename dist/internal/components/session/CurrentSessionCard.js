import { I18nextManager } from 'phovea_core';
import React, { useRef } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { ProvenanceGraphMenuUtils } from 'tdp_core';
import { byDateDesc, ListItemDropdown, SessionListItem, } from '..';
import { useAsync } from '../../../hooks';
import { GraphContext } from '../../menu/StartMenuReact';
import { CommonSessionCard } from './CommonSessionCard';
export function CurrentSessionCard() {
    const parent = useRef(null);
    const [currentSession, setCurrentSession] = React.useState(null);
    const { graph, manager } = React.useContext(GraphContext);
    const listSessions = React.useMemo(() => async () => {
        var _a;
        const tempSessions = (_a = (await manager.list())) === null || _a === void 0 ? void 0 : _a.filter((d) => !ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
        setCurrentSession(tempSessions === null || tempSessions === void 0 ? void 0 : tempSessions[0]);
    }, []);
    const { status, error } = useAsync(listSessions);
    return (React.createElement(CommonSessionCard, { cardName: "Current Session", faIcon: "fa-history", cardInfo: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.currentCardInfo') }, (exportSession, cloneSession, saveSession, deleteSession) => {
        return React.createElement(SessionListItem, { status: status, desc: currentSession, error: error },
            React.createElement(Button, { variant: "outline-secondary", className: "mr-2 pt-1 pb-1", onClick: (event) => saveSession(event, currentSession) }, "Save"),
            React.createElement(ListItemDropdown, { ref: parent },
                React.createElement(Dropdown.Item, { onClick: (event) => cloneSession(event, currentSession) }, "Clone"),
                React.createElement(Dropdown.Item, { onClick: (event) => exportSession(event, currentSession) }, "Export"),
                React.createElement(Dropdown.Item, { className: "dropdown-delete", onClick: (event) => deleteSession(event, currentSession) }, "Delete")));
    }));
}
//# sourceMappingURL=CurrentSessionCard.js.map