import * as React from 'react';
import {
  Corner,
  getNodeAtPath,
  getOtherDirection,
  getPathToCorner,
  Mosaic,
  MosaicDirection,
  MosaicNode,
  MosaicParent,
  updateTree,
} from 'react-mosaic-component';
import 'react-mosaic-component/react-mosaic-component.css';

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import { useCallback, useState } from 'react';
import { dropRight } from 'lodash';
import { useAppSelector } from '../../hooks/useAppSelector';
import { DetailsSidebar } from './sidebar/DetailsSidebar';
import { WorkbenchView } from './WorkbenchView';
import { useCommentPanel } from './useCommentPanel';
import { CreateNextWorkbenchSidebar } from './sidebar/CreateNextWorkbenchSidebar';

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
  const { views, selection, commentsOpen, itemIDType } = ordino.workbenches[index];
  const [setRef] = useCommentPanel({ selection, itemIDType, commentsOpen, isFocused: type === EWorkbenchType.FOCUS });

  const [mosaicState, setMosaicState] = useState<any>(0);
  const [mosaicViewCount, setMosaicViewCount] = useState<number>(1);

  const [mosaicDrag, setMosaicDrag] = useState<boolean>(false);

  React.useEffect(() => {
    if (views.length > mosaicViewCount) {
      const path = getPathToCorner(mosaicState, Corner.TOP_RIGHT);
      const parent = getNodeAtPath(mosaicState, dropRight(path)) as MosaicParent<number>;
      const destination = getNodeAtPath(mosaicState, path) as MosaicNode<number>;
      const direction: MosaicDirection = parent ? getOtherDirection(parent.direction) : 'row';

      let first: MosaicNode<number>;
      let second: MosaicNode<number>;
      if (direction === 'row') {
        first = destination;
        second = views.length - 1;
      } else {
        first = views.length - 1;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [views.length]);

  const onChangeCallback = useCallback((rootNode: any) => {
    setMosaicState(rootNode);
  }, []);

  const showLeftSidebar = ordino.workbenches[index].detailsSidebarOpen && index > 0 && type === EWorkbenchType.FOCUS;
  const showRightSidebar = ordino.workbenches[index].createNextWorkbenchSidebarOpen && type === EWorkbenchType.FOCUS;
  return (
    <div className="position-relative workbenchWrapper d-flex flex-grow-1">
      <div className="d-flex flex-col w-100">
        {showLeftSidebar ? (
          <div className="d-flex" style={{ width: '400px' }}>
            <DetailsSidebar workbench={ordino.workbenches[index]} />
          </div>
        ) : null}
        <div ref={setRef} className="d-flex flex-grow-1">
          <Mosaic<number>
            renderTile={(id, path) => {
              return <WorkbenchView dragMode={mosaicDrag} workbenchIndex={index} path={path} view={views[id]} setMosaicDrag={setMosaicDrag} />;
            }}
            onChange={onChangeCallback}
            value={mosaicState}
          />
        </div>
        {showRightSidebar ? (
          <div className="d-flex" style={{ width: '400px' }}>
            <CreateNextWorkbenchSidebar workbench={ordino.workbenches[index]} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
