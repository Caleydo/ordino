import * as React from 'react';
import { useMemo } from 'react';
import { SingleBreadcrumb } from './SingleBreadcrumb';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { changeFocus } from '../../store';
export const colorPalette = ['#337ab7', '#ec6836', '#75c4c2', '#e9d36c', '#24b466', '#e891ae', '#db933c', '#b08aa6', '#8a6044', '#7b7b7b'];
const SMALL_CHEVRON_WIDTH = 3;
const CONTEXT_CHEVRON_COUNT = 3;
const POST_CHEVRON_COUNT = 2;
const CHEVRON_TRANSITION_WIDTH = 50;
export function Breadcrumb() {
    const ordino = useAppSelector((state) => state.ordino);
    const previousWorkbench = useAppSelector((state) => state.ordino.workbenches[state.ordino.focusWorkbenchIndex - 1]);
    const currentWorkbench = useAppSelector((state) => state.ordino.workbenches[state.ordino.focusWorkbenchIndex]);
    const dispatch = useAppDispatch();
    const startFlexNum = useMemo(() => {
        let counter = 0;
        if (ordino.focusWorkbenchIndex < 4) {
            counter += ordino.focusWorkbenchIndex;
        }
        else {
            counter = 3;
        }
        return counter;
    }, [ordino.focusWorkbenchIndex]);
    const endFlexNum = useMemo(() => {
        let counter = 0;
        if (ordino.focusWorkbenchIndex > ordino.workbenches.length - 4) {
            counter += ordino.workbenches.length - (ordino.focusWorkbenchIndex + 1);
        }
        else {
            counter = 3;
        }
        return counter;
    }, [ordino.workbenches.length, ordino.focusWorkbenchIndex]);
    return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    React.createElement(React.Fragment, null, ordino.workbenches.length > 0 ? (React.createElement("div", { className: "d-flex breadcrumb overflow-hidden" }, ordino.workbenches.map((workbench) => {
        let flexWidth = 0;
        if (workbench.index < ordino.focusWorkbenchIndex) {
            flexWidth = (SMALL_CHEVRON_WIDTH * CONTEXT_CHEVRON_COUNT) / startFlexNum;
        }
        else if (workbench.index === ordino.focusWorkbenchIndex) {
            flexWidth = ordino.midTransition ? (startFlexNum === 0 ? CHEVRON_TRANSITION_WIDTH : 35) : 75 + 5 * (2 - endFlexNum);
        }
        else if (workbench.index === ordino.focusWorkbenchIndex + 1) {
            flexWidth = ordino.midTransition ? CHEVRON_TRANSITION_WIDTH : SMALL_CHEVRON_WIDTH;
        }
        else {
            flexWidth = SMALL_CHEVRON_WIDTH;
        }
        return (React.createElement(SingleBreadcrumb, { key: workbench.index, workbench: workbench, color: ordino.colorMap[workbench.entityId], flexWidth: flexWidth, first: workbench.index === 0, onClick: () => dispatch(changeFocus({ index: workbench.index })) }));
    }))) : null));
}
//# sourceMappingURL=Breadcrumb.js.map