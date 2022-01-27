import {debounce} from 'lodash';
import * as React from 'react';
import {Workbench} from './Workbench';
import {useAppSelector} from '../hooks';
import {useMemo} from 'react';


export enum EWorkbenchType {
    PREVIOUS = 't-previous',
    FOCUS = 't-focus',
    CONTEXT = 't-context',
    NEXT = 't-next'
}

export const focusViewWidth = 85; // viewport width (vw)
export const contextViewWidth = 15; // viewport width (vw)

export function Filmstrip() {
    const ordino = useAppSelector((state) => state.ordino);
    const translateDistance = useMemo(() => {
        if(ordino.focusViewIndex > 1) {
            return `translateX(${(ordino.focusViewIndex - 1) * -contextViewWidth}vw)`;
        } else {
            return `translateX(0vw)`;
        }
    }, [ordino.focusViewIndex]);

    return (
        <div className="ordino-filmstrip flex-grow-1 align-content-stretch" style={{transform: translateDistance}}>
            {ordino.workbenches.map((v, index) => {
                const focused = ordino.focusViewIndex;
                return (
                    <Workbench
                        type={v.index === focused - 1 ? EWorkbenchType.CONTEXT : v.index === focused ? EWorkbenchType.FOCUS : v.index > focused ? EWorkbenchType.NEXT : EWorkbenchType.PREVIOUS}
                        workbench={v}
                        key={index}
                    />
                );
            })}
        </div>
    );
}
