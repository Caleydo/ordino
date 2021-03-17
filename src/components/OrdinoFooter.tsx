import * as React from 'react';
import {Link} from 'react-router-dom';
import {OrdinoLogo} from './OrdinoLogo';

interface IFooterLinkProps {
  href: string;
  className: string;
  openInNewWindow: boolean;
  children?: React.ReactNode;
}

const footerLink = React.forwardRef((props: IFooterLinkProps, ref) => {
  if(props.openInNewWindow) {
    return(
      <a href={props.href} className={props.className} target="_blank" rel="noopener noreferrer">{props.children}</a>
    );
  }

  return(
    <a href={props.href} className={props.className}>{props.children}</a>
  );
});

export function OrdinoFooter(props) {
  const openInNewWindow = !!props.openInNewWindow; // undefined and null = false (default)

  return (
    <div className="ordino-footer pt-4 pb-6 px-5">
      <nav className="ordino-footer-navigation row">
        <div className="list-group">
          <Link to="/news" component={footerLink} openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="mr-2 fas fa-fw fa-newspaper"></i>What's new?
          </Link>
          <Link to="/features" component={footerLink} openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="mr-2 fas fa-fw fa-check"></i>Features
          </Link>
          <Link to="/datasets" component={footerLink} openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="mr-2 fas fa-fw fa-database"></i>Loaded Datasets
          </Link>
          <Link to="/publication" component={footerLink} openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="mr-2 fas fa-fw fa-book-open"></i>Publication
          </Link>
        </div>
        <div className="list-group">
          <Link to="/help" component={footerLink} openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="mr-2 fas fa-fw fa-question"></i>Help and Contact
          </Link>
          <Link to="/help" component={footerLink} openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="mr-2 fas fa-fw fa-file-code"></i>Source Code &amp; Licenses
          </Link>
          <Link to="/help" component={footerLink} openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
            <i className="mr-2 fas fa-fw fa-smile"></i>Terms of Use
          </Link>
        </div>
      </nav>
      <div className="row">
        <div className="col text-right ordino-footer-logo">
          <Link to="/" component={footerLink} openInNewWindow={openInNewWindow}>
            <OrdinoLogo></OrdinoLogo>
          </Link>
        </div>
      </div>
    </div>
  );
}
