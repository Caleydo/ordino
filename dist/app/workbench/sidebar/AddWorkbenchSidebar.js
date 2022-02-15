import React from 'react';
import { useMemo } from 'react';
import { addWorkbench, changeFocus, EWorkbenchDirection, useAppDispatch, useAppSelector } from '../../..';
import { EXTENSION_POINT_TDP_VIEW, FindViewUtils, IDType, PluginRegistry, useAsync } from 'tdp_core';
import { colorPalette } from '../../Breadcrumb';
import { useState } from 'react';
export function AddWorkbenchSidebar({ workbench }) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    const [relationList, setRelationList] = useState([]);
    const relationListCallback = (s) => {
        if (!relationList.some((r) => r.mappingName === s.mappingName && r.mappingSubtype === s.mappingSubtype)) {
            setRelationList([...relationList, s]);
        }
        else {
            const arr = Array.from(relationList).filter((r) => r.mappingSubtype !== s.mappingSubtype);
            setRelationList(arr);
        }
    };
    const idType = useMemo(() => {
        return new IDType(workbench.entityId, '.*', '', true);
    }, []);
    const { status, value: availableViews } = useAsync(FindViewUtils.findAllViews, [idType]);
    const availableEntities = useMemo(() => {
        if (status !== 'success') {
            return null;
        }
        const entities = new Set();
        availableViews.forEach((v) => {
            entities.add(v.v.itemIDType);
        });
        return entities;
    }, [status, availableViews]);
    console.log(availableViews, availableEntities);
    console.log(relationList);
    return (React.createElement("div", { className: "position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1" }, status === 'success' ?
        React.createElement("div", { className: 'd-flex flex-column' }, Array.from(availableEntities).filter((d, i) => i === 0).map((e) => {
            return (React.createElement("div", { className: 'entityJumpBox p-1 mb-2 rounded' },
                React.createElement("span", { className: 'fs-2', style: { color: colorPalette[workbench.index] } }, e),
                availableViews.filter((v) => v.v.itemIDType === e).map((v) => {
                    return (React.createElement("div", null,
                        React.createElement("span", null, v.v.name),
                        v.v.mapping.targetToSourceColumns.map((col) => {
                            return (React.createElement("div", { className: "form-check" },
                                React.createElement("input", { onChange: () => relationListCallback({ mappingName: e, mappingSubtype: col.columnName }), className: "form-check-input", type: "checkbox", value: "", id: "flexCheckDefault" }),
                                React.createElement("label", { className: "form-check-label", htmlFor: "flexCheckDefault" }, col.label)));
                        })));
                }),
                React.createElement("button", { onClick: () => {
                        const viewPlugin = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, `reprovisyn_ranking_${relationList[0].mappingName}`);
                        dispatch(addWorkbench({
                            detailsOpen: true,
                            addWorkbenchOpen: false,
                            selectedMappings: relationList.map((r) => r.mappingSubtype),
                            views: [{ id: viewPlugin.id, uniqueId: (Math.random() + 1).toString(36).substring(7), filters: [] }],
                            viewDirection: EWorkbenchDirection.VERTICAL,
                            transitionOptions: [],
                            columnDescs: [],
                            data: {},
                            entityId: viewPlugin.id,
                            name: viewPlugin.name,
                            index: ordino.focusViewIndex + 1,
                            selection: [],
                        }));
                        setTimeout(() => {
                            dispatch(changeFocus({ index: ordino.focusViewIndex + 1 }));
                        }, 0);
                    }, type: "button", className: "w-100 chevronButton btn btn-light btn-sm align-middle" },
                    "Create new ",
                    e,
                    " workbench")));
        })) : null));
}
//# sourceMappingURL=AddWorkbenchSidebar.js.map