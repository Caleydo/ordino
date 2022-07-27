import React, { Fragment, useMemo } from 'react';
import { useAsync } from 'tdp_core';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { changeSelectedMappings } from '../../../store';
import { findWorkbenchTransitions } from '../../../views';
export function DetailsSidebar({ workbench }) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    const { status, value: availableViews } = useAsync(findWorkbenchTransitions, [ordino.workbenches[workbench.index - 1].entityId]);
    const selectionString = useMemo(() => {
        const prevWorkbench = ordino.workbenches[workbench.index - 1];
        if (!prevWorkbench) {
            return '';
        }
        const prevFormatting = prevWorkbench.formatting;
        const currString = prevWorkbench.selection
            .map((selectedId) => {
            // the column value might be empty, so we also default to selectedId if this is the case
            return prevFormatting ? prevWorkbench.data[selectedId][prevFormatting.titleColumn || prevFormatting.idColumn] || selectedId : selectedId;
        })
            .join(', ');
        return currString.length < 152 ? currString : `${currString.slice(0, 150)}...`;
    }, [ordino.workbenches, workbench.index]);
    return (React.createElement("div", { className: "me-0", style: { width: '250px' } }, status === 'success' ? (React.createElement("div", { className: "d-flex flex-column" },
        React.createElement("div", { className: "p-1 mb-2 rounded" },
            React.createElement("div", { className: "d-flex flex-column", style: { justifyContent: 'space-between' } },
                React.createElement("p", { className: "mb-1" },
                    React.createElement("span", { className: "entityText" }, "Selected "),
                    React.createElement("span", { className: "entityText", style: { color: ordino.colorMap[ordino.workbenches[workbench.index - 1].entityId] } }, ordino.workbenches[workbench.index - 1].name)),
                React.createElement("p", { className: "mb-2 selectedPrevText" }, selectionString)),
            availableViews
                .filter((v) => v.itemIDType === workbench.entityId)
                .map((v) => {
                var _a;
                return (React.createElement("div", { key: `${v.name}-mapping` }, (_a = v.relation) === null || _a === void 0 ? void 0 : _a.mapping.map(({ name, entity, columns }) => {
                    return (React.createElement(Fragment, { key: `${entity}-${name}` },
                        React.createElement("div", { className: "mt-2 mappingTypeText" }, name),
                        columns.map((col) => {
                            const isChecked = workbench.selectedMappings.some((m) => m.columnSelection === col.columnName && m.entityId === entity);
                            return (React.createElement("div", { key: `${col.label}-column`, className: "form-check ms-2" },
                                React.createElement("input", { checked: isChecked, onChange: () => dispatch(changeSelectedMappings({
                                        workbenchIndex: ordino.midTransition ? ordino.focusWorkbenchIndex + 1 : ordino.focusWorkbenchIndex,
                                        newMapping: { columnSelection: col.columnName, entityId: entity },
                                    })), style: {
                                        backgroundColor: isChecked ? ordino.colorMap[workbench.entityId] : null,
                                        borderColor: isChecked ? ordino.colorMap[workbench.entityId] : null,
                                    }, className: "form-check-input", type: "checkbox", value: "", id: `checkbox-${col.label}-${v.name}` }),
                                React.createElement("label", { className: "mappingText form-check-label", htmlFor: `checkbox-${col.label}-${v.name}` }, col.label)));
                        })));
                })));
            })))) : null));
}
//# sourceMappingURL=DetailsSidebar.js.map