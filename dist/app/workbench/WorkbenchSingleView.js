import * as React from 'react';
import { IDType, isVisynDataView, isVisynSimpleView, useAsync, ViewUtils } from 'tdp_core';
import { useMemo } from 'react';
import { WorkbenchGenericView } from './WorkbenchGenericView';
import { WorkbenchEmptyView } from './WorkbenchEmptyView';
import { useAppSelector } from '../../hooks/useAppSelector';
export function getVisynView(entityId) {
    return ViewUtils.findVisynViews(new IDType(entityId, '.*', '', true));
}
export function WorkbenchSingleView({ workbenchIndex, view }) {
    const ordino = useAppSelector((state) => state.ordino);
    const views = useMemo(() => () => getVisynView(ordino.workbenches[workbenchIndex].entityId), []);
    const { value } = useAsync(views, []);
    const availableViews = useMemo(() => {
        return value ? value.map((v) => v.v).filter((v) => isVisynSimpleView(v) || isVisynDataView(v)) : []; // TODO: maybe remove this when we have view subtypes in visyn views
    }, [value]);
    return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    React.createElement(React.Fragment, null, view.id === '' ? (React.createElement(WorkbenchEmptyView, { chooserOptions: availableViews, workbenchIndex: workbenchIndex, view: view })) : (React.createElement(WorkbenchGenericView, { chooserOptions: availableViews, workbenchIndex: workbenchIndex, view: view }))));
}
//# sourceMappingURL=WorkbenchSingleView.js.map