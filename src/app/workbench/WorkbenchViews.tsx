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
import { current } from '@reduxjs/toolkit';
import { useAppSelector } from '../../hooks/useAppSelector';
import { WorkbenchView } from './WorkbenchView';
import { useAppDispatch } from '../../hooks/useAppDispatch';

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

function getAllMosaicNodes(node: MosaicNode<string>, nodes: string[]): string[] {
  if (typeof node === 'string') {
    nodes.push(node);
    return nodes;
  }
  getAllMosaicNodes(node.first, nodes);
  getAllMosaicNodes(node.second, nodes);

  return nodes;
}

function getMosaicPathForNode(node: MosaicNode<string>, target: string, arr: string[]): string[] {
  if (typeof node === 'string' && node === target) {
    return arr;
  }
  if (typeof node !== 'string') {
    const left = getMosaicPathForNode(node.first, target, [...arr, 'first']);
    const right = getMosaicPathForNode(node.second, target, [...arr, 'second']);

    if (left !== null) return left;
    if (right !== null) return right;
  }

  return null;
}

export function WorkbenchViews({ index, type }: IWorkbenchViewsProps) {
  const workbench = useAppSelector((state) => state.ordinoTracked.workbenches[index]);
  const focusIndex = useAppSelector((state) => state.ordinoTracked.focusWorkbenchIndex);

  const midTransition = useAppSelector((state) => state.ordinoTracked.midTransition);

  const dispatch = useAppDispatch();

  const { views, selection, commentsOpen, itemIDType } = workbench;

  // const onCommentPanelVisibilityChanged = React.useCallback(
  //   (isOpen: boolean) => dispatch(setCommentsOpen({ workbenchIndex: index, isOpen })),
  //   [index, dispatch],
  // );
  // const [setRef] = useCommentPanel({ selection, itemIDType, commentsOpen, isFocused: type === EWorkbenchType.FOCUS, onCommentPanelVisibilityChanged });

  const [mosaicState, setMosaicState] = useState<MosaicNode<string>>(views[0].uniqueId);
  const [mosaicViewCount, setMosaicViewCount] = useState<number>(1);

  const [mosaicDrag, setMosaicDrag] = useState<boolean>(false);

  const firstViewUniqueId = views[0].uniqueId;
  React.useEffect(() => {
    // reset mosaic to initial state when first view unique id changes
    // e.g., when opening a new workbench with the same idtype
    setMosaicState(firstViewUniqueId);
  }, [firstViewUniqueId]);

  const addMosaicNode = useCallback(
    (newViewId: string) => {
      console.log('adding');
      const path = getPathToCorner(mosaicState, midTransition ? Corner.BOTTOM_RIGHT : Corner.TOP_RIGHT);
      const parent = getNodeAtPath(mosaicState, dropRight(path)) as MosaicParent<string>;
      const destination = getNodeAtPath(mosaicState, path) as MosaicNode<string>;

      const direction: MosaicDirection = parent && parent.direction ? getOtherDirection(parent.direction) : midTransition ? 'column' : 'row';

      let first: MosaicNode<string>;
      let second: MosaicNode<string>;
      if (direction === 'row') {
        first = destination;
        second = newViewId;
      } else {
        first = midTransition ? destination : newViewId;
        second = midTransition ? newViewId : destination;
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
      setMosaicViewCount(mosaicViewCount + 1);
    },
    [mosaicState, midTransition, mosaicViewCount],
  );

  const removeCallback = useCallback(
    (path: MosaicPath) => {
      const removeUpdate = createRemoveUpdate(mosaicState, path);

      const newNode = updateTree(mosaicState, [removeUpdate]);

      setMosaicState(newNode);
      setMosaicViewCount(views.length - 1);
    },
    [mosaicState, views],
  );

  React.useEffect(() => {
    const currentNodes = getAllMosaicNodes(mosaicState, []);
    const viewIds = views.map((v) => v.uniqueId);
    const viewsToAdd = viewIds.filter((v) => !currentNodes.includes(v));
    const viewsToRemove = currentNodes.filter((n) => !viewIds.includes(n));

    viewsToAdd.forEach((v) => {
      addMosaicNode(v);
    });

    viewsToRemove.forEach((v) => {
      const path = getMosaicPathForNode(mosaicState, v, []);
      removeCallback(path as MosaicPath);
    });
  }, [mosaicState, mosaicViewCount, views, midTransition, addMosaicNode, removeCallback]);

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
                return <WorkbenchView mosaicDrag={mosaicDrag} workbenchIndex={index} path={path} view={currView} />;
              }
              return null;
            }}
            onChange={onChangeCallback}
            onRelease={() => setMosaicDrag(false)}
            value={focusIndex === index ? mosaicState : firstViewUniqueId}
          />
        </div>
      </div>
    </div>
  );
}
