import * as React from 'react';
import {useAppDispatch, useAppSelector} from '../..';

export interface IChevronBreadcrumbProps {
    width?: number;
    chevronIndent?: number;
    first?: boolean;
    color?: string;
    margin?: number;
}

export function ChevronBreadcrumb({
    width = 50,
    chevronIndent = 8,
    first = false,
    margin = 4,
    color = 'cornflowerblue'
}: IChevronBreadcrumbProps) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();

    return (
        <svg className={`position-absolute chevronSvg`}>
            {/* <rect width={width} height={30} fill={'cornflowerblue'}/> */}
            {first ?
                <path d={`M 0 0 V 30 H ${width - chevronIndent - margin} l ${chevronIndent} -15 l -${chevronIndent} -15 H -${width - chevronIndent - margin}`} stroke="1px solid black" fill={color}/>
            : <path d={`M 0 0 L ${chevronIndent} 15 L 0 30 H ${width - chevronIndent - margin} l ${chevronIndent} -15 l -${chevronIndent} -15 H -${width - chevronIndent - margin}`} stroke="1px solid black" fill={color}/>}
        </svg>
    );
}
