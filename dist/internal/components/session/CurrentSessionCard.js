import { I18nextManager } from 'tdp_core';
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
        const disabled = ProvenanceGraphMenuUtils.isPersistent(desc);
        return React.createElement(SessionListItem, { desc: desc, selectSession: (event) => sessionAction("select" /* SELECT */, event, desc) },
            React.createElement("button", { type: "button", className: "me-2 pt-1 pb-1 btn btn-outline-secondary", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.saveSession'), disabled: disabled, onClick: (event) => sessionAction("save" /* SAVE */, event, desc) }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.save')),
            React.createElement(ListItemDropdown, null,
                React.createElement("button", { className: "dropdown-item", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.cloneSession'), onClick: (event) => sessionAction("clone" /* CLONE */, event, desc) }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.clone')),
                React.createElement("button", { className: "dropdown-item", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.exportSession'), onClick: (event) => sessionAction("export" /* EXPORT */, event, desc) }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.export')),
                React.createElement("button", { className: "dropdown-delete dropdown-item", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.deleteSession'), onClick: (event) => sessionAction("delete" /* DELETE */, event, desc) }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.delete'))));
    }));
}
//# sourceMappingURL=CurrentSessionCard.js.map