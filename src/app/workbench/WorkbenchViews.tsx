import * as React from 'react';
import SplitPane from 'react-split-pane';
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

  let wb = null;

  // TODO:: Figure out better way to not force a remount of the individual views because of reparenting here. Currently the empty split panes are doing that.
  if (views.length === 1 || type !== EWorkbenchType.FOCUS) {
    wb = (
      <SplitPane
        split={ordino.workbenches[ordino.focusWorkbenchIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal'}
        primary="second"
        className=""
        minSize={300}
        size="0%"
      >
        <SplitPane
          split={ordino.workbenches[ordino.focusWorkbenchIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'}
          primary="second"
          className=""
          minSize={300}
          size="0%"
        >
          <WorkbenchView key={`wbView${views[0].uniqueId}`} workbenchIndex={index} view={views[0]} />
        </SplitPane>
        <SplitPane
          split={ordino.workbenches[ordino.focusWorkbenchIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'}
          primary="second"
          className=""
          minSize={300}
          size="0%"
        />
      </SplitPane>
    );
  } else if (views.length === 2) {
    wb = (
      <SplitPane
        split={ordino.workbenches[ordino.focusWorkbenchIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal'}
        primary="second"
        className=""
        minSize={300}
        size="50%"
      >
        <SplitPane
          split={ordino.workbenches[ordino.focusWorkbenchIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'}
          primary="second"
          className=""
          minSize={300}
          size="0%"
        >
          <WorkbenchView key={`wbView${views[0].uniqueId}`} workbenchIndex={index} view={views[0]} />
        </SplitPane>
        <SplitPane
          split={ordino.workbenches[ordino.focusWorkbenchIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'}
          primary="second"
          className=""
          minSize={300}
          size="0%"
        >
          <WorkbenchView key={`wbView${views[1].uniqueId}`} workbenchIndex={index} view={views[1]} />
        </SplitPane>
      </SplitPane>
    );
  } else if (views.length === 3) {
    wb = (
      <SplitPane
        split={ordino.workbenches[ordino.focusWorkbenchIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal'}
        primary="second"
        className=""
        minSize={300}
        size="50%"
      >
        <SplitPane
          split={ordino.workbenches[ordino.focusWorkbenchIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'}
          primary="second"
          className=""
          minSize={300}
          size="0%"
        >
          <WorkbenchView key={`wbView${views[0].uniqueId}`} workbenchIndex={index} view={views[0]} />
        </SplitPane>
        <SplitPane
          split={ordino.workbenches[ordino.focusWorkbenchIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'}
          primary="second"
          className=""
          minSize={300}
          size="50%"
        >
          <WorkbenchView key={`wbView${views[1].uniqueId}`} workbenchIndex={index} view={views[1]} />
          <WorkbenchView key={`wbView${views[2].uniqueId}`} workbenchIndex={index} view={views[2]} />
        </SplitPane>
      </SplitPane>
    );
  } else {
    wb = (
      <SplitPane
        split={ordino.workbenches[ordino.focusWorkbenchIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal'}
        primary="second"
        className=""
        minSize={300}
        size="50%"
      >
        <SplitPane
          split={ordino.workbenches[ordino.focusWorkbenchIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'}
          primary="second"
          className=""
          minSize={300}
          size="50%"
        >
          <WorkbenchView key={`wbView${views[0].uniqueId}`} workbenchIndex={index} view={views[0]} />
          <WorkbenchView key={`wbView${views[3].uniqueId}`} workbenchIndex={index} view={views[3]} />
        </SplitPane>
        <SplitPane
          split={ordino.workbenches[ordino.focusWorkbenchIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'}
          primary="second"
          className=""
          minSize={300}
          size="50%"
        >
          <WorkbenchView key={`wbView${views[1].uniqueId}`} workbenchIndex={index} view={views[1]} />
          <WorkbenchView key={`wbView${views[2].uniqueId}`} workbenchIndex={index} view={views[2]} />
        </SplitPane>
      </SplitPane>
    );
  }

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
          {wb}
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
