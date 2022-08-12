import React, { useMemo } from 'react';
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
    return (React.createElement("div", { className: "text-truncate align-middle m-1 d-flex align-items-center" },
        React.createElement("span", { className: "m-1 text-truncate" },
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