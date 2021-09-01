import * as React from 'react';
import {NavLink} from 'react-router-dom';
import {OrdinoLogo} from './OrdinoLogo';

interface IHeaderNavigationLink {
  text: string;
  page: string;
  faIcon?: string;
}

interface IHeaderNavigationProps {

  /**
   * Specify the links of the header
   * @default []
   */
  links?: IHeaderNavigationLink[];
  /**
   * Defines if the header is sticky and visible when scrolling the page down
   */
  fixed?: 'top' | 'bottom';

  /**
   * Background color
   * @default dark (see variables.scss)
   */
  bg?: string;
}

export function HeaderNavigation({links, fixed, bg = 'dark'}: IHeaderNavigationProps) {

  return (
    <nav className={`ordino-header-navigation navbar navbar-expand-lg navbar-dark bg-${bg} ${fixed === 'top' ? 'fixed-top' : ''} ${fixed === 'bottom' ? 'fixed-bottom' : ''}`}>
      <div className="container-fluid">
        <a href="#/" className="navbar-brand">
          <OrdinoLogo></OrdinoLogo>
        </a>
        <a href="/app/" className="order-2 mx-3 mx-lg-0 ms-auto ms-lg-3 btn btn-light">Start Analysis</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#ordino-header-navbar-nav" aria-controls="ordino-header-navbar-nav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="order-1 navbar-collapse collapse" id="ordino-header-navbar-nav">
          {links &&
            <ul className="navbar-nav">
              {links.map(({text, page, faIcon}) => <li className="px-3 nav-item"><NavLink to={page} className="nav-link" activeClassName="active">{faIcon && (<i className={`${faIcon} me-2`}></i>)}{text}</NavLink></li>)}
            </ul>
          }
        </div>
      </div>
    </nav>
  );
}
