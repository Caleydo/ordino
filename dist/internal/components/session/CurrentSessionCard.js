import { I18nextManager } from 'phovea_core';
import React from 'react';
import { ProvenanceGraphMenuUtils } from 'tdp_core';
import { GraphContext, HighlightSessionCardContext } from '../../OrdinoApp';
import { ListItemDropdown } from '../../../components';
import { CommonSessionCard } from './CommonSessionCard';
import { SessionListItem } from './SessionListItem';
export default function CurrentSessionCard({ name, faIcon }) {
    const { graph } = React.useContext(GraphContext);
    const { highlight, setHighlight } = React.useContext(HighlightSessionCardContext);
    const desc = graph.desc;
    const onHighlightAnimationEnd = () => {
        setHighlight(false);
    };
    return (React.createElement(CommonSessionCard, { cardName: name, highlight: highlight, onHighlightAnimationEnd: onHighlightAnimationEnd, faIcon: faIcon, cardInfo: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.currentCardInfo') }, (sessionAction) => {
        return React.createElement(SessionListItem, { desc: desc, selectSession: (event) => sessionAction("select" /* SELECT */, event, desc) },
            React.createElement("button", { type: "button", className: "me-2 pt-1 pb-1 btn btn-outline-secondary", disabled: ProvenanceGraphMenuUtils.isPersistent(desc), onClick: (event) => sessionAction("save" /* SAVE */, event, desc) }, "Save"),
            React.createElement(ListItemDropdown, null,
                React.createElement("button", { className: "dropdown-item", onClick: (event) => sessionAction("clone" /* CLONE */, event, desc) }, "Clone"),
                React.createElement("button", { className: "dropdown-item", onClick: (event) => sessionAction("epxport" /* EXPORT */, event, desc) }, "Export"),
                React.createElement("button", { className: "dropdown-delete dropdown-item", onClick: (event) => sessionAction("delete" /* DELETE */, event, desc) }, "Delete")));
    }));
}
//# sourceMappingURL=CurrentSessionCard.js.map