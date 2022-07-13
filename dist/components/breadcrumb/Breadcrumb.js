import * as React from 'react';
import { useMemo } from 'react';
import { SingleBreadcrumb } from './SingleBreadcrumb';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { changeFocus } from '../../store';
// These units are intended as percentages, and are used as flex width for the breadcrumbs.
// Ideally, SMALL_CHEVRON_WIDTH * CONTEXT_CHEVRON_COUNT = 15, since the context is always 15% of the screen currently
const SMALL_CHEVRON_WIDTH = 5;
const HIDDEN_CHEVRON_WIDTH = 1;
const CONTEXT_CHEVRON_COUNT = 3;
const POST_CHEVRON_COUNT = 3;
const CHEVRON_TRANSITION_WIDTH = 50;
const FULL_BREADCRUMB_WIDTH = 100;
export function Breadcrumb() {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    // this number is for finding out how many workbenches are before our current one, so we can give them the right width.
    const startFlexNum = useMemo(() => {
        let counter = 0;
        if (ordino.focusWorkbenchIndex < CONTEXT_CHEVRON_COUNT + 1) {
            counter += ordino.focusWorkbenchIndex;
        }
        else {
            counter = CONTEXT_CHEVRON_COUNT;
        }
        return counter;
    }, [ordino.focusWorkbenchIndex]);
    // this number is for finding out how many workbenches are after our current one, so we can give them the right width.
    const endFlexNum = useMemo(() => {
        let counter = 0;
        if (ordino.focusWorkbenchIndex > ordino.workbenches.length - (POST_CHEVRON_COUNT + 1)) {
            counter += ordino.workbenches.length - (ordino.focusWorkbenchIndex + 1);
        }
        else {
            counter = POST_CHEVRON_COUNT;
        }
        return counter;
    }, [ordino.workbenches.length, ordino.focusWorkbenchIndex]);
    return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    React.createElement(React.Fragment, null, ordino.workbenches.length > 0 ? (React.createElement("div", { className: "d-flex breadcrumb overflow-hidden" }, ordino.workbenches.map((workbench) => {
        let flexWidth = 0;
        // Chevrons before our context
        if (workbench.index < ordino.focusWorkbenchIndex - 1) {
            flexWidth = HIDDEN_CHEVRON_WIDTH;
        }
        // Our context
        else if (workbench.index === ordino.focusWorkbenchIndex - 1) {
            flexWidth = SMALL_CHEVRON_WIDTH;
        }
        // Current chevron
        else if (workbench.index === ordino.focusWorkbenchIndex) {
            flexWidth = ordino.midTransition
                ? // if transitioning use that width
                    CHEVRON_TRANSITION_WIDTH
                : // Otherwise figure out how big the current should be
                    FULL_BREADCRUMB_WIDTH - SMALL_CHEVRON_WIDTH * CONTEXT_CHEVRON_COUNT - SMALL_CHEVRON_WIDTH * endFlexNum;
        }
        // Chevron immediately after our current. Could be half width if we are transitioning.
        else if (workbench.index === ordino.focusWorkbenchIndex + 1) {
            flexWidth = ordino.midTransition
                ? // if Transitioning use transition width
                    CHEVRON_TRANSITION_WIDTH
                : // Otherwise just a small chevron
                    SMALL_CHEVRON_WIDTH;
        }
        // Chevrons after our current + 1
        else {
            flexWidth = HIDDEN_CHEVRON_WIDTH;
        }
        return (React.createElement(SingleBreadcrumb, { key: workbench.index, workbench: workbench, color: ordino.colorMap[workbench.entityId], flexWidth: flexWidth, hideText: flexWidth === HIDDEN_CHEVRON_WIDTH, first: workbench.index === 0, onClick: workbench.index !== ordino.focusWorkbenchIndex || ordino.midTransition ? () => dispatch(changeFocus({ index: workbench.index })) : null }));
    }))) : null));
}
//# sourceMappingURL=Breadcrumb.js.map