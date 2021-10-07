import * as React from 'react';
import {useParams} from 'react-router-dom';

interface IParamTypes {
  slug: string;
}

/**
 * Reads the slug of a route and scrolls to an element with this id,
 * if available on the page.
 *
 * @see https://github.com/rafgraph/react-router-hash-link/issues/13
 */
export function useScrollToSlug() {
  const {slug}: IParamTypes = useParams();

  React.useEffect(() => {
    setTimeout(() => { // time out necessary for some browsers (e.g., Safari)
      if (slug) {
        const element = document.getElementById(slug);
        if (element) {
          element.scrollIntoView({ block: 'start', behavior: 'auto' });
        }
      }
    }, 100);
  }, [slug]);
}
