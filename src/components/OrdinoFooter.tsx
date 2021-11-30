import * as React from 'react';
import {Link} from 'react-router-dom';
import {OrdinoLogo} from './OrdinoLogo';
import {PluginRegistry} from 'tdp_core';
import {EP_ORDINO_FOOTER_MENU, IOrdinoFooterMenuDesc, IOrdinoFooterMenuLink} from '../base';

interface IFooterLinkProps {
  to: string;
  className?: string;
  openInNewWindow?: boolean;
  children?: React.ReactNode;
}

// tslint:disable-next-line: variable-name
const FooterLink = (props: IFooterLinkProps) => {
  const testId = props.to === '/' ? '' : `${props.to.replace(/\s+/g, '-').toLowerCase()}-link`; // check if FooterLink is logo, footer logo should not have data-testid in footerlink
  if (props.openInNewWindow) {
    return (
      <Link to={props.to} className={props.className} data-testid={testId} target="_blank" rel="noopener noreferrer">{props.children}</Link>
    );
  }

  return (
    <Link to={props.to} className={props.className} data-testid={testId}>{props.children}</Link>
  );

};

export function OrdinoFooter(props) {
  const openInNewWindow = !!props.openInNewWindow; // undefined and null = false (default)

  const lists: IOrdinoFooterMenuLink[][] = PluginRegistry.getInstance().listPlugins(EP_ORDINO_FOOTER_MENU)
    .map((d) => d as IOrdinoFooterMenuDesc) // no need to load the plugin; everything is contained in the plugin desc
    .map((d) => d.lists)[0]; // take only the first footer menu

  return (
    <div className="ordino-footer pt-4 pb-6 px-5" data-testid="ordino-footer">
      <nav className="ordino-footer-navigation row">
        {lists && lists.map((list, index) => {
          return (
          <div className="list-group col-sm-auto" key={index}>
            {
              list && list.map((link) => {
                return (
                  <FooterLink key={link.page} to={link.page} openInNewWindow={openInNewWindow} className="list-group-item list-group-item-action">
                    {link.faIcon && (<i className={`${link.faIcon} me-2`}></i>)}{link.text}
                  </FooterLink>
                );
              })
            }
          </div>
          );
        })}
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
