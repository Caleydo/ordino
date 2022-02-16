import React from 'react';
import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../..';
import { FindViewUtils, IDType, useAsync } from 'tdp_core';
import { colorPalette } from '../../Breadcrumb';
import { useState } from 'react';
import { changeSelectedMappings } from '../../../store';
export function DetailsSidebar({ workbench }) {
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
    return (React.createElement("div", { className: "position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1" }, status === 'success' ?
        React.createElement("div", { className: 'd-flex flex-column' }, Array.from(availableEntities).filter((d, i) => i === 0).map((e) => {
            return (React.createElement("div", { className: 'entityJumpBox p-1 mb-2 rounded' },
                React.createElement("span", { className: 'fs-2', style: { color: colorPalette[workbench.index] } }, e),
                availableViews.filter((v) => v.v.itemIDType === e).map((v) => {
                    return (React.createElement("div", null,
                        React.createElement("span", null, v.v.name),
                        v.v.mapping.targetToSourceColumns.map((col) => {
                            return (React.createElement("div", { className: "form-check" },
                                React.createElement("input", { checked: workbench.selectedMappings.includes(col.columnName), onChange: () => dispatch(changeSelectedMappings({ workbenchIndex: ordino.focusViewIndex, newMapping: col.columnName })), className: "form-check-input", type: "checkbox", value: "", id: "flexCheckDefault" }),
                                React.createElement("label", { className: "form-check-label", htmlFor: "flexCheckDefault" }, col.label)));
                        })));
                })));
        })) : null));
}
//# sourceMappingURL=DetailsSidebar.js.map