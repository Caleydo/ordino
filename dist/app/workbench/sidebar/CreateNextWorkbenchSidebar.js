import React, { Fragment, useMemo, useState } from 'react';
import { IDTypeManager, useAsync, ViewUtils } from 'tdp_core';
import { changeFocus, EWorkbenchDirection, addWorkbench } from '../../../store';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { isVisynRankingViewDesc } from '../interfaces';
export function AddWorkbenchSidebar({ workbench }) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    const [selectedView, setSelectedView] = useState(null);
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
    const findDependentViews = React.useMemo(() => () => ViewUtils.findVisynViews(idType).then((views) => {
        return views.filter((v) => isVisynRankingViewDesc(v));
    }), [idType]);
    const { status, value: availableViews } = useAsync(findDependentViews, []);
    const availableEntities = useMemo(() => {
        if (status !== 'success') {
            return null;
        }
        const entities = [];
        availableViews.forEach((v) => {
            if (!entities.some((e) => e.idType === v.itemIDType && e.label === v.group.name)) {
                entities.push({ idType: v.itemIDType, label: v.group.name });
            }
        });
        return entities;
    }, [status, availableViews]);
    const selectionString = useMemo(() => {
        let currString = '';
        workbench.selection.forEach((s) => {
            currString += `${s}, `;
        });
        return currString.length < 202 ? currString.slice(0, currString.length - 2) : `${currString.slice(0, 200)}...`;
    }, [workbench.selection]);
    return (React.createElement("div", { className: "ms-0 position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1" }, status === 'success' ? (React.createElement("div", { className: "d-flex flex-column" }, availableEntities.map((e) => {
        return (React.createElement("div", { key: `${e.idType}Box`, className: "entityJumpBox p-1 mb-2 rounded" },
            React.createElement("div", { className: "d-flex flex-column", style: { justifyContent: 'space-between' } },
                React.createElement("p", { className: "mt-1 mb-1" },
                    React.createElement("span", { className: "p-1 entityText", style: { color: '#e9ecef', backgroundColor: ordino.colorMap[e.idType] } }, e.label)),
                React.createElement("p", { className: "mb-2 selectedPrevText", style: { color: ordino.colorMap[workbench.entityId] } }, selectionString)),
            React.createElement("form", { onSubmit: (event) => {
                    event.preventDefault();
                    const selectedMappings = relationList.map((r) => {
                        return {
                            entityId: r.mappingEntity,
                            columnSelection: r.mappingSubtype,
                        };
                    });
                    dispatch(
                    // load the data
                    addWorkbench({
                        itemIDType: selectedView.itemIDType,
                        detailsSidebarOpen: true,
                        createNextWorkbenchSidebarOpen: false,
                        selectedMappings,
                        views: [
                            {
                                name: selectedView.itemName,
                                id: selectedView.id,
                                parameters: { prevSelection: workbench.selection, selectedMappings },
                                uniqueId: (Math.random() + 1).toString(36).substring(7),
                                filters: [],
                            },
                        ],
                        viewDirection: EWorkbenchDirection.VERTICAL,
                        columnDescs: [],
                        data: {},
                        entityId: relationList[0].targetEntity,
                        name: selectedView.itemName,
                        index: workbench.index + 1,
                        selection: [],
                    }));
                    setTimeout(() => {
                        dispatch(changeFocus({ index: ordino.focusWorkbenchIndex + 1 }));
                    }, 0);
                } },
                availableViews
                    .filter((v) => v.itemIDType === e.idType)
                    .map((v) => {
                    return (React.createElement("div", { key: `${v.name}-mapping` }, v.relation.mapping.map((map) => {
                        const columns = v.isSourceToTarget ? map.sourceToTargetColumns : map.targetToSourceColumns;
                        return (React.createElement(Fragment, { key: `${map.name}-group` },
                            React.createElement("div", { className: "mt-2 mappingTypeText" }, map.name),
                            columns.map((col) => {
                                return (React.createElement("div", { key: `${col.label}Column`, className: "form-check" },
                                    React.createElement("input", { onChange: () => {
                                            relationListCallback({ targetEntity: e.idType, mappingEntity: map.entity, mappingSubtype: col.columnName });
                                            setSelectedView(v);
                                        }, className: "form-check-input", type: "checkbox", value: "", id: `${col.label}${v.name}Check` }),
                                    React.createElement("label", { className: "mappingText form-check-label", htmlFor: `${col.label}${v.name}Check` }, col.label)));
                            })));
                    })));
                }),
                React.createElement("button", { type: "submit", style: { color: 'white', backgroundColor: ordino.colorMap[e.idType] }, className: `mt-1 w-100 chevronButton btn btn-sm align-middle ${relationList.length === 0 ? 'disabled' : ''}` },
                    "Create ",
                    e.label,
                    " workbench"))));
    }))) : null));
}
//# sourceMappingURL=CreateNextWorkbenchSidebar.js.map