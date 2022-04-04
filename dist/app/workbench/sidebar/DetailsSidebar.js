import React, { Fragment, useMemo } from 'react';
import { IDType, useAsync, ViewUtils } from 'tdp_core';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { changeSelectedMappings } from '../../../store/ordinoSlice';
import { isVisynRankingViewDesc } from '../../../views/interfaces';
export function DetailsSidebar({ workbench }) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    const idType = useMemo(() => {
        return new IDType(ordino.workbenches[workbench.index - 1].entityId, '.*', '', true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const findDependentViews = React.useMemo(() => () => ViewUtils.findVisynViews(idType).then((views) => views.filter((v) => isVisynRankingViewDesc(v))), [idType]);
    const { status, value: availableViews } = useAsync(findDependentViews, []);
    const selectionString = useMemo(() => {
        let currString = '';
        ordino.workbenches[workbench.index - 1].selection.forEach((s) => {
            currString += `${s}, `;
        });
        return currString.length < 152 ? currString.slice(0, currString.length - 2) : `${currString.slice(0, 150)}...`;
    }, [ordino.workbenches, workbench.index]);
    return (React.createElement("div", { className: "me-0 position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1" }, status === 'success' ? (React.createElement("div", { className: "d-flex flex-column" },
        React.createElement("div", { className: "p-1 mb-2 rounded" },
            React.createElement("div", { className: "d-flex flex-column", style: { justifyContent: 'space-between' } },
                React.createElement("p", { className: "mb-1" },
                    React.createElement("span", { className: "entityText" }, "Selected "),
                    React.createElement("span", { className: "p-1 entityText", style: { color: '#e9ecef', backgroundColor: ordino.colorMap[ordino.workbenches[workbench.index - 1].entityId] } },
                        ordino.workbenches[workbench.index - 1].name,
                        "s")),
                React.createElement("p", { className: "mb-2 selectedPrevText" }, selectionString)),
            availableViews
                .filter((v) => v.itemIDType === workbench.entityId)
                .map((v) => {
                return (React.createElement("div", { key: `${v.name}mapping` }, v.relation.mapping.map((map) => {
                    const columns = v.isSourceToTarget ? map.sourceToTargetColumns : map.targetToSourceColumns;
                    return (React.createElement(Fragment, { key: `${map.entity}-${map.name}` },
                        React.createElement("div", { className: "mt-2 mappingTypeText" }, map.name),
                        columns.map((col) => {
                            return (React.createElement("div", { key: `${col.label}Column`, className: "form-check" },
                                React.createElement("input", { checked: workbench.selectedMappings.some((m) => m.columnSelection === col.columnName && m.entityId === map.entity), onChange: () => dispatch(changeSelectedMappings({
                                        workbenchIndex: ordino.focusWorkbenchIndex,
                                        newMapping: { columnSelection: col.columnName, entityId: map.entity },
                                    })), className: "form-check-input", type: "checkbox", value: "", id: "flexCheckDefault" }),
                                React.createElement("label", { className: "mappingText form-check-label", htmlFor: "flexCheckDefault" }, col.label)));
                        })));
                })));
            })))) : null));
}
//# sourceMappingURL=DetailsSidebar.js.map