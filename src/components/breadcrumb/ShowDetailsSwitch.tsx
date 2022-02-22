import * as React from 'react';
import { useState } from 'react';

export interface IShowDetailsSwitchProps {
  height?: number;
}

export function ShowDetailsSwitch({ height = 30 }: IShowDetailsSwitchProps) {
  return (
    <div className="form-check form-switch align-middle m-1">
      <input className="form-check-input checked" type="checkbox" id="flexSwitchCheckChecked" />
      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
        Show Details
      </label>
    </div>
  );
}
