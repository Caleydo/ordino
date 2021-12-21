import * as React from 'react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../..';
export function ShowDetailsSwitch({ height = 30 }) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    return (React.createElement("div", { className: "form-check form-switch align-middle m-1" },
        React.createElement("input", { className: "form-check-input checked", type: "checkbox", id: "flexSwitchCheckChecked" }),
        React.createElement("label", { className: "form-check-label", htmlFor: "flexSwitchCheckChecked" }, "Show Details")));
}
//# sourceMappingURL=ShowDetailsSwitch.js.map