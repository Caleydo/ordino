import React from 'react';
import {BSTooltip, EViewMode} from 'tdp_core';

interface ISelectionIndicatorProps {
    idType: string;
    selectionCount: number;
    viewMode: EViewMode;
}

export function SelectionCountIndicator({selectionCount, viewMode = EViewMode.HIDDEN, idType = 'Genes'}: ISelectionIndicatorProps) {
    const modeClass = viewMode === EViewMode.FOCUS ? 't-focus' : viewMode === EViewMode.CONTEXT ? 't-context' : '';

    return (
        <>
            <BSTooltip>
                <div
                    className={`${modeClass} selection-count-indicator d-flex justify-content-center align-items-center fs-5 mb-2 rounded-3`}
                    title={`${selectionCount} ${idType} selected from previous view`}
                    data-bs-toggle="tooltip"
                >
                    <span className="text-secondary"> {selectionCount}</span>
                </div>
            </BSTooltip>
        </>
    );
};
