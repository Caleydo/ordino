import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { I18nextManager } from 'tdp_core';
import { animated, easings, useSpring } from 'react-spring';
import { changeFocus, IWorkbench, removeWorkbench, setCommentsOpen } from '../../store';
import { useAppSelector } from '../../hooks/useAppSelector';
import { FilterAndSelected } from './FilterAndSelected';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { OpenCommentsButton } from './OpenCommentsButton';
import { BreadcrumbSvg } from './BreadcrumbSvg';

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

  const animatedStyle = useSpring({
    flexGrow: flexWidth,
    config: { duration: 700, easing: easings.easeInOutSine },
  });

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
    <animated.div
      className={`text-truncate position-relative d-flex justify-content-center ${onClick ? 'cursor-pointer' : ''}`}
      ref={ref}
      style={{ ...animatedStyle, flexBasis: 0 }}
      onClick={onClick}
      title={
        workbench.index !== ordino.focusWorkbenchIndex && !(workbench.index === ordino.focusWorkbenchIndex + 1 && ordino.midTransition)
          ? I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.workbenchName', { workbenchName: workbench.name })
          : null
      }
    >
      {workbench.index === ordino.focusWorkbenchIndex || (workbench.index === ordino.focusWorkbenchIndex + 1 && ordino.midTransition) ? (
        <div className="text-truncate chevronDiv d-flex flex-grow-1" style={{ flexBasis: 0, marginLeft: workbench.index === 0 ? '.75rem' : '1.5rem' }}>
          <p className="chevronText text-truncate flex-grow-1">
            {I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.workbenchName', { workbenchName: workbench.name })}
          </p>
        </div>
      ) : null}

      <div className="me-2 ms-2 text-truncate chevronDiv justify-content-center d-flex" style={{ flexBasis: 0, flexGrow: 2 }}>
        {workbench.index === ordino.focusWorkbenchIndex && !animatedStyle.flexGrow.isAnimating ? (
          <>
            <FilterAndSelected />
            <OpenCommentsButton
              idType={workbench.itemIDType}
              selection={workbench.selection}
              commentPanelVisible={workbench.commentsOpen}
              onCommentPanelVisibilityChanged={onCommentPanelVisibilityChanged}
            />
          </>
        ) : workbench.index !== ordino.focusWorkbenchIndex && flexWidth > 0 && !ordino.midTransition ? (
          <p className="text-center text-truncate chevronText flex-grow-1 justify-content-center">{workbench.name}</p>
        ) : null}
      </div>

      {workbench.index === ordino.focusWorkbenchIndex || (workbench.index === ordino.focusWorkbenchIndex + 1 && ordino.midTransition) ? (
        <div className={`${flexWidth > 0 ? 'me-2' : ''} chevronDiv flex-grow-1 d-flex justify-content-end`} style={{ flexBasis: 0 }}>
          <button
            type="button"
            className={`${workbench.index === 0 ? 'd-none' : ''} btn-close btn-close-white me-2 pe-auto`}
            aria-label={I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.close')}
            onClick={() => {
              dispatch(changeFocus({ index: workbench.index - 1 }));
              dispatch(removeWorkbench({ index: workbench.index }));
            }}
          />
        </div>
      ) : null}

      <BreadcrumbSvg color={color} width={width} isFirst={first} isClickable={!!onClick} />
    </animated.div>
  );
}
