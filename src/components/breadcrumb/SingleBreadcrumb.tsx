import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { I18nextManager } from 'tdp_core';
import { changeFocus, IWorkbench, removeWorkbench, setCommentsOpen } from '../../store';
import { ChevronBreadcrumb } from './ChevronBreadcrumb';
import { ShowDetailsSwitch } from './ShowDetailsSwitch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { FilterAndSelected } from './FilterAndSelected';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { OpenCommentsButton } from './OpenCommentsButton';

export interface ISingleBreadcrumbProps {
  first?: boolean;
  flexWidth?: number;
  onClick?: () => void;
  color?: string;
  workbench?: IWorkbench;
}

export function SingleBreadcrumb({ first = false, flexWidth = 1, onClick = null, color = 'cornflowerblue', workbench = null }: ISingleBreadcrumbProps) {
  const ordino = useAppSelector((state) => state.ordino);
  const dispatch = useAppDispatch();
  const [width, setWidth] = useState<number>();

  const ref = useRef(null);

  useEffect(() => {
    const ro = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      entries.forEach((e) => {
        setWidth(e.contentRect.width);
      });
    });

    ro.observe(ref.current);

    return () => ro.disconnect();
  }, []);

  const onCommentPanelVisibilityChanged = React.useCallback(
    (isOpen: boolean) => dispatch(setCommentsOpen({ workbenchIndex: workbench?.index, isOpen })),
    [workbench?.index, dispatch],
  );

  return (
    <div className={`position-relative ${onClick ? 'cursor-pointer' : ''}`} ref={ref} style={{ flexGrow: flexWidth }} onClick={onClick}>
      <div className="position-absolute chevronDiv top-50 start-50 translate-middle d-flex">
        {workbench ? (
          workbench.index === ordino.focusWorkbenchIndex ? (
            <>
              <FilterAndSelected />
              <OpenCommentsButton
                idType={workbench.itemIDType}
                selection={workbench.selection}
                commentPanelVisible={workbench.commentsOpen}
                onCommentPanelVisibilityChanged={onCommentPanelVisibilityChanged}
              />
            </>
          ) : (
            <p className="chevronText flex-grow-1">{workbench.name.slice(0, 5)}</p>
          )
        ) : (
          <div className="flex-grow-1 chevronText d-flex align-items-center">
            <i className="fas fa-cog pe-2" />
            <p className="text-nowrap w-100 flex-grow-1 m-0 p-0">Add Views</p>
          </div>
        )}
      </div>

      <div className="position-absolute chevronDiv top-50 translate-middle-y d-flex" style={{ left: workbench?.index === 0 ? '5px' : '20px' }}>
        {workbench && workbench.index === ordino.focusWorkbenchIndex ? (
          <p className="chevronText flex-grow-1">
            {I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.workbenchName', { workbenchName: workbench.name })}
          </p>
        ) : null}
      </div>
      <div className="position-absolute chevronDiv top-50 translate-middle-y d-flex" style={{ right: '8px' }}>
        {workbench && workbench.index === ordino.focusWorkbenchIndex ? (
          ordino.focusWorkbenchIndex > 0 ? (
            <button
              type="button"
              className="btn-close btn-close-white me-2"
              aria-label={I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.close')}
              onClick={() => {
                dispatch(changeFocus({ index: workbench.index - 1 }));
                dispatch(removeWorkbench({ index: workbench.index }));
              }}
            />
          ) : null
        ) : null}
      </div>
      <ChevronBreadcrumb color={color} width={width} first={first} />
    </div>
  );
}
