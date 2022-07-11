import * as React from 'react';
import { useMemo } from 'react';
import { SingleBreadcrumb } from './SingleBreadcrumb';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { changeFocus } from '../../store';

export const colorPalette = ['#337ab7', '#ec6836', '#75c4c2', '#e9d36c', '#24b466', '#e891ae', '#db933c', '#b08aa6', '#8a6044', '#7b7b7b'];

// These units are intended as percentages, and are used as flex width
const SMALL_CHEVRON_WIDTH = 5;
const CONTEXT_CHEVRON_COUNT = 3;
const POST_CHEVRON_COUNT = 2;
const CHEVRON_TRANSITION_WIDTH = 50;
const FULL_BREADCRUMB_WIDTH = 100;

export function Breadcrumb() {
  const ordino = useAppSelector((state) => state.ordino);

  const dispatch = useAppDispatch();

  // this number is for finding out how many workbenches are before our current one, so we can give them the right width.
  const startFlexNum = useMemo(() => {
    let counter = 0;
    if (ordino.focusWorkbenchIndex < CONTEXT_CHEVRON_COUNT + 1) {
      counter += ordino.focusWorkbenchIndex;
    } else {
      counter = CONTEXT_CHEVRON_COUNT;
    }

    return counter;
  }, [ordino.focusWorkbenchIndex]);

  // this number is for finding out how many workbenches are after our current one, so we can give them the right width.
  const endFlexNum = useMemo(() => {
    let counter = 0;
    if (ordino.focusWorkbenchIndex > ordino.workbenches.length - (POST_CHEVRON_COUNT + 1)) {
      counter += ordino.workbenches.length - (ordino.focusWorkbenchIndex + 1);
    } else {
      counter = POST_CHEVRON_COUNT;
    }

    return counter;
  }, [ordino.workbenches.length, ordino.focusWorkbenchIndex]);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {ordino.workbenches.length > 0 ? (
        <div className="d-flex breadcrumb overflow-hidden">
          {ordino.workbenches.map((workbench) => {
            let flexWidth = 0;

            if (workbench.index < ordino.focusWorkbenchIndex) {
              flexWidth = ordino.midTransition ? 0 : (SMALL_CHEVRON_WIDTH * CONTEXT_CHEVRON_COUNT) / startFlexNum;
            } else if (workbench.index === ordino.focusWorkbenchIndex) {
              flexWidth = ordino.midTransition
                ? CHEVRON_TRANSITION_WIDTH
                : FULL_BREADCRUMB_WIDTH - SMALL_CHEVRON_WIDTH * CONTEXT_CHEVRON_COUNT - SMALL_CHEVRON_WIDTH * (POST_CHEVRON_COUNT - endFlexNum);
            } else if (workbench.index === ordino.focusWorkbenchIndex + 1) {
              flexWidth = ordino.midTransition ? CHEVRON_TRANSITION_WIDTH : SMALL_CHEVRON_WIDTH;
            } else {
              flexWidth = SMALL_CHEVRON_WIDTH;
            }

            return (
              <SingleBreadcrumb
                key={workbench.index}
                workbench={workbench}
                color={ordino.colorMap[workbench.entityId]}
                flexWidth={flexWidth}
                first={workbench.index === 0}
                onClick={
                  workbench.index !== ordino.focusWorkbenchIndex || ordino.midTransition ? () => dispatch(changeFocus({ index: workbench.index })) : null
                }
              />
            );
          })}
        </div>
      ) : null}
    </>
  );
}
