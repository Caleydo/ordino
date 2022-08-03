import * as React from 'react';
import { IDType, useAsync, ViewUtils } from 'tdp_core';
import { useMemo } from 'react';
import { WorkbenchGenericView } from './WorkbenchGenericView';
import { WorkbenchEmptyView } from './WorkbenchEmptyView';
import { useAppSelector } from '../../hooks/useAppSelector';
export function getVisynView(entityId) {
    return ViewUtils.findVisynViews(new IDType(entityId, '.*', '', true));
}
export function WorkbenchView({ workbenchIndex, view, mosaicDrag, path, removeCallback, }) {
    const workbench = useAppSelector((state) => state.ordinoTracked.workbenches[workbenchIndex]);
    const { value: visynViews } = useAsync(getVisynView, [workbench.entityId]);
    const availableViews = useMemo(() => {
        return visynViews || [];
    }, [visynViews]);
    return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    React.createElement(React.Fragment, null, view.id === '' ? (React.createElement(WorkbenchEmptyView, { removeCallback: removeCallback, path: path, chooserOptions: availableViews, workbenchIndex: workbenchIndex, view: view, mosaicDrag: mosaicDrag })) : (React.createElement(WorkbenchGenericView, { removeCallback: removeCallback, path: path, chooserOptions: availableViews, workbenchIndex: workbenchIndex, view: view, mosaicDrag: mosaicDrag }))));
}
//# sourceMappingURL=WorkbenchView.js.map