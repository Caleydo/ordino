import * as React from 'react';
import { useMemo } from 'react';
import { CollapsedBreadcrumb } from './CollapsedBreadcrumb';
import { SingleBreadcrumb } from './SingleBreadcrumb';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { changeFocus, setCreateNextWorkbenchSidebarOpen, setTransition } from '../../store';

export const colorPalette = ['#337ab7', '#ec6836', '#75c4c2', '#e9d36c', '#24b466', '#e891ae', '#db933c', '#b08aa6', '#8a6044', '#7b7b7b'];

export function Breadcrumb() {
  const ordino = useAppSelector((state) => state.ordino);
  const dispatch = useAppDispatch();

  const startFlexNum = useMemo(() => {
    let counter = 0;
    if (ordino.focusWorkbenchIndex < 4) {
      counter += ordino.focusWorkbenchIndex;
    } else {
      counter = 3;
    }

    return counter;
  }, [ordino.focusWorkbenchIndex]);

  const endFlexNum = useMemo(() => {
    let counter = 0;
    if (ordino.focusWorkbenchIndex > ordino.workbenches.length - 4) {
      counter += ordino.workbenches.length - (ordino.focusWorkbenchIndex + 1);
    } else {
      counter = 3;
    }

    return counter;
  }, [ordino.workbenches.length, ordino.focusWorkbenchIndex]);

  // Obviously change this to the right way of importing these colors
  // always show first, last, context, +, otherwise show ...
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {ordino.workbenches.length > 0 ? (
        <div className="d-flex breadcrumb overflow-hidden">
          {/* Always show the first workbench, if its not the context or the current */}
          {ordino.focusWorkbenchIndex > 1 ? (
            <SingleBreadcrumb
              workbench={ordino.workbenches[0]}
              color={ordino.colorMap[ordino.workbenches[0].entityId]}
              flexWidth={15 / startFlexNum}
              first
              onClick={() => dispatch(changeFocus({ index: 0 }))}
            />
          ) : null}

          {/* In the specific case that there is two workbenches before the current one, show them both. */}
          {ordino.focusWorkbenchIndex === 3 ? (
            <SingleBreadcrumb
              workbench={ordino.workbenches[1]}
              color={ordino.colorMap[ordino.workbenches[1].entityId]}
              flexWidth={15 / startFlexNum}
              first={false}
              onClick={() => dispatch(changeFocus({ index: 1 }))}
            />
          ) : null}

          {/* If there are more than 2 workbenches before my current, show a ... breadcrumb */}
          {ordino.focusWorkbenchIndex > 3 ? <CollapsedBreadcrumb color="gray" flexWidth={15 / startFlexNum} /> : null}

          {/* Always show the context, if there is one */}
          {ordino.focusWorkbenchIndex > 0 ? (
            <SingleBreadcrumb
              workbench={ordino.workbenches[ordino.focusWorkbenchIndex - 1]}
              color={ordino.colorMap[ordino.workbenches[ordino.focusWorkbenchIndex - 1].entityId]}
              flexWidth={15 / startFlexNum}
              first={ordino.focusWorkbenchIndex - 1 === 0}
              onClick={() => dispatch(changeFocus({ index: ordino.focusWorkbenchIndex - 1 }))}
            />
          ) : null}

          {/* Always show the current workbench */}
          <SingleBreadcrumb
            workbench={ordino.workbenches[ordino.focusWorkbenchIndex]}
            color={ordino.colorMap[ordino.workbenches[ordino.focusWorkbenchIndex].entityId]}
            flexWidth={ordino.midTransition ? (startFlexNum === 0 ? 50 : 35) : 75 + 5 * (2 - endFlexNum)}
            first={ordino.focusWorkbenchIndex === 0}
            onClick={ordino.midTransition ? () => dispatch(setTransition(false)) : null}
          />

          {/* Show the next workbench chevron, if there is one. */}
          {ordino.focusWorkbenchIndex + 1 < ordino.workbenches.length ? (
            <SingleBreadcrumb
              workbench={ordino.workbenches[ordino.focusWorkbenchIndex + 1]}
              color={ordino.colorMap[ordino.workbenches[ordino.focusWorkbenchIndex + 1].entityId]}
              flexWidth={ordino.midTransition ? 50 : 5}
              first={false}
              onClick={() => dispatch(changeFocus({ index: ordino.focusWorkbenchIndex + 1 }))}
            />
          ) : null}

          {/* This is for collapsed workbenches if there are too many here to display */}
          {ordino.focusWorkbenchIndex + 3 < ordino.workbenches.length ? <CollapsedBreadcrumb color="gray" flexWidth={5} /> : null}

          {/* This is for the specific case of there being exactly 2 more workbenches after our current, we want to display them both */}
          {ordino.focusWorkbenchIndex + 3 === ordino.workbenches.length ? (
            <SingleBreadcrumb
              workbench={ordino.workbenches[ordino.workbenches.length - 1]}
              color={ordino.colorMap[ordino.workbenches[ordino.workbenches.length - 1].entityId]}
              flexWidth={5}
              first={false}
              onClick={() => dispatch(changeFocus({ index: ordino.workbenches.length - 1 }))}
            />
          ) : null}
        </div>
      ) : null}
    </>
  );
}
