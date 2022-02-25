import React, { Fragment, useMemo, useState } from 'react';
import { FindViewUtils, IDTypeManager, useAsync } from 'tdp_core';
import { changeFocus, EWorkbenchDirection, addWorkbench } from '../../../store';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
/**
 * TODO: Do different views always have the same base ranking and just different columns?
 * Get the base view of the ranking
 * @param availableViews
 */
function getBaseView(availableViews) {
    return availableViews[0].v; // take the first view for now
}
export function AddWorkbenchSidebar({ workbench }) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    const [relationList, setRelationList] = useState([]);
    const relationListCallback = (s) => {
        if (!relationList.some((r) => r.mappingEntity === s.mappingEntity && r.mappingSubtype === s.mappingSubtype && s.targetEntity === r.targetEntity)) {
            setRelationList([...relationList, s]);
        }
        else {
            const arr = Array.from(relationList).filter((r) => r.mappingSubtype !== s.mappingSubtype);
            setRelationList(arr);
        }
    };
    const idType = useMemo(() => IDTypeManager.getInstance().resolveIdType(workbench.itemIDType), [workbench.itemIDType]);
    const findDependentViews = React.useMemo(() => () => FindViewUtils.findVisynViews(idType).then((views) => views.filter((v) => {
        return v.v.defaultView;
    })), [idType]);
    const { status, value: availableViews } = useAsync(findDependentViews, []);
    const availableEntities = useMemo(() => {
        if (status !== 'success') {
            return null;
        }
        const entities = [];
        availableViews.forEach((v) => {
            if (!entities.some((e) => e.idType === v.v.itemIDType && e.label === v.v.group.name)) {
                entities.push({ idType: v.v.itemIDType, label: v.v.group.name });
            }
        });
        return entities;
    }, [status, availableViews]);
    const selectionString = useMemo(() => {
        let currString = '';
        workbench.selection.forEach((s) => {
            currString += `${s}, `;
        });
        return currString.slice(0, currString.length - 3);
    }, [workbench.selection]);
    return (React.createElement("div", { className: "ms-0 position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1" }, status === 'success' ? (React.createElement("div", { className: "d-flex flex-column" }, availableEntities.map((e) => {
        return (React.createElement("div", { key: `${e.idType}Box`, className: "entityJumpBox p-1 mb-2 rounded" },
            React.createElement("div", { className: "d-flex", style: { justifyContent: 'space-between' } },
                React.createElement("p", { className: "mb-0 entityText", style: { color: ordino.colorMap[e.idType] } }, e.label),
                React.createElement("p", { className: "mb-0 mappingText", style: { color: ordino.colorMap[workbench.entityId] } }, selectionString)),
            React.createElement("form", { onSubmit: (event) => {
                    event.preventDefault();
                    const baseView = getBaseView(availableViews);
                    dispatch(
                    // load the data
                    addWorkbench({
                        itemIDType: baseView.itemIDType,
                        detailsOpen: true,
                        addWorkbenchOpen: false,
                        selectedMappings: relationList.map((r) => {
                            return {
                                entityId: r.mappingEntity,
                                columnSelection: r.mappingSubtype,
                            };
                        }),
                        views: [{ name: baseView.name, id: baseView.id, uniqueId: (Math.random() + 1).toString(36).substring(7), filters: [] }],
                        viewDirection: EWorkbenchDirection.VERTICAL,
                        transitionOptions: [],
                        columnDescs: [],
                        data: {},
                        entityId: relationList[0].targetEntity,
                        name: baseView.name,
                        index: ordino.focusViewIndex + 1,
                        selection: workbench.selection,
                    }));
                    setTimeout(() => {
                        dispatch(changeFocus({ index: ordino.focusViewIndex + 1 }));
                    }, 0);
                } },
                availableViews
                    .filter((v) => v.v.itemIDType === e.idType)
                    .map((v) => {
                    return (React.createElement("div", { key: `${v.v.name}mapping` }, v.v.relation.mapping.map((map) => {
                        const columns = v.v.isSourceToTarget ? map.sourceToTargetColumns : map.targetToSourceColumns;
                        return (React.createElement(Fragment, { key: `${map.name}-group` },
                            React.createElement("div", { className: "mt-2 mappingTypeText" }, map.name),
                            columns.map((col) => {
                                return (React.createElement("div", { key: `${col.label}Column`, className: "form-check" },
                                    React.createElement("input", { onChange: () => relationListCallback({ targetEntity: e.idType, mappingEntity: map.entity, mappingSubtype: col.columnName }), className: "form-check-input", type: "checkbox", value: "", id: "flexCheckDefault" }),
                                    React.createElement("label", { className: "mappingText form-check-label", htmlFor: "flexCheckDefault" }, col.label)));
                            })));
                    })));
                }),
                React.createElement("button", { type: "submit", style: { color: 'white', backgroundColor: ordino.colorMap[e.idType] }, className: `mt-1 w-100 chevronButton btn btn-sm align-middle ${relationList.length === 0 ? 'disabled' : ''}` },
                    "Create ",
                    e.label,
                    " workbench"))));
    }))) : null));
}
//# sourceMappingURL=AddWorkbenchSidebar.js.map