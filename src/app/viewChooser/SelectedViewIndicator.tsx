import * as React from 'react';

export interface ISelectedViewIndicatorProps {
  selectedView: string | null;
  availableViews: number;
}

export function SelectedViewIndicator(props: ISelectedViewIndicatorProps) {
  return (
    <div className="selected-view-indicator flex-grow-1 fs-4 text-secondary m-0 d-flex align-items-center justify-content-center">
      {props.selectedView || `${props.availableViews} Available views`}
    </div>
  );
}
