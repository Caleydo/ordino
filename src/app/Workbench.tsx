import React, { useRef, useState } from 'react';
import { useAppSelector } from '../hooks';
import { IWorkbench } from '../store';
import { EWorkbenchType, WorkbenchViews } from './workbench/WorkbenchViews';

interface IWorkbenchProps {
  workbench: IWorkbench;
  type?: EWorkbenchType;
}

export function Workbench({ workbench, type = EWorkbenchType.PREVIOUS }: IWorkbenchProps) {
  const ordino = useAppSelector((state) => state.ordino);

  const ref = useRef<HTMLDivElement>(null);

  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  React.useEffect(() => {
    console.log('adding event listener');
    if (ref?.current) {
      console.log(ref.current, ref);
      ref.current.addEventListener('transitionstart', (event: any) => {
        if (event.target === event.currentTarget) {
          setIsTransitioning(true);
        }
      });
      ref.current.addEventListener('transitionend', (event: any) => {
        if (event.target === event.currentTarget) {
          setTimeout(() => {
            setIsTransitioning(false);
          }, 2000);
        }
      });
    }
  }, [ref]);

  return (
    <div
      ref={ref}
      className={`d-flex flex-grow-1 flex-shrink-0 ordino-workbench ${type} ${ordino.focusWorkbenchIndex === 0 ? 'start' : ''}`}
      style={{ borderTopColor: ordino.colorMap[workbench.entityId] }}
    >
      <WorkbenchViews isTransitioning={isTransitioning} index={workbench.index} type={type} />
    </div>
  );
}
