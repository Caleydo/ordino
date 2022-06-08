import * as React from 'react';
import { useMemo } from 'react';
import { Workbench } from './workbench/Workbench';
import { useAppSelector } from '../hooks';
import { EWorkbenchType } from './workbench/WorkbenchViews';

export const focusViewWidth = 85; // viewport width (vw)
export const contextViewWidth = 15; // viewport width (vw)

export function Filmstrip() {
  const { focusWorkbenchIndex: focusViewIndex, workbenches, midTransition } = useAppSelector((state) => state.ordino);

  const translateDistance = useMemo(() => {
    if (focusViewIndex > 0) {
      return midTransition ? `translateX(${focusViewIndex * -contextViewWidth}vw)` : `translateX(${(focusViewIndex - 1) * -contextViewWidth}vw)`;
    }
    return `translateX(0vw)`;
  }, [focusViewIndex, midTransition]);

  return (
    <div className="ordino-filmstrip flex-grow-1 align-content-stretch" style={{ transform: translateDistance }}>
      {workbenches.map((v) => {
        const focused = focusViewIndex;
        return (
          <Workbench
            type={
              v.index === focused - 1
                ? EWorkbenchType.CONTEXT
                : v.index === focused
                ? EWorkbenchType.FOCUS
                : v.index > focused
                ? EWorkbenchType.NEXT
                : EWorkbenchType.PREVIOUS
            }
            workbench={v}
            key={`${v.name}-${v.index}`}
          />
        );
      })}
    </div>
  );
}
