import {debounce} from 'lodash';
import * as React from 'react';
import {Workbench} from './Workbench';
import {useAppSelector} from '../hooks';


export enum EWorkbenchType {
    PREVIOUS = 't-previous',
    FOCUS = 't-focus',
    CONTEXT = 't-context',
    NEXT = 't-next'
}

export function Filmstrip() {
    const ordino = useAppSelector((state) => state.ordino);
    const ref = React.useRef(null);

    const onScrollTo = React.useCallback(debounce((contextRef: React.MutableRefObject<HTMLDivElement>) => {
        ref.current.scrollTo({left: contextRef?.current?.offsetLeft || 0, behavior: 'smooth'});
    }, 500), []);

    return (
        <div ref={ref} className="ordino-filmstrip w-100 flex-grow-1 position-relative d-flex align-content-stretch overflow-auto"
            style={{scrollSnapType: 'x mandatory'}}>
            {ordino.workbenches.map((v) => {
                const focused = ordino.focusViewIndex;
                return (
                    <Workbench
                        type={v.index === focused - 1 ? EWorkbenchType.CONTEXT : v.index === focused ? EWorkbenchType.FOCUS : v.index > focused ? EWorkbenchType.NEXT : EWorkbenchType.PREVIOUS}
                        workbench={v}
                        key={v.index}
                        onScrollTo={onScrollTo} />
                );
            })}
        </div>
    );
}
