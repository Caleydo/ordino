import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../..';
import { IWorkbench } from '../../store';
import { ChevronBreadcrumb } from './ChevronBreadcrumb';

export interface ICollapsedBreadcrumbProps {
  flexWidth?: number;
  color?: string;
  workbenches?: IWorkbench[];
}

export function CollapsedBreadcrumb({ flexWidth = 1, color = 'cornflowerblue', workbenches = null }: ICollapsedBreadcrumbProps) {
  const ordino = useAppSelector((state) => state.ordino);
  const dispatch = useAppDispatch();

  const [width, setWidth] = useState<number>();

  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  });

  return (
    <div className="position-relative" ref={ref} style={{ flexGrow: flexWidth }}>
      <div className="position-absolute chevronDiv top-50 start-50 translate-middle d-flex">
        <i className="flex-grow-1 fas fa-ellipsis-v" />
      </div>
      <ChevronBreadcrumb color={color} width={width} first={false} />
    </div>
  );
}
