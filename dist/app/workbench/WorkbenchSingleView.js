/* eslint-disable react/jsx-no-useless-fragment */
import * as React from 'react';
import { FindViewUtils, IDType, useAsync } from 'tdp_core';
import { useMemo } from 'react';
import { WorkbenchGenericView } from './WorkbenchGenericView';
import { WorkbenchEmptyView } from './WorkbenchEmptyView';
import { useAppSelector } from '../../hooks/useAppSelector';
export function getVisynView(entityId) {
    return FindViewUtils.findVisynViews(new IDType(entityId, '.*', '', true));
}
export function WorkbenchSingleView({ workbenchIndex, view }) {
    const ordino = useAppSelector((state) => state.ordino);
    const { value } = useAsync(getVisynView, [ordino.workbenches[workbenchIndex].entityId]);
    const availableViews = useMemo(() => {
        return value ? value.map((v) => v.v) : [];
    }, [value]);
    return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    React.createElement(React.Fragment, null, view.id === '' ? (React.createElement(WorkbenchEmptyView, { chooserOptions: availableViews, workbenchIndex: workbenchIndex, view: view })) : (React.createElement(WorkbenchGenericView, { chooserOptions: availableViews, workbenchIndex: workbenchIndex, view: view }))));
}
//# sourceMappingURL=WorkbenchSingleView.js.map