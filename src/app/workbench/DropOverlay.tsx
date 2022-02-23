import * as React from 'react';
import { IWorkbenchView } from '../../store';
import { WorkbenchSwitchIcon } from './icons/WorkbenchSwitchIcon';

export interface IDropOverlayProps {
  view: IWorkbenchView;
}

export function DropOverlay({ view }: IDropOverlayProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: 1,
        opacity: 1,
        backgroundColor: 'lightgray',
      }}
    >
      <WorkbenchSwitchIcon view={view} />
    </div>
  );
}
