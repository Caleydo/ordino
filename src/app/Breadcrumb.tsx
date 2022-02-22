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
  const [totalWidth, setTotalWidth] = useState<number>(0);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setTotalWidth(window.innerWidth);
    });
  }, []);

  const startFlexNum = useMemo(() => {
    let counter = 0;
    if (ordino.focusViewIndex < 4) {
      counter += ordino.focusViewIndex;
    } else {
      counter = 3;
    }

    return counter;
  }, [ordino.focusViewIndex]);

  const endFlexNum = useMemo(() => {
    let counter = 0;
    if (ordino.focusViewIndex > ordino.workbenches.length - 4) {
      counter += ordino.workbenches.length - (ordino.focusViewIndex + 1);
    } else {
      counter = 3;
    }

    return counter;
  }, [ordino.workbenches.length, ordino.focusViewIndex]);

  // Obviously change this to the right way of importing these colors
  // always show first, last, context, +, otherwise show ...
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {ordino.workbenches.length > 0 ? (
        <div className="d-flex breadcrumb overflow-hidden">
          {ordino.focusViewIndex > 1 ? (
            <SingleBreadcrumb
              workbench={ordino.workbenches[0]}
              color={ordino.colorMap[ordino.workbenches[0].entityId]}
              flexWidth={15 / startFlexNum}
              first
              onClick={() => dispatch(changeFocus({ index: 0 }))}
            />
          ) : null}
          {ordino.focusViewIndex === 3 ? (
            <SingleBreadcrumb
              workbench={ordino.workbenches[1]}
              color={ordino.colorMap[ordino.workbenches[1].entityId]}
              flexWidth={15 / startFlexNum}
              first={false}
              onClick={() => dispatch(changeFocus({ index: 1 }))}
            />
          ) : null}
          {ordino.focusViewIndex > 3 ? <CollapsedBreadcrumb color="gray" flexWidth={15 / startFlexNum} /> : null}
          {ordino.focusViewIndex > 0 ? (
            <SingleBreadcrumb
              workbench={ordino.workbenches[ordino.focusViewIndex - 1]}
              color={ordino.colorMap[ordino.workbenches[ordino.focusViewIndex - 1].entityId]}
              flexWidth={15 / startFlexNum}
              first={ordino.focusViewIndex - 1 === 0}
              onClick={() => dispatch(changeFocus({ index: ordino.focusViewIndex - 1 }))}
            />
          ) : null}

          <SingleBreadcrumb
            workbench={ordino.workbenches[ordino.focusViewIndex]}
            color={ordino.colorMap[ordino.workbenches[ordino.focusViewIndex].entityId]}
            flexWidth={70 + 5 * (2 - endFlexNum)}
            first={ordino.focusViewIndex === 0}
            onClick={() => dispatch(changeFocus({ index: ordino.focusViewIndex }))}
          />

          <SingleBreadcrumb
            color="gray"
            flexWidth={3}
            onClick={() =>
              dispatch(setAddWorkbenchOpen({ workbenchIndex: ordino.focusViewIndex, open: !ordino.workbenches[ordino.focusViewIndex].addWorkbenchOpen }))
            }
            first={false}
          />

          {ordino.focusViewIndex + 1 < ordino.workbenches.length ? (
            <SingleBreadcrumb
              workbench={ordino.workbenches[ordino.focusViewIndex + 1]}
              color={ordino.colorMap[ordino.workbenches[ordino.focusViewIndex + 1].entityId]}
              flexWidth={5}
              first={false}
              onClick={() => dispatch(changeFocus({ index: ordino.focusViewIndex + 1 }))}
            />
          ) : null}

          {ordino.focusViewIndex + 3 < ordino.workbenches.length ? <CollapsedBreadcrumb color="gray" flexWidth={5} /> : null}

          {ordino.focusViewIndex + 3 === ordino.workbenches.length ? (
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
