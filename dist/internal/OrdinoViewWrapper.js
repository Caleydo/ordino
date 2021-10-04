import React from 'react';
import { AView, EViewMode, ViewWrapper } from 'tdp_core';
import { MODE_ANIMATION_TIME } from './constants';
const modeViewClass = (mode) => {
    switch (mode) {
        case EViewMode.HIDDEN:
            return 't-hide';
        case EViewMode.FOCUS:
            return 't-focus';
        case EViewMode.CONTEXT:
            return 't-context';
    }
};
export function OrdinoViewWrapper({ graph, wrapper, children, onSelectionChanged }) {
    const ref = React.useRef(null);
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
        const modeChangedListener = (_event, currentMode, _previousMode) => {
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
        const selectionListener = (_, oldSelection, newSelection) => {
            onSelectionChanged(wrapper, oldSelection, newSelection);
        };
        wrapper.getInstance().on(AView.EVENT_ITEM_SELECT, selectionListener);
        return () => {
            var _a;
            (_a = wrapper.getInstance()) === null || _a === void 0 ? void 0 : _a.off(AView.EVENT_ITEM_SELECT, selectionListener);
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
            const prev = (ref.current).previousSibling;
            const scrollToPos = prev ? prev.offsetLeft || 0 : 0;
            const $app = $(ref.current).parent();
            ($app).scrollTo(scrollToPos, 500, { axis: 'x' });
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
    return React.createElement("div", { className: `viewWrapper ${modeClass} ${activeClass}`, ref: ref }, children && React.createElement("div", null, children));
}
//# sourceMappingURL=OrdinoViewWrapper.js.map