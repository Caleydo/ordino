import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { I18nextManager } from 'tdp_core';
import { animated, easings, useSpring } from 'react-spring';
import { IWorkbench, setAnimating, trrack, useTrrackSelector } from '../../store';
import { useAppSelector } from '../../hooks/useAppSelector';
import { FilterAndSelected } from './FilterAndSelected';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { ChevronSvg } from './ChevronSvg';
import { isFirstWorkbench, isFocusWorkbench, isNextWorkbench } from '../../store/storeUtils';
import { changeFocus, removeWorkbench } from '../../store/ordinoTrrackedSlice';
import { isRootNode } from '@trrack/core';

export interface IChevronProps {
  first?: boolean;
  flexWidth?: number;
  onClick?: () => void;
  color?: string;
  workbench?: IWorkbench;
  hideText?: boolean;
}

export function Chevron({ first = false, flexWidth = 1, onClick = null, color = 'cornflowerblue', workbench = null, hideText = false }: IChevronProps) {
  const midTransition = useAppSelector((state) => state.ordinoTracked.midTransition);
  const dispatch = useAppDispatch();
  const currentTrrackNode = useTrrackSelector((state) => state.current);
  const [width, setWidth] = useState<number>();

  const animatedStyle = useSpring({
    onStart: () => {
      dispatch(setAnimating(true));
    },
    onRest: () => {
      dispatch(setAnimating(false));
    },
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

  return (
    <animated.div
      className={`text-truncate position-relative d-flex justify-content-center ${onClick ? 'cursor-pointer' : ''}`}
      ref={ref}
      style={{ ...animatedStyle, flexBasis: 0 }}
      onClick={onClick}
      title={
        !isFocusWorkbench(workbench) && !(isNextWorkbench(workbench) && midTransition)
          ? I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.workbenchName', { workbenchName: workbench.name })
          : null
      }
    >
      {isFocusWorkbench(workbench) || (isNextWorkbench(workbench) && midTransition) ? (
        <div className={`text-truncate chevronDiv d-flex flex-grow-1 ${isFirstWorkbench(workbench) ? 'ms-2' : 'ms-3'}`} style={{ flexBasis: 0 }}>
          <p className="chevronText text-truncate flex-grow-1">
            {I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.workbenchName', { workbenchName: workbench.name })}
          </p>
          <div
            className="flex-grow-1"
            style={{
              pointerEvents: 'auto',
            }}
          >
            <button
              className={`btn chevronText btn-icon-gray text-white shadow-none transition-one ${
                isRootNode(trrack.graph.backend.nodes[currentTrrackNode]) ? 'disabled' : ''
              }`}
              type="button"
              disabled={isRootNode(trrack.graph.backend.nodes[currentTrrackNode])}
              onClick={() => trrack.undo()}
            >
              <i className="fas fa-undo" />
            </button>
            <button
              className={`btn chevronText btn-icon-gray text-white shadow-none transition-one ${
                trrack.graph.backend.nodes[currentTrrackNode].children.length === 0 ? 'disabled' : ''
              }`}
              type="button"
              disabled={trrack.graph.backend.nodes[currentTrrackNode].children.length === 0}
              onClick={() => trrack.redo()}
            >
              <i className="fas fa-redo" />
            </button>
          </div>
        </div>
      ) : null}

      <div className="me-2 ms-2 text-truncate chevronDiv justify-content-center d-flex" style={{ flexBasis: 0, flexGrow: 2 }}>
        {isFocusWorkbench(workbench) && !animatedStyle.flexGrow.isAnimating ? (
          <FilterAndSelected />
        ) : !isFocusWorkbench(workbench) && !hideText && !(isNextWorkbench(workbench) && midTransition) ? (
          <p className="text-center text-truncate chevronText flex-grow-1 justify-content-center">{workbench.name}</p>
        ) : null}
      </div>

      {isFocusWorkbench(workbench) || (isNextWorkbench(workbench) && midTransition) ? (
        <div className={`${!hideText ? 'me-2' : ''} chevronDiv flex-grow-1 d-flex justify-content-end`} style={{ flexBasis: 0 }}>
          <button
            type="button"
            className={`${isFirstWorkbench(workbench) ? 'd-none' : ''} btn-close btn-close-white me-2 pe-auto`}
            aria-label={I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.close')}
            onClick={() => {
              dispatch(changeFocus({ index: workbench.index - 1 }));
              dispatch(removeWorkbench({ index: workbench.index }));
            }}
          />
        </div>
      ) : null}

      <ChevronSvg color={color} width={width} isFirst={first} isClickable={!!onClick} />
    </animated.div>
  );
}
