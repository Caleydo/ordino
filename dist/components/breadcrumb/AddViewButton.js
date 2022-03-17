import React from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { addView } from '../../store/ordinoSlice';
export function AddViewButton({ color = 'cornflowerblue' }) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    return (React.createElement("div", null,
        React.createElement("button", { onClick: () => {
                dispatch(addView({
                    workbenchIndex: ordino.focusViewIndex,
                    view: {
                        name: '',
                        id: '',
                        uniqueId: (Math.random() + 1).toString(36).substring(7),
                        filters: [],
                    },
                }));
            }, type: "button", className: "chevronButton btn btn-text btn-sm align-middle m-1", style: { color } },
            ' ',
            React.createElement("i", { className: "flex-grow-1 fas fa-chart-bar" }),
            " Add View")));
}
//# sourceMappingURL=AddViewButton.js.map