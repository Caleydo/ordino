import * as React from 'react';
import { IDType, isVisynDataViewDesc, isVisynSimpleViewDesc, useAsync, ViewUtils } from 'tdp_core';
import { useMemo } from 'react';
import { WorkbenchGenericView } from './WorkbenchGenericView';
import { WorkbenchEmptyView } from './WorkbenchEmptyView';
import { useAppSelector } from '../../hooks/useAppSelector';
export function getVisynView(entityId) {
    return ViewUtils.findVisynViews(new IDType(entityId, '.*', '', true));
}
export function WorkbenchView({ workbenchIndex, view, dragMode, path, removeCallback, }) {
    const ordino = useAppSelector((state) => state.ordino);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const views = useMemo(() => () => getVisynView(ordino.workbenches[workbenchIndex].entityId), []);
    const { value } = useAsync(views, []);
    const availableViews = useMemo(() => {
        return value ? value.filter((v) => isVisynSimpleViewDesc(v) || isVisynDataViewDesc(v)) : [];
    }, [value]);
    return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    React.createElement(React.Fragment, null, view.id === '' ? (React.createElement(WorkbenchEmptyView, { removeCallback: removeCallback, path: path, chooserOptions: availableViews, workbenchIndex: workbenchIndex, view: view, dragMode: dragMode })) : (React.createElement(WorkbenchGenericView, { removeCallback: removeCallback, path: path, chooserOptions: availableViews, workbenchIndex: workbenchIndex, view: view, dragMode: dragMode }))));
}
//# sourceMappingURL=WorkbenchView.js.map