import React from 'react';
import { IWorkbench } from '../store/ordinoSlice';
import { EWorkbenchType } from './Filmstrip';
import { useAppDispatch, useAppSelector } from '../hooks';
import { WorkbenchViews } from './workbench/WorkbenchViews';

interface IWorkbenchProps {
  workbench: IWorkbench;
  type?: EWorkbenchType;
}

export function Workbench({ workbench, type = EWorkbenchType.PREVIOUS }: IWorkbenchProps) {
  const dispatch = useAppDispatch();
  const ordino = useAppSelector((state) => state.ordino);
  const ref = React.useRef(null);

  return (
    <div
      ref={ref}
      className={`d-flex flex-grow-1 flex-shrink-0 ordino-workbench ${type} ${ordino.focusViewIndex === 0 ? 'start' : ''}`}
      style={{ borderTopColor: ordino.colorMap[workbench.entityId] }}
    >
      <WorkbenchViews index={workbench.index} onlyRanking={type === EWorkbenchType.CONTEXT} />
    </div>
  );
}
