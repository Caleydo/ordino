import * as React from 'react';
import {useSelector} from 'react-redux';
import {Workbench} from './Workbench';
import {DummyWorkbench} from './DummyWorkbench';


export enum EWorkbenchType {
    PREVIOUS = 't-previous',
    FOCUS = 't-focus',
    FOCUS_CHOOSER = 't-focus-chooser',
    CONTEXT = 't-context',
    NEXT = 't-next'
}

export function Filmstrip() {
    const ordino: any = useSelector<any>((state) => state.ordino) as any;
    const isLastFocused = ordino.focusViewIndex === ordino.views.length - 1;
    return (
        <div className="ordino-filmstrip">
            {ordino.views.map((v) => {

                let type = EWorkbenchType.PREVIOUS;
                let styles = {};

                if (ordino.focusViewIndex === v.index + 1) {
                    type = EWorkbenchType.CONTEXT;

                } else if (ordino.focusViewIndex === v.index) {
                    type = EWorkbenchType.FOCUS;
                    if (ordino.focusViewIndex === 0) {
                        styles = {marginLeft: `calc(${ordino.focusViewIndex * -1}*100vw)`};
                    }

                } else if (v.index > ordino.focusViewIndex) {
                    type = EWorkbenchType.NEXT;
                }

                if (v.index === 0 && ordino.focusViewIndex !== v.index) {
                    styles = v.index === 0 ? {marginLeft: `calc(${ordino.focusViewIndex * -1} * 100vw + 100vw)`} : {};
                }
                return (
                    <Workbench type={type} style={styles} view={v} key={v.id} />
                );
            })}

            { isLastFocused ? (
                <DummyWorkbench view={null} key={'chooserOnlyView'} />
            ) : null}
        </div>
    );
}
