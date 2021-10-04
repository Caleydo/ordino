import {ProvenanceGraph} from 'phovea_core';
import React, {ReactNode} from 'react';
import {AView, EViewMode, ISelection, ViewWrapper} from 'tdp_core';
import {MODE_ANIMATION_TIME} from './constants';

const modeViewClass = (mode: EViewMode) => {
    switch (mode) {
        case EViewMode.HIDDEN:
            return 't-hide';
        case EViewMode.FOCUS:
            return 't-focus';
        case EViewMode.CONTEXT:
            return 't-context';
    }
};


interface IOrdinoViewWrapperProps {
    graph: ProvenanceGraph;
    wrapper: ViewWrapper;
    onSelectionChanged: (viewWrapper: ViewWrapper, oldSelection: ISelection, newSelection: ISelection, options?: any) => void;
    children?: ReactNode;
}

export function OrdinoViewWrapper({
    graph,
    wrapper,
    children,
    onSelectionChanged
}: IOrdinoViewWrapperProps) {
    const ref = React.useRef<HTMLDivElement>(null);
    const [viewMode, setViewMode] = React.useState(EViewMode.FOCUS);
    const [initialized, setInitialized] = React.useState(false);

    React.useEffect(() => {
        const listener = () => setInitialized(true);

        wrapper.on(ViewWrapper.EVENT_VIEW_INITIALIZED, listener);
        ref.current.appendChild(wrapper.node);
        return () => {
            wrapper.off(ViewWrapper.EVENT_VIEW_INITIALIZED, listener);
        };
    }, [wrapper]);


    React.useEffect(() => {
        // listen to mode changed

        const modeChangedListener = (_event, currentMode: EViewMode, _previousMode: EViewMode) => {
            setViewMode(currentMode);
        };

        wrapper.on(ViewWrapper.EVENT_MODE_CHANGED, modeChangedListener);

        return () => {
            wrapper.off(ViewWrapper.EVENT_MODE_CHANGED, modeChangedListener);
        };
    }, []);

    React.useEffect(() => {
        if (!initialized) {
            return;
        }

        // listen to selection
        const selectionListener = (_, oldSelection: ISelection, newSelection: ISelection) => {

            onSelectionChanged(wrapper, oldSelection, newSelection);
        };

        wrapper.getInstance().on(AView.EVENT_ITEM_SELECT, selectionListener);

        return () => {
            wrapper.getInstance()?.off(AView.EVENT_ITEM_SELECT, selectionListener);
            // wrapper.off(ViewWrapper.EVENT_MODE_CHANGED, modeChangedListener);
        };
    }, [initialized]);

    React.useEffect(() => {
        const listener = () => setInitialized(true);

        wrapper.on(ViewWrapper.EVENT_VIEW_INITIALIZED, listener);
        ref.current.appendChild(wrapper.node);
        return () => {
            wrapper.off(ViewWrapper.EVENT_VIEW_INITIALIZED, listener);
        };
    }, [wrapper]);

    React.useEffect(() => {

        if (viewMode === EViewMode.FOCUS) {
            const prev = (ref.current).previousSibling as HTMLElement;
            const scrollToPos = prev ? prev.offsetLeft || 0 : 0;
            const $app = $(ref.current).parent();
            ($app).scrollTo(scrollToPos, 500, {axis: 'x'});
        }

        const instance = wrapper.getInstance();

        if (!instance || typeof (instance).update !== 'function') {
            return;
        }
        setTimeout(() => {
            if ((instance) && typeof (instance).update === 'function') {
                (instance).update();
            }
        }, MODE_ANIMATION_TIME);


    }, [viewMode]);

    const modeClass = modeViewClass(viewMode);
    const activeClass = viewMode === EViewMode.CONTEXT || viewMode === EViewMode.FOCUS ? 't-active' : '';


    return <div className={`viewWrapper ${modeClass} ${activeClass}`} ref={ref}>
        {children && <div>
            {children}
        </div>}

    </div>
        ;
}
