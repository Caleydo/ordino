import * as React from 'react';
import {NavLink} from 'react-router-dom';
import {OrdinoLogo} from './OrdinoLogo';

interface IHeaderNavigationProps {
  /**
   * Defines if the header is sticky and visible when scrolling the page down
   */
  fixed?: 'top' | 'bottom';

  /**
   * Background color
   * @default ordino-gray-2 (see variables.scss)
   */
  bg?: string;
}

export function HeaderNavigation(props: IHeaderNavigationProps) {
  const bg = props.bg ?? 'ordino-gray-2';

  return (
    <nav className={`ordino-header-navigation navbar navbar-expand-lg navbar-dark bg-${bg} ${props.fixed === 'top' ? 'fixed-top' : ''} ${props.fixed === 'bottom' ? 'fixed-bottom' : ''}`}>
      <a href="#/" className="navbar-brand">
        <OrdinoLogo></OrdinoLogo>
      </a>
      <a href="/app/" className="order-lg-2 mx-3 mx-lg-0 ml-auto ml-lg-3 btn btn-light">Start Analysis</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ordino-header-navbar-nav" aria-controls="ordino-header-navbar-nav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="order-lg-1 navbar-collapse collapse" id="ordino-header-navbar-nav">
        <ul className="navbar-nav">
          <li className="px-3 nav-item"><NavLink to="/news" className="nav-link" activeClassName="active">What's new?</NavLink></li>
          <li className="px-3 nav-item"><NavLink to="/features" className="nav-link" activeClassName="active">Features</NavLink></li>
          <li className="px-3 nav-item"><NavLink to="/datasets" className="nav-link" activeClassName="active">Datasets</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}
