import * as React from 'react';
import {useSelector} from 'react-redux';
import {Workbench} from './Workbench';


export enum EWorkbenchType {
    PREVIOUS = 't-previous',
    FOCUS = 't-focus',
    CONTEXT = 't-context',
    NEXT = 't-next'
}

export function Filmstrip() {
    const ordino: any = useSelector<any>((state) => state.ordino) as any;

    return (
        <div className="ordino-filmstrip w-100 flex-1 position-relative d-flex overflow-auto"
            style={{scrollSnapType: 'x mandatory'}}>
            {ordino.views.map((v) => {
                const focused = ordino.focusViewIndex;

                return (
                    <Workbench
                        type={v.index === focused - 1 ? EWorkbenchType.CONTEXT : v.index === focused ? EWorkbenchType.FOCUS : v.index > focused ? EWorkbenchType.NEXT : EWorkbenchType.PREVIOUS}
                        view={v}
                        key={v.index} />
                );
            })}
        </div>
    );
}
