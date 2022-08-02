import * as React from 'react';
import {
  Corner,
  createRemoveUpdate,
  getNodeAtPath,
  getOtherDirection,
  getPathToCorner,
  Mosaic,
  MosaicDirection,
  MosaicNode,
  MosaicParent,
  MosaicPath,
  updateTree,
} from 'react-mosaic-component';

import { useCallback, useState } from 'react';
import { dropRight } from 'lodash';
import { useAppSelector } from '../../hooks/useAppSelector';
import { WorkbenchView } from './WorkbenchView';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCommentsOpen } from '../../store/ordinoSlice';

export enum EWorkbenchType {
  PREVIOUS = 't-previous',
  FOCUS = 't-focus',
  CONTEXT = 't-context',
  NEXT = 't-next',
}
export interface IWorkbenchViewsProps {
  index: number;
  type: EWorkbenchType;
}

export function WorkbenchViews({ index, type }: IWorkbenchViewsProps) {
  const ordino = useAppSelector((state) => state.ordino);

  const { views } = ordino.workbenches[index];


  const [mosaicState, setMosaicState] = useState<MosaicNode<string>>(views[0].uniqueId);
  const [mosaicViewCount, setMosaicViewCount] = useState<number>(1);

  const [mosaicDrag, setMosaicDrag] = useState<boolean>(false);

  const firstViewUniqueId = views[0].uniqueId;
  React.useEffect(() => {
    // reset mosaic to initial state when first view unique id changes
    // e.g., when opening a new workbench with the same idtype
    setMosaicState(firstViewUniqueId);
  }, [firstViewUniqueId]);

  React.useEffect(() => {
    // If a new view got added to the workbench, currently via the "Add View" button, we need to put the view into our mosaic state
    if (views.length > mosaicViewCount) {
      const path = getPathToCorner(mosaicState, ordino.midTransition ? Corner.BOTTOM_RIGHT : Corner.TOP_RIGHT);
      const parent = getNodeAtPath(mosaicState, dropRight(path)) as MosaicParent<string>;
      const destination = getNodeAtPath(mosaicState, path) as MosaicNode<string>;

      const direction: MosaicDirection = parent && parent.direction ? getOtherDirection(parent.direction) : ordino.midTransition ? 'column' : 'row';
      const newViewId: string = views[views.length - 1].uniqueId; // assumes that the new view is appended to the array

      let first: MosaicNode<string>;
      let second: MosaicNode<string>;
      if (direction === 'row') {
        first = destination;
        second = newViewId;
      } else {
        first = ordino.midTransition ? destination : newViewId;
        second = ordino.midTransition ? newViewId : destination;
      }

      const newNode = updateTree(mosaicState, [
        {
          path,
          spec: {
            $set: {
              direction,
              first,
              second,
            },
          },
        },
      ]);

      setMosaicState(newNode);
      setMosaicViewCount(views.length);
    }
  }, [mosaicState, mosaicViewCount, views, ordino.midTransition]);

  const removeCallback = useCallback(
    (path: MosaicPath) => {
      const removeUpdate = createRemoveUpdate(mosaicState, path);

      const newNode = updateTree(mosaicState, [removeUpdate]);

      setMosaicState(newNode);
      setMosaicViewCount(views.length - 1);
    },
    [mosaicState, views],
  );

  const onChangeCallback = useCallback(
    (rootNode: MosaicNode<string>) => {
      setMosaicState(rootNode);
      if (!mosaicDrag) {
        setMosaicDrag(true);
      }
    },
    [mosaicDrag],
  );

  return (
    <div className="position-relative d-flex flex-grow-1">
      <div className="d-flex flex-col w-100">
        <div className="d-flex flex-grow-1">
          <Mosaic<string>
            renderTile={(id, path) => {
              const currView = views.find((v) => v.uniqueId === id);
              if (currView) {
                return <WorkbenchView removeCallback={removeCallback} mosaicDrag={mosaicDrag} workbenchIndex={index} path={path} view={currView} />;
              }
              return null;
            }}
            onChange={onChangeCallback}
            onRelease={() => setMosaicDrag(false)}
            value={ordino.focusWorkbenchIndex === index ? mosaicState : firstViewUniqueId}
          />
        </div>
      </div>
    </div>
  );
}
