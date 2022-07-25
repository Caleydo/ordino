import * as React from 'react';
import { useMemo } from 'react';
import { Chevron } from './Chevron';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { changeFocus } from '../../store';
import { isBeforeContextWorkbench, isContextWorkbench, isFirstWorkbench, isFocusWorkbench, isNextWorkbench } from '../../store/storeUtils';
// These units are intended as percentages, and are used as flex width for the breadcrumbs.
// Ideally, SMALL_CHEVRON_WIDTH * CONTEXT_CHEVRON_COUNT = 15, since the context is always 15% of the screen currently
const SMALL_CHEVRON_WIDTH = 5;
const CONTEXT_WIDTH = 15;
const HIDDEN_CHEVRON_WIDTH = 1;
const CHEVRON_TRANSITION_WIDTH = 50;
const FULL_BREADCRUMB_WIDTH = 100;
export function Breadcrumb() {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    const beforeContextCount = useMemo(() => {
        return ordino.focusWorkbenchIndex <= 1 ? 0 : ordino.focusWorkbenchIndex - 1;
    }, [ordino.focusWorkbenchIndex]);
    const afterFocusWidth = useMemo(() => {
        if (ordino.workbenches.length - ordino.focusWorkbenchIndex - 1 === 0) {
            return 0;
        }
        if (ordino.workbenches.length - ordino.focusWorkbenchIndex - 1 === 1) {
            return SMALL_CHEVRON_WIDTH;
        }
        return SMALL_CHEVRON_WIDTH + (ordino.workbenches.length - ordino.focusWorkbenchIndex - 2 * HIDDEN_CHEVRON_WIDTH);
    }, [ordino.focusWorkbenchIndex, ordino.workbenches.length]);
    const chevrons = useMemo(() => {
        return ordino.workbenches.map((workbench) => {
            let flexWidth = 0;
            // Chevrons before our context
            if (isBeforeContextWorkbench(workbench)) {
                flexWidth = HIDDEN_CHEVRON_WIDTH;
            }
            // Our context
            else if (isContextWorkbench(workbench)) {
                flexWidth = ordino.midTransition ? HIDDEN_CHEVRON_WIDTH : CONTEXT_WIDTH - beforeContextCount;
            }
            // Current chevron
            else if (isFocusWorkbench(workbench)) {
                flexWidth = ordino.midTransition
                    ? // if transitioning use that width
                        CHEVRON_TRANSITION_WIDTH - (isFirstWorkbench(workbench) ? 0 : beforeContextCount + 1)
                    : // Otherwise figure out how big the current should be
                        FULL_BREADCRUMB_WIDTH - CONTEXT_WIDTH - afterFocusWidth;
            }
            // Chevron immediately after our current. Could be half width if we are transitioning.
            else if (isNextWorkbench(workbench)) {
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
            return (React.createElement(Chevron, { key: workbench.index, workbench: workbench, color: ordino.colorMap[workbench.entityId], flexWidth: flexWidth, hideText: flexWidth === HIDDEN_CHEVRON_WIDTH, first: isFirstWorkbench(workbench), onClick: !isFocusWorkbench(workbench) || ordino.midTransition ? () => dispatch(changeFocus({ index: workbench.index })) : null }));
        });
    }, [afterFocusWidth, beforeContextCount, ordino.colorMap, ordino.midTransition, dispatch, ordino.workbenches]);
    return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    React.createElement(React.Fragment, null, ordino.workbenches.length > 0 ? React.createElement("div", { className: "ms-1 me-1 d-flex breadcrumb overflow-hidden" }, chevrons) : null));
}
//# sourceMappingURL=Breadcrumb.js.map