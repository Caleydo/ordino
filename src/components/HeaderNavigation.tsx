import * as React from 'react';
import {Navbar, Button, Nav} from 'react-bootstrap';
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
    <Navbar collapseOnSelect fixed={props.fixed} expand="lg" bg={bg} variant="dark" className="ordino-header-navigation">
      <Navbar.Brand href="#/">
        <OrdinoLogo></OrdinoLogo>
      </Navbar.Brand>
      <Button href="/app/" variant="light" className="order-lg-2 mx-3 mx-lg-0 ml-auto ml-lg-3">Start Analysis</Button>
      <Navbar.Toggle aria-controls="ordino-header-navbar-nav" className="" />
      <Navbar.Collapse id="ordino-header-navbar-nav" className="order-lg-1">
        <Nav as="ul">
          <Nav.Item as="li" className="px-3">
            <NavLink to="/news" className="nav-link" activeClassName="active">What's new?</NavLink>
          </Nav.Item>
          <Nav.Item as="li" className="px-3">
            <NavLink to="/features" className="nav-link" activeClassName="active">Features</NavLink>
          </Nav.Item>
          <Nav.Item as="li" className="px-3">
            <NavLink to="/datasets" className="nav-link" activeClassName="active">Datasets</NavLink>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
