/* eslint-disable import/no-cycle */
import * as React from 'react';
import { BusyOverlay } from './BusyOverlay';
import { IVisynLoginFormProps, VisynLoginForm as DefaultLoginForm } from './headerComponents';
import { useInitVisynApp } from './hooks/useInitVisynApp';
import { VisynLoginMenu } from './LoginMenu';
import { IVisynHeaderProps, VisynHeader } from './VisynHeader';

export interface IVisynAppComponents {
  Header: React.ComponentType<IVisynHeaderProps>;
  LoginForm: React.ComponentType<IVisynLoginFormProps>;
}

const visynAppComponents: Partial<IVisynAppComponents> = {
  Header: VisynHeader,
  LoginForm: DefaultLoginForm,
};
interface IVisynAppProps {
  extensions?: Partial<IVisynAppComponents>;
  watch?: boolean;
  children?: React.ReactNode;
}

export function VisynApp({ extensions, children = null, watch = false }: IVisynAppProps) {
  const { Header, LoginForm } = { ...visynAppComponents, ...extensions };
  console.log(extensions, Header);
  const { status } = useInitVisynApp();
  return status === 'success' ? (
    <>
      <Header />
      <VisynLoginMenu watch={watch} extensions={{ LoginForm }} />
      {children}
    </>
  ) : (
    <BusyOverlay />
  );
}
