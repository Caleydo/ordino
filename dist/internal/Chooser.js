import React from 'react';
import { AView, FindViewUtils } from 'tdp_core';
import { TreeRenderer, viewPluginDescToTreeElementHelper } from 'tdp_ui';
import { useAsync } from '..';
// tslint:disable-next-line: variable-name
export const Chooser = ({ previousWrapper, selection, onOpenView }) => {
    const [inputSelection, setInputSelection] = React.useState(selection);
    const [openView, setOpenView] = React.useState(false);
    const loadViews = React.useMemo(() => () => {
        if (!inputSelection || inputSelection.range.isNone) {
            return Promise.resolve([]);
        }
        return FindViewUtils.findAllViews(inputSelection.idtype)
            .then((views) => viewPluginDescToTreeElementHelper(views));
    }, [inputSelection]);
    React.useEffect(() => {
        const listener = (_, oldSelection, newSelection) => {
            if (!(oldSelection.range.isNone && newSelection.range.isNone)) {
                setInputSelection(newSelection);
            }
        };
        previousWrapper.on(AView.EVENT_ITEM_SELECT, listener);
        return () => {
            previousWrapper.off(AView.EVENT_ITEM_SELECT, listener);
        };
    }, [previousWrapper]);
    const { value: views, status } = useAsync(loadViews);
    console.log(status, views, previousWrapper, inputSelection);
    return React.createElement(React.Fragment, null, status === 'success' && views.length > 0 &&
        React.createElement("div", { className: "chooser" },
            React.createElement(TreeRenderer, { groups: views, itemAction: (view) => {
                    onOpenView(previousWrapper, view.id, inputSelection.idtype, inputSelection.range);
                } })));
};
//# sourceMappingURL=Chooser.js.map