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
import { IViewPluginDesc, useAsync } from 'tdp_core';
import { useAppSelector } from '../../hooks/useAppSelector';
import { DetailsSidebar } from './sidebar/DetailsSidebar';
import { getVisynView, WorkbenchView } from './WorkbenchView';
import { useCommentPanel } from './useCommentPanel';
import { setView } from '../../store/ordinoSlice';
import { EViewChooserMode, ViewChooser } from '../ViewChooser';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { WorkbenchUtilsSidebar } from './sidebar/WorkbenchUtilsSidebar';

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
  const dispatch = useAppDispatch();

  const { views, selection, commentsOpen, itemIDType } = ordino.workbenches[index];
  const [setRef] = useCommentPanel({ selection, itemIDType, commentsOpen, isFocused: type === EWorkbenchType.FOCUS });

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
      const path = getPathToCorner(mosaicState, Corner.TOP_RIGHT);
      const parent = getNodeAtPath(mosaicState, dropRight(path)) as MosaicParent<string>;
      const destination = getNodeAtPath(mosaicState, path) as MosaicNode<string>;
      const direction: MosaicDirection = parent ? getOtherDirection(parent.direction) : 'row';
      const newViewId: string = views[views.length - 1].uniqueId; // assumes that the new view is appended to the array

      let first: MosaicNode<string>;
      let second: MosaicNode<string>;
      if (direction === 'row') {
        first = destination;
        second = newViewId;
      } else {
        first = newViewId;
        second = destination;
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
  }, [mosaicState, mosaicViewCount, views]);

  const removeCallback = useCallback(
    (path: MosaicPath) => {
      const removeUpdate = createRemoveUpdate(mosaicState, path);

      const newNode = updateTree(mosaicState, [removeUpdate]);

      setMosaicState(newNode);
      setMosaicViewCount(views.length - 1);
    },
    [mosaicState, views],
  );

  const onChangeCallback = useCallback((rootNode: MosaicNode<string>) => {
    setMosaicState(rootNode);
    setMosaicDrag(true);
  }, []);

  // const showLeftSidebar = ordino.workbenches[index].detailsSidebarOpen && index > 0 && type === EWorkbenchType.FOCUS;
  return (
    <div className="position-relative workbenchWrapper d-flex flex-grow-1">
      <div className="d-flex flex-col w-100">
        <WorkbenchUtilsSidebar idk="5" />

        <div ref={setRef} className="d-flex flex-grow-1">
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
