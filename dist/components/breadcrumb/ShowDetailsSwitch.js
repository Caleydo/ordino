import * as React from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { setDetailsOpen } from '../../store/ordinoSlice';
export function ShowDetailsSwitch({ height = 30 }) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    return (React.createElement("div", { className: "form-check form-switch align-middle m-1" },
        React.createElement("input", { checked: ordino.workbenches[ordino.focusViewIndex].detailsOpen, onChange: () => dispatch(setDetailsOpen({ workbenchIndex: ordino.focusViewIndex, open: !ordino.workbenches[ordino.focusViewIndex].detailsOpen })), className: "form-check-input checked", type: "checkbox", id: "flexSwitchCheckChecked" }),
        React.createElement("label", { className: "form-check-label", htmlFor: "flexSwitchCheckChecked" }, "Show Details")));
}
//# sourceMappingURL=ShowDetailsSwitch.js.map