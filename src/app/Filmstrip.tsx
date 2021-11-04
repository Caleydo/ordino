import * as React from 'react';
import {Workbench} from './Workbench';
import {DummyWorkbench} from './DummyWorkbench';
import {useAppSelector} from '../hooks';


export enum EWorkbenchType {
    PREVIOUS = 't-previous',
    FOCUS = 't-focus',
    FOCUS_CHOOSER = 't-focus-chooser',
    CONTEXT = 't-context',
    NEXT = 't-next'
}

export function Filmstrip() {
    const ordino = useAppSelector((state) => state.ordino);
    const isLastFocused = ordino.focusViewIndex === ordino.workbenches.length - 1;

    return (
        <div className="ordino-filmstrip">
            {ordino.workbenches.map((w) => {

                let type = EWorkbenchType.PREVIOUS;
                let styles = {};

                if (ordino.focusViewIndex === w.index + 1) {
                    type = EWorkbenchType.CONTEXT;

                } else if (ordino.focusViewIndex === w.index) {
                    type = EWorkbenchType.FOCUS;
                    if (ordino.focusViewIndex === 0) {
                        styles = {marginLeft: `calc(${ordino.focusViewIndex * -1}*100vw)`};
                    }

                } else if (w.index > ordino.focusViewIndex) {
                    type = EWorkbenchType.NEXT;
                }

                if (w.index === 0 && ordino.focusViewIndex !== w.index) {
                    styles = w.index === 0 ? {marginLeft: `calc(${ordino.focusViewIndex * -1} * 100vw + 100vw)`} : {};
                }

                return (
                    <Workbench type={type} style={styles} workbench={w} key={`wb${w.index}`} />
                );
            })}

            { isLastFocused ? (
                <DummyWorkbench view={null} key={'chooserOnlyView'} />
            ) : null}
        </div>
    );
}
