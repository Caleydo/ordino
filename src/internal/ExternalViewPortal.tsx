// template from patentbay
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ViewWrapper} from '.';

function copyStyles(sourceDoc: Document, targetDoc: Document) {
    Array.from(sourceDoc.styleSheets).forEach((styleSheet) => {
        console.log('stylesheet', styleSheet)
        if (styleSheet.cssRules) {
            // true for inline styles
            const newStyleEl = sourceDoc.createElement('style');

            Array.from(styleSheet.cssRules).forEach((cssRule) => {
                newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
            });

            targetDoc.head.appendChild(newStyleEl);
        } else if (styleSheet.href) {
            // true for stylesheets loaded from a URL
            const newLinkEl = sourceDoc.createElement('link');

            newLinkEl.rel = 'stylesheet';
            newLinkEl.href = styleSheet.href;
            targetDoc.head.appendChild(newLinkEl);
        }
    });
}

interface IExternalViewPortalProps {

    viewWrapper: ViewWrapper;

    /**
     * Whether or not the children should be rendered in an external window.
     */
    active: boolean;
    /**
     * Getter for custom window objects.
     * Custom window objects can be useful as certain browsers block window.open calls which are
     * not the direct result of certain events such as click. Therefore, you can create your own
     * window object in an onClick and then return it from this callback.
     */
    getWindow?(): Window | null;
    /**
     * Children to be rendered.
     */
    children: React.ReactNode;
    /**
     * Title of the opened window.
     */
    title?: string;
    /**
     * Callback when the window is opened.
     * @param window Window that was opened.
     */
    onWindowOpened?(window: Window): void;
    /**
     * Callback when the window is closed.
     */
    onWindowClosed?(): void;
    /**
     * Whether the window should be opened as tab instead of a new window.
     */
    asTab?: boolean;
    /**
     * Width of the opened window.
     */
    width?: number;
    /**
     * Height of the opened window.
     */
    height?: number;
    /**
     * Top position of the opened window.
     */
    top?: number;
    /**
     * Left position of the opened window.
     */
    left?: number;
}

/**
 * Renders all children in a newly opened external window.
 */
export const ExternalViewPortal = (props: IExternalViewPortalProps) => {
    const externalWindowRef = React.useRef<Window | null>(null);
    const [container, setContainer] = React.useState<HTMLElement | null>();
    const closeWindow = () => {
        props.onWindowClosed?.();
        externalWindowRef.current?.close();
        externalWindowRef.current = null;
    };

    const updateTitle = () => {
        if (externalWindowRef.current) {
            externalWindowRef.current.document.title = props.title || 'External View';
        }
    };

    React.useEffect(() => {
        if (props.active) {
            // const containerElement = document.createElement("div");
            const {origin} = window.location;
            const externalWindow = props.getWindow?.() || window.open(
                `${origin}/externalView.html`,
                props.asTab ? '_blank' : '',
                !props.asTab ? `width=${props.width ?? window.innerWidth},height=${props.height ?? window.innerHeight},left=${props.left ?? 200
                    },top=${props.top ?? 200}` : undefined
            );
            externalWindow.addEventListener('DOMContentLoaded', async () => {
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
                props.onWindowOpened?.(externalWindow);
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
        } else {
            closeWindow();
        }
    }, [props.active]);

    React.useEffect(() => {
        updateTitle();
    }, [props.title, container]);

    React.useEffect(() => {
        console.log('container', container && container.querySelector('.filmstrip'));
        if (container && container.querySelector('.filmstrip')) {

            props.viewWrapper?.render(container.querySelector('.filmstrip'));
        }

    }, [props.active, container]);

    return null;
};
