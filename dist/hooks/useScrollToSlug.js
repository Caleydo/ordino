import * as React from 'react';
import { useParams } from 'react-router-dom';
/**
 * Reads the slug of a route and scrolls to an element with this id,
 * if available on the page.
 *
 * @see https://github.com/rafgraph/react-router-hash-link/issues/13
 */
export function useScrollToSlug() {
    const { slug } = useParams();
    React.useEffect(() => {
        setTimeout(() => {
            if (slug) {
                const element = document.getElementById(slug);
                if (element) {
                    element.scrollIntoView({ block: 'start', behavior: 'auto' });
                    window.scrollBy(0, -55);
                }
            }
        }, 100);
    }, [slug]);
}
//# sourceMappingURL=useScrollToSlug.js.map