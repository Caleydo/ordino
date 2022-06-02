import React from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
export function WorkbenchUtilsSidebar({}) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    return React.createElement("div", { className: "me-0 position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1" });
}
//# sourceMappingURL=WorkbenchTabs.js.map