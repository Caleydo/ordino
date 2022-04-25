import * as React from 'react';
import { useOrdinoLogo } from '../hooks/useOrdinoLogo';
export function OrdinoLogo() {
    const { status, value } = useOrdinoLogo();
    return (status === 'success' && (React.createElement("div", { className: "ordino-logo", "data-testid": "ordino-logo" },
        React.createElement("img", { alt: "", src: value.icon, width: value.width, height: value.height }),
        " ",
        value.text)));
}
//# sourceMappingURL=OrdinoLogo.js.map