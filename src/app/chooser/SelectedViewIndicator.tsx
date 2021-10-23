import * as React from 'react';

interface ISelectedViewIndicatorProps {
    selectedView: string | null;
    availableViews: number;
}

export function SelectedViewIndicator(props: ISelectedViewIndicatorProps) {
    return (
        <div className="selected-view-indicator fs-4 text-secondary m-0 d-flex align-items-center">
            {props.selectedView || `${props.availableViews} Available views`}
        </div>
    );
}

