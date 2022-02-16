import React from 'react';
import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../..';
import { FindViewUtils, IDType, useAsync } from 'tdp_core';
import { useState } from 'react';
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
    return (React.createElement("div", { className: "position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1" }));
}
//# sourceMappingURL=DetailsSidebar.js.map