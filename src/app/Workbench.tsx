import React from 'react';
import { useAppSelector } from '../hooks';
import { IWorkbench } from '../store/ordinoSlice';
import { colorPalette } from './Breadcrumb';
import { WorkbenchViews } from './workbench/WorkbenchViews';

export enum EWorkbenchType {
  PREVIOUS = 't-previous',
  FOCUS = 't-focus',
  CONTEXT = 't-context',
  NEXT = 't-next',
}

interface IWorkbenchProps {
  workbench: IWorkbench;
  type?: EWorkbenchType;
}

export function Workbench({ workbench, type = EWorkbenchType.PREVIOUS }: IWorkbenchProps) {
  const ordino = useAppSelector((state) => state.ordino);
  const ref = React.useRef(null);

  return (
    <div
      ref={ref}
      className={`d-flex flex-grow-1 flex-shrink-0 ordino-workbench ${type} ${ordino.focusViewIndex === 0 ? 'start' : ''}`}
      style={{ borderTopColor: colorPalette[workbench.index] }}
    >
      <WorkbenchViews index={workbench.index} onlyRanking={type === EWorkbenchType.CONTEXT} />
    </div>
  );
}
