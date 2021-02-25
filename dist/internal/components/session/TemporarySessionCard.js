import { I18nextManager } from 'phovea_core';
import React, { useRef } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { ProvenanceGraphMenuUtils } from 'tdp_core';
import { ListItemDropdown, SessionListItem } from '..';
import { useAsync } from '../../../hooks';
import { GraphContext } from '../../menu/StartMenuReact';
import { CommonSessionCard } from './CommonSessionCard';
export function byDateDesc(a, b) {
    return -((a.ts || 0) - (b.ts || 0));
}
export function TemporarySessionCard() {
    const parent = useRef(null);
    const [tempSessions, setTempSessions] = React.useState(null);
    const { graph, manager } = React.useContext(GraphContext);
    const listSessions = React.useMemo(() => async () => {
        var _a;
        const tempSessions = (_a = (await manager.list())) === null || _a === void 0 ? void 0 : _a.filter((d) => !ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
        setTempSessions(tempSessions);
    }, []);
    const { status, error } = useAsync(listSessions);
    return (React.createElement(React.Fragment, null,
        React.createElement(CommonSessionCard, { cardName: "Temporary Sessions", faIcon: "fa-history", cardInfo: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.tempCardInfo') }, (exportSession, cloneSession, saveSession, deleteSession) => {
            return React.createElement(React.Fragment, null,
                " ", tempSessions === null || tempSessions === void 0 ? void 0 :
                tempSessions.map((session) => {
                    return React.createElement(SessionListItem, { key: session.id, status: status, desc: session, error: error },
                        React.createElement(Button, { variant: "outline-secondary", className: "mr-2 pt-1 pb-1", onClick: (event) => saveSession(event, session) }, "Save"),
                        React.createElement(ListItemDropdown, { ref: parent },
                            React.createElement(Dropdown.Item, { onClick: (event) => cloneSession(event, session) }, "Clone"),
                            React.createElement(Dropdown.Item, { onClick: (event) => exportSession(event, session) }, "Export"),
                            React.createElement(Dropdown.Item, { className: "dropdown-delete", onClick: (event) => deleteSession(event, session, setTempSessions) }, "Delete")));
                }));
        })));
}
//# sourceMappingURL=TemporarySessionCard.js.map