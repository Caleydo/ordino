import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { CollapsedBreadcrumb } from '../components/breadcrumb/CollapsedBreadcrumb';
import { SingleBreadcrumb } from '../components/breadcrumb/SingleBreadcrumb';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { changeFocus, setAddWorkbenchOpen } from '../store/ordinoSlice';

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
          {ordino.focusWorkbenchIndex > 1 ? (
            <SingleBreadcrumb
              workbench={ordino.workbenches[0]}
              color={ordino.colorMap[ordino.workbenches[0].entityId]}
              flexWidth={15 / startFlexNum}
              first
              onClick={() => dispatch(changeFocus({ index: 0 }))}
            />
          ) : null}
          {ordino.focusWorkbenchIndex === 3 ? (
            <SingleBreadcrumb
              workbench={ordino.workbenches[1]}
              color={ordino.colorMap[ordino.workbenches[1].entityId]}
              flexWidth={15 / startFlexNum}
              first={false}
              onClick={() => dispatch(changeFocus({ index: 1 }))}
            />
          ) : null}
          {ordino.focusWorkbenchIndex > 3 ? <CollapsedBreadcrumb color="gray" flexWidth={15 / startFlexNum} /> : null}
          {ordino.focusWorkbenchIndex > 0 ? (
            <SingleBreadcrumb
              workbench={ordino.workbenches[ordino.focusWorkbenchIndex - 1]}
              color={ordino.colorMap[ordino.workbenches[ordino.focusWorkbenchIndex - 1].entityId]}
              flexWidth={15 / startFlexNum}
              first={ordino.focusWorkbenchIndex - 1 === 0}
              onClick={() => dispatch(changeFocus({ index: ordino.focusWorkbenchIndex - 1 }))}
            />
          ) : null}

          <SingleBreadcrumb
            workbench={ordino.workbenches[ordino.focusWorkbenchIndex]}
            color={ordino.colorMap[ordino.workbenches[ordino.focusWorkbenchIndex].entityId]}
            flexWidth={70 + 5 * (2 - endFlexNum)}
            first={ordino.focusWorkbenchIndex === 0}
            onClick={null}
          />

          <SingleBreadcrumb
            color="gray"
            flexWidth={3}
            onClick={() =>
              dispatch(setAddWorkbenchOpen({ workbenchIndex: ordino.focusWorkbenchIndex, open: !ordino.workbenches[ordino.focusWorkbenchIndex].addWorkbenchOpen }))
            }
            first={false}
          />

          {ordino.focusWorkbenchIndex + 1 < ordino.workbenches.length ? (
            <SingleBreadcrumb
              workbench={ordino.workbenches[ordino.focusWorkbenchIndex + 1]}
              color={ordino.colorMap[ordino.workbenches[ordino.focusWorkbenchIndex + 1].entityId]}
              flexWidth={5}
              first={false}
              onClick={() => dispatch(changeFocus({ index: ordino.focusWorkbenchIndex + 1 }))}
            />
          ) : null}

          {ordino.focusWorkbenchIndex + 3 < ordino.workbenches.length ? <CollapsedBreadcrumb color="gray" flexWidth={5} /> : null}

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
