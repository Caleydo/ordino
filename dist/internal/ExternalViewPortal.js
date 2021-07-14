// template from patentbay
import * as React from 'react';
function copyStyles(sourceDoc, targetDoc) {
    Array.from(sourceDoc.styleSheets).forEach((styleSheet) => {
        console.log('stylesheet', styleSheet);
        if (styleSheet.cssRules) {
            // true for inline styles
            const newStyleEl = sourceDoc.createElement('style');
            Array.from(styleSheet.cssRules).forEach((cssRule) => {
                newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
            });
            targetDoc.head.appendChild(newStyleEl);
        }
        else if (styleSheet.href) {
            // true for stylesheets loaded from a URL
            const newLinkEl = sourceDoc.createElement('link');
            newLinkEl.rel = 'stylesheet';
            newLinkEl.href = styleSheet.href;
            targetDoc.head.appendChild(newLinkEl);
        }
    });
}
/**
 * Renders all children in a newly opened external window.
 */
export const ExternalViewPortal = (props) => {
    const externalWindowRef = React.useRef(null);
    const [container, setContainer] = React.useState();
    const closeWindow = () => {
        var _a, _b;
        (_a = props.onWindowClosed) === null || _a === void 0 ? void 0 : _a.call(props);
        (_b = externalWindowRef.current) === null || _b === void 0 ? void 0 : _b.close();
        externalWindowRef.current = null;
    };
    const updateTitle = () => {
        if (externalWindowRef.current) {
            externalWindowRef.current.document.title = props.title || 'External View';
        }
    };
    React.useEffect(() => {
        var _a, _b, _c, _d, _e;
        if (props.active) {
            // const containerElement = document.createElement("div");
            const { origin } = window.location;
            const externalWindow = ((_a = props.getWindow) === null || _a === void 0 ? void 0 : _a.call(props)) || window.open(`${origin}/externalView.html`, props.asTab ? '_blank' : '', !props.asTab ? `width=${(_b = props.width) !== null && _b !== void 0 ? _b : window.innerWidth},height=${(_c = props.height) !== null && _c !== void 0 ? _c : window.innerHeight},left=${(_d = props.left) !== null && _d !== void 0 ? _d : 200},top=${(_e = props.top) !== null && _e !== void 0 ? _e : 200}` : undefined);
            externalWindow.addEventListener('DOMContentLoaded', async () => {
                var _a;
                externalWindow.addEventListener('beforeunload', () => {
                    closeWindow();
                });
                // TODO: Why is the body undefined for so long?
                let counter = 0;
                while (!externalWindow.document.body) {
                    if (counter > 20) {
                        console.error('Timeout');
                        break;
                    }
                    await new Promise((res) => setTimeout(res, 250));
                    counter++;
                }
                // TODO: How do we separate inline and already included styles?
                // Only copying the styles leads to undefined font-awesome icons and so on...
                copyStyles(document, externalWindow.document);
                externalWindowRef.current = externalWindow;
                (_a = props.onWindowOpened) === null || _a === void 0 ? void 0 : _a.call(props, externalWindow);
                const newContainer = externalWindow.document.createElement('div');
                newContainer.style.height = '100%';
                newContainer.style.width = '100%';
                newContainer.className = 'box';
                newContainer.innerHTML = `<div class="content"><main data-anchor="main" class="targid" ><div class="wrapper">
                <div class="filmstrip" >

                </div>
                 </div>
                 </main>
                 </div>`;
                externalWindow.document.body.appendChild(newContainer);
                setContainer(newContainer);
            }, false);
            return () => {
                closeWindow();
            };
        }
        else {
            closeWindow();
        }
    }, [props.active]);
    React.useEffect(() => {
        updateTitle();
    }, [props.title, container]);
    React.useEffect(() => {
        var _a;
        console.log('container', container && container.querySelector('.filmstrip'));
        if (container && container.querySelector('.filmstrip')) {
            (_a = props.viewWrapper) === null || _a === void 0 ? void 0 : _a.render(container.querySelector('.filmstrip'));
        }
    }, [props.active, container]);
    return null;
};
//# sourceMappingURL=ExternalViewPortal.js.map