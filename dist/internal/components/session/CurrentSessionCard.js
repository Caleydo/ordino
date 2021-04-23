import { I18nextManager } from 'phovea_core';
import React from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { ProvenanceGraphMenuUtils } from 'tdp_core';
import { GraphContext, HighlightSessionCardContext } from '../../OrdinoApp';
import { ListItemDropdown } from '../../../components';
import { CommonSessionCard } from './CommonSessionCard';
import { SessionListItem } from './SessionListItem';
export default function CurrentSessionCard({ name, faIcon }) {
    const { graph } = React.useContext(GraphContext);
    const { highlight } = React.useContext(HighlightSessionCardContext);
    const desc = graph.desc;
    return (React.createElement(CommonSessionCard, { cardName: name, highlight: highlight, faIcon: faIcon, cardInfo: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.currentCardInfo') }, (sessionAction) => {
        return React.createElement(SessionListItem, { desc: desc, selectSession: (event) => sessionAction("select" /* SELECT */, event, desc) },
            React.createElement(Button, { variant: "outline-secondary", disabled: ProvenanceGraphMenuUtils.isPersistent(desc), className: "mr-2 pt-1 pb-1", onClick: (event) => sessionAction("save" /* SAVE */, event, desc) }, "Save"),
            React.createElement(ListItemDropdown, null,
                React.createElement(Dropdown.Item, { onClick: (event) => sessionAction("clone" /* CLONE */, event, desc) }, "Clone"),
                React.createElement(Dropdown.Item, { onClick: (event) => sessionAction("epxport" /* EXPORT */, event, desc) }, "Export"),
                React.createElement(Dropdown.Item, { className: "dropdown-delete", onClick: (event) => sessionAction("delete" /* DELETE */, event, desc) }, "Delete")));
    }));
}
//# sourceMappingURL=CurrentSessionCard.js.map