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
        <div className="list-group col-sm-auto">
          <FooterLink to="/news" openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="me-2 fas fa-fw fa-newspaper"></i>What's new?
          </FooterLink>
          <FooterLink to="/features" openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="me-2 fas fa-fw fa-check"></i>Features
          </FooterLink>
          <FooterLink to="/datasets" openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="me-2 fas fa-fw fa-database"></i>Loaded datasets
          </FooterLink>
          <FooterLink to="/publication" openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="me-2 fas fa-fw fa-book-open"></i>Publications
          </FooterLink>
        </div>
        <div className="list-group col-sm-auto">
          <FooterLink to="/help/ordino-at-a-glance" openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="me-2 fas fa-fw fa-mountain"></i>Ordino at a glance
          </FooterLink>
          <FooterLink to="/help/contact-us" openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
          <i className="me-2 fas fa-fw fa-at"></i>Contact us
          </FooterLink>
          <FooterLink to="/help/disclaimer" openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="me-2 fas fa-fw fa-exclamation-triangle"></i>Disclaimer
          </FooterLink>
          <FooterLink to="/help/terms-of-use" openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="me-2 fas fa-fw fa-smile"></i>Terms of use
          </FooterLink>
          <FooterLink to="/help/source-code-licenses" openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="me-2 fas fa-fw fa-code"></i>Source code {'&'} licenses
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
