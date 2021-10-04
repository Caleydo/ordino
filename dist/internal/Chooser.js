import React from 'react';
import { AView, FindViewUtils } from 'tdp_core';
import { TreeRenderer, viewPluginDescToTreeElementHelper } from 'tdp_ui';
import { useAsync } from '..';
// tslint:disable-next-line: variable-name
export const Chooser = ({ previousWrapper, onOpenView }) => {
    const [inputSelection, setInputSelection] = React.useState(previousWrapper.getItemSelection());
    const [openView, setOpenView] = React.useState(false);
    const [initialized, setInitialized] = React.useState(false);
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
        previousWrapper.getInstance().on(AView.EVENT_ITEM_SELECT, listener);
        return () => {
            var _a;
            (_a = previousWrapper.getInstance()) === null || _a === void 0 ? void 0 : _a.off(AView.EVENT_ITEM_SELECT, listener);
        };
    }, [previousWrapper]);
    const { value: views, status } = useAsync(loadViews);
    return React.createElement(React.Fragment, null, status === 'success' && views.length > 0 &&
        React.createElement("div", { className: "chooser" },
            React.createElement(TreeRenderer, { groups: views, itemAction: (view) => {
                    onOpenView(previousWrapper, view.id, inputSelection.idtype, inputSelection.range);
                } })));
};
//# sourceMappingURL=Chooser.js.map