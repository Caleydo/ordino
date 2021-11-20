import { createPortal } from 'react-dom';
export function AppPortal({ children }) {
    const portalElement = document.getElementById('modalContainer');
    return createPortal(children, portalElement);
}
//# sourceMappingURL=AppPortal.js.map