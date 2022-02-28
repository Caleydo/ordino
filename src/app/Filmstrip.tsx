import * as React from 'react';
import { useMemo } from 'react';
import { EWorkbenchType, Workbench } from './Workbench';
import { useAppSelector } from '../hooks';

export const focusViewWidth = 85; // viewport width (vw)
export const contextViewWidth = 15; // viewport width (vw)

export function Filmstrip() {
  const { focusViewIndex, workbenches } = useAppSelector((state) => state.ordino);

  const translateDistance = useMemo(() => {
    if (focusViewIndex > 1) {
      return `translateX(${(focusViewIndex - 1) * -contextViewWidth}vw)`;
    }
    return `translateX(0vw)`;
  }, [focusViewIndex]);

  return (
    <div className="ordino-filmstrip flex-grow-1 align-content-stretch" style={{ transform: translateDistance }}>
      {workbenches.map((v, index) => {
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
            // eslint-disable-next-line react/no-array-index-key
            key={index}
          />
        );
      })}
    </div>
  );
}
