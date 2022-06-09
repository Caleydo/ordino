import React, { useMemo } from 'react';
import { I18nextManager } from 'tdp_core';
import _ from 'lodash';
import { getAllFilters } from '../../store/storeUtils';
import { useAppSelector } from '../../hooks/useAppSelector';
export function FilterAndSelected() {
    const ordino = useAppSelector((state) => state.ordino);
    const dataLength = useMemo(() => {
        return Object.keys(ordino.workbenches[ordino.focusWorkbenchIndex].data).length;
    }, [ordino.focusWorkbenchIndex, ordino.workbenches]);
    const filterLength = useMemo(() => {
        return getAllFilters(ordino.workbenches[ordino.focusWorkbenchIndex]).length;
    }, [ordino.focusWorkbenchIndex, ordino.workbenches]);
    const selectedLength = useMemo(() => {
        return ordino.workbenches[ordino.focusWorkbenchIndex].selection.length;
    }, [ordino.focusWorkbenchIndex, ordino.workbenches]);
    const isQueryFilterEqual = useMemo(() => {
        return _.isEqual(ordino.globalQuery.filter.val, ordino.appliedQueryFilter.val);
    }, [ordino.globalQuery.filter.val, ordino.appliedQueryFilter.val]);
    return (React.createElement("div", { className: "align-middle m-1 d-flex align-items-center" },
        !isQueryFilterEqual ? (React.createElement("i", { className: "fa fa-filter", "aria-hidden": "true", title: I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.appliedQueryFilterTitle', {
                entityName: ordino.workbenches[ordino.focusWorkbenchIndex].name,
                globalQueryName: ordino.globalQuery.name,
                selectedValues: ordino.appliedQueryFilter.val.join(','),
            }) })) : null,
        React.createElement("span", { className: "m-1" },
            dataLength - filterLength,
            " of ",
            dataLength,
            " ",
            ordino.workbenches[ordino.focusWorkbenchIndex].name,
            "s / ",
            selectedLength,
            ' ',
            ordino.workbenches[ordino.focusWorkbenchIndex].name,
            "s selected")));
}
//# sourceMappingURL=FilterAndSelected.js.map