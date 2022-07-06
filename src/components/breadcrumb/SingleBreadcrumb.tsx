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
    <animated.div className={`position-relative ${onClick ? 'cursor-pointer' : ''}`} ref={ref} style={{ ...animatedStyle }} onClick={onClick}>
      <div className="position-absolute chevronDiv top-50 start-50 translate-middle d-flex">
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
        ) : workbench.index !== ordino.focusWorkbenchIndex ? (
          <p className="chevronText flex-grow-1">{workbench.name.slice(0, 5)}</p>
        ) : null}
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
      <BreadcrumbSvg color={color} width={width} first={first} clickable={!!onClick} />
    </animated.div>
  );
}
