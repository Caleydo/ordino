import * as React from 'react';
import {Link} from 'react-router-dom';
import {OrdinoLogo} from './OrdinoLogo';

interface IFooterLinkProps {
  to: string;
  className?: string;
  openInNewWindow?: boolean;
  children?: React.ReactNode;
}

// tslint:disable-next-line: variable-name
const FooterLink = (props: IFooterLinkProps) => {
  if (props.openInNewWindow) {
    return (
      <Link to={props.to} className={props.className} target="_blank" rel="noopener noreferrer">{props.children}</Link>
    );
  }

  return (
    <Link to={props.to} className={props.className}>{props.children}</Link>
  );

};

export function OrdinoFooter(props) {
  const openInNewWindow = !!props.openInNewWindow; // undefined and null = false (default)

  return (
    <div className="ordino-footer pt-4 pb-6 px-5">
      <nav className="ordino-footer-navigation row">
        <div className="list-group">
          <FooterLink to="/news" openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="me-2 fas fa-fw fa-newspaper"></i>What's new?
          </FooterLink>
          <FooterLink to="/features" openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="me-2 fas fa-fw fa-check"></i>Features
          </FooterLink>
          <FooterLink to="/datasets" openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="me-2 fas fa-fw fa-database"></i>Loaded Datasets
          </FooterLink>
          <FooterLink to="/publication" openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="me-2 fas fa-fw fa-book-open"></i>Publication
          </FooterLink>
        </div>
        <div className="list-group">
          <FooterLink to="/help" openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="me-2 fas fa-fw fa-question"></i>Help and Contact
          </FooterLink>
          <FooterLink to="/help" openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="me-2 fas fa-fw fa-file-code"></i>Source Code &amp; Licenses
          </FooterLink>
          <FooterLink to="/help" openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="me-2 fas fa-fw fa-smile"></i>Terms of Use
          </FooterLink>
        </div>
      </nav>
      <div className="row">
        <div className="col position-relative text-end ordino-footer-logo">
          <FooterLink to="/" openInNewWindow={openInNewWindow}>
            <OrdinoLogo />
          </FooterLink>
        </div>
      </div>
    </div>
  );
}
