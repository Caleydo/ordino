import * as React from 'react';
import { useMemo } from 'react';
import { Chevron } from './Chevron';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { isBeforeContextWorkbench, isContextWorkbench, isFirstWorkbench, isFocusWorkbench, isNextWorkbench } from '../../store/storeUtils';
import { changeFocus } from '../../store/ordinoTrrackedSlice';

// These units are intended as percentages, and are used as flex width for the breadcrumbs.
// Ideally, SMALL_CHEVRON_WIDTH * CONTEXT_CHEVRON_COUNT = 15, since the context is always 15% of the screen currently
const SMALL_CHEVRON_WIDTH = 5;
const CONTEXT_WIDTH = 15;
const HIDDEN_CHEVRON_WIDTH = 1;
const CHEVRON_TRANSITION_WIDTH = 50;
const FULL_BREADCRUMB_WIDTH = 100;

export function Breadcrumb() {
  const focusIndex = useAppSelector((state) => state.ordinoTracked.focusWorkbenchIndex);
  const workbenches = useAppSelector((state) => state.ordinoTracked.workbenches);
  const midTransition = useAppSelector((state) => state.ordinoTracked.midTransition);
  const colorMap = useAppSelector((state) => state.ordinoTracked.colorMap);

  const dispatch = useAppDispatch();

  const beforeContextCount = useMemo(() => {
    return focusIndex <= 1 ? 0 : focusIndex - 1;
  }, [focusIndex]);

  const afterFocusWidth = useMemo(() => {
    if (workbenches.length - focusIndex - 1 === 0) {
      return 0;
    }
    if (workbenches.length - focusIndex - 1 === 1) {
      return SMALL_CHEVRON_WIDTH;
    }
    return SMALL_CHEVRON_WIDTH + (workbenches.length - focusIndex - 2 * HIDDEN_CHEVRON_WIDTH);
  }, [focusIndex, workbenches.length]);

  const chevrons = useMemo(() => {
    return workbenches.map((workbench) => {
      let flexWidth = 0;

      // Chevrons before our context
      if (isBeforeContextWorkbench(workbench)) {
        flexWidth = HIDDEN_CHEVRON_WIDTH;
      }
      // Our context
      else if (isContextWorkbench(workbench)) {
        flexWidth = midTransition ? HIDDEN_CHEVRON_WIDTH : CONTEXT_WIDTH - beforeContextCount;
      }
      // Current chevron
      else if (isFocusWorkbench(workbench)) {
        flexWidth = midTransition
          ? // if transitioning use that width
            CHEVRON_TRANSITION_WIDTH - (isFirstWorkbench(workbench) ? 0 : beforeContextCount + 1)
          : // Otherwise figure out how big the current should be
            FULL_BREADCRUMB_WIDTH - CONTEXT_WIDTH - afterFocusWidth;
      }
      // Chevron immediately after our current. Could be half width if we are transitioning.
      else if (isNextWorkbench(workbench)) {
        flexWidth = midTransition
          ? // if Transitioning use transition width
            CHEVRON_TRANSITION_WIDTH
          : // Otherwise just a small chevron
            SMALL_CHEVRON_WIDTH;
      }
      // Chevrons after our current + 1
      else {
        flexWidth = HIDDEN_CHEVRON_WIDTH;
      }

      return (
        <Chevron
          key={workbench.index}
          workbench={workbench}
          color={colorMap[workbench.entityId]}
          flexWidth={flexWidth}
          hideText={flexWidth === HIDDEN_CHEVRON_WIDTH}
          first={isFirstWorkbench(workbench)}
          onClick={!isFocusWorkbench(workbench) || midTransition ? () => dispatch(changeFocus({ index: workbench.index })) : null}
        />
      );
    });
  }, [afterFocusWidth, beforeContextCount, colorMap, midTransition, dispatch, workbenches]);
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{workbenches.length > 0 ? <div className="ms-1 me-1 d-flex breadcrumb overflow-hidden">{chevrons}</div> : null}</>
  );
}
