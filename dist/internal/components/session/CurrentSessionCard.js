import { I18nextManager } from 'phovea_core';
import React from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { ProvenanceGraphMenuUtils } from 'tdp_core';
import { AppContext } from '../../menu/StartMenuReact';
import { ListItemDropdown } from '../common';
import { CommonSessionCard } from './CommonSessionCard';
import { SessionListItem } from './SessionListItem';
export default function CurrentSessionCard({ name, faIcon, cssClass }) {
    const { app } = React.useContext(AppContext);
    const desc = app.graph.desc;
    return (React.createElement(CommonSessionCard, { cardName: name, faIcon: faIcon, cardInfo: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.currentCardInfo') }, (sessionAction) => {
        return React.createElement(SessionListItem, { desc: desc, selectSession: (event) => sessionAction("select" /* SELECT */, event, desc) },
            React.createElement(Button, { variant: "outline-secondary", disabled: ProvenanceGraphMenuUtils.isPersistent(desc), className: "mr-2 pt-1 pb-1", onClick: (event) => sessionAction("save" /* SAVE */, event, desc) }, "Save"),
            React.createElement(ListItemDropdown, null,
                React.createElement(Dropdown.Item, { onClick: (event) => sessionAction("clone" /* CLONE */, event, desc) }, "Clone"),
                React.createElement(Dropdown.Item, { onClick: (event) => sessionAction("epxport" /* EXPORT */, event, desc) }, "Export"),
                React.createElement(Dropdown.Item, { className: "dropdown-delete", onClick: (event) => sessionAction("delete" /* DELETE */, event, desc) }, "Delete")));
    }));
}
//# sourceMappingURL=CurrentSessionCard.js.map