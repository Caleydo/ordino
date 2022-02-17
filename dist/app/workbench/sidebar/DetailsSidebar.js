import React from 'react';
import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../..';
import { FindViewUtils, IDType, useAsync } from 'tdp_core';
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
    const currentEntity = useMemo(() => {
        if (!availableViews) {
            return null;
        }
        const currEntity = availableViews.find((v) => {
            return v.v.idtype === workbench.entityId;
        });
        return { idType: currEntity.v.idtype, label: currEntity.v.group.name };
    }, [status, availableViews]);
    console.log(availableViews, currentEntity);
    return (React.createElement("div", { className: "position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1" }, status === 'success' ?
        React.createElement("div", { className: 'd-flex flex-column' },
            React.createElement("div", { className: 'entityJumpBox p-1 mb-2 rounded' },
                React.createElement("span", { className: 'entityText', style: { color: ordino.colorMap[currentEntity.idType] } }, currentEntity.label),
                availableViews.filter((v) => v.v.itemIDType === currentEntity.idType).map((v) => {
                    return (React.createElement("div", null, v.v.relation.mapping.map((map) => {
                        const columns = v.v.isSourceToTarget ? map.sourceToTargetColumns : map.targetToSourceColumns;
                        return (React.createElement(React.Fragment, null,
                            React.createElement("div", { className: 'mt-2 mappingTypeText' }, map.name),
                            columns.map((col) => {
                                return (React.createElement("div", { className: "form-check" },
                                    React.createElement("input", { checked: workbench.selectedMappings.some((m) => m.columnSelection === col.columnName && m.entityId === map.entity), onChange: () => dispatch(changeSelectedMappings({ workbenchIndex: ordino.focusViewIndex, newMapping: { columnSelection: col.columnName, entityId: map.entity } })), className: "form-check-input", type: "checkbox", value: "", id: "flexCheckDefault" }),
                                    React.createElement("label", { className: "form-check-label", htmlFor: "flexCheckDefault" }, col.label)));
                            })));
                    })));
                }))) : null));
}
//# sourceMappingURL=DetailsSidebar.js.map