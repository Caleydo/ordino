import React from 'react';
import { useAppSelector } from '../hooks';
import { IWorkbench } from '../store/ordinoSlice';
import { EWorkbenchType, WorkbenchViews } from './workbench/WorkbenchViews';

interface IWorkbenchProps {
  workbench: IWorkbench;
  type?: EWorkbenchType;
}

export function Workbench({ workbench, type = EWorkbenchType.PREVIOUS }: IWorkbenchProps) {
  const ordino = useAppSelector((state) => state.ordino);

  return (
    <div
      className={`d-flex flex-grow-1 flex-shrink-0 ordino-workbench ${type} ${ordino.focusWorkbenchIndex === 0 ? 'start' : ''}`}
      style={{ borderTopColor: ordino.colorMap[workbench.entityId] }}
    >
      <WorkbenchViews index={workbench.index} type={type} />
    </div>
  );
}
