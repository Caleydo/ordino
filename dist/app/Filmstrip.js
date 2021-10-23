import * as React from 'react';
import { useSelector } from 'react-redux';
import { Workbench } from './Workbench';
import { DummyWorkbench } from './DummyWorkbench';
export function Filmstrip() {
    const ordino = useSelector((state) => state.ordino);
    // const dispatch = useDispatch();
    return (React.createElement("div", { className: "ordino-filmstrip" },
        ordino.views.map((v) => {
            return (React.createElement(Workbench, { type: v.index === 0 && v.index === ordino.focusViewIndex
                    ? 'First'
                    : v.index === ordino.focusViewIndex
                        ? 'Focus'
                        : v.index === ordino.focusViewIndex - 1
                            ? 'Context'
                            : v.index === ordino.focusViewIndex + 1
                                ? 'Next_DVC'
                                : v.index > ordino.focusViewIndex
                                    ? 'Next'
                                    : 'Previous', view: v, key: v.id }));
        }),
        ordino.focusViewIndex === ordino.views.length - 1 ? (React.createElement(DummyWorkbench, { view: null, key: 'chooserOnlyView' })) : null));
}
//# sourceMappingURL=Filmstrip.js.map