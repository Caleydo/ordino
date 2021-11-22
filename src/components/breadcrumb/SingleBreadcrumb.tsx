import * as React from 'react';
import {useEffect, useState} from 'react';
import {useRef} from 'react';
import {useAppDispatch, useAppSelector} from '../..';
import {IWorkbench} from '../../store';
import {ChevronBreadcrumb} from './ChevronBreadcrumb';

export interface ISingleBreadcrumbProps {
    first?: boolean;
    flexWidth?: number;
    onClick?: () => void;
    color?: string;
    workbench?: IWorkbench;
}

export function SingleBreadcrumb({
    first = false,
    flexWidth = 1,
    onClick = null,
    color = 'cornflowerblue',
    workbench = null,
}: ISingleBreadcrumbProps) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();

    const [width, setWidth] = useState<number>();

    const ref = useRef(null);

    useEffect(() => {
        if(ref.current) {
            setWidth(ref.current.offsetWidth);
        }
    }, );

    return (
        <div className={'position-relative'} ref={ref} style={{flexGrow: flexWidth}} onClick={onClick}>
            <div className={'position-absolute chevronDiv top-50 start-50 translate-middle d-flex'}>
                {workbench
                    ?
                    <p className={'chevronText flex-grow-1'}>{workbench.name}</p>
                    :
                    <i className="flex-grow-1 fas fa-plus"></i>
                    }
            </div>
            <ChevronBreadcrumb color={color} width={width} first={first}/>
        </div>
    );
}
