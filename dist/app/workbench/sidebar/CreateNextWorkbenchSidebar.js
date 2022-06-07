import React, { useMemo, useState } from 'react';
import { useAsync } from 'tdp_core';
import { changeFocus, EWorkbenchDirection, addWorkbench, setCreateNextWorkbenchSidebarOpen } from '../../../store';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { getVisynView } from '../WorkbenchView';
export function CreateNextWorkbenchSidebar({ workbench }) {
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
    const { status, value: availableViews } = useAsync(getVisynView, [workbench.entityId]);
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
    console.log(availableViews);
    const selectionString = useMemo(() => {
        const prevFormatting = workbench.formatting;
        const currString = workbench.selection
            .map((selectedId) => {
            // the column value might be empty, so we also default to selectedId if this is the case
            return prevFormatting ? workbench.data[selectedId][prevFormatting.titleColumn || prevFormatting.idColumn] || selectedId : selectedId;
        })
            .join(', ');
        return currString.length < 202 ? currString : `${currString.slice(0, 200)}...`;
    }, [workbench.data, workbench.formatting, workbench.selection]);
    return (React.createElement("div", { className: "ms-0 position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1" }, status === 'success' ? (React.createElement("div", { className: "d-flex flex-column" }, availableViews.map((e) => {
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
                                name: selectedView.name,
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
                        dispatch(setCreateNextWorkbenchSidebarOpen({ workbenchIndex: workbench.index, open: false }));
                    }, 0);
                } })));
    }))) : null));
}
//# sourceMappingURL=CreateNextWorkbenchSidebar.js.map