import * as React from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useInitVisynApp } from './hooks/useInitVisynApp';
import { VisynHeader } from './VisynHeader';

interface IVisynAppProps {
  extensions?: {
    Header?: React.ReactElement;
  };
  children?: React.ReactNode;
}

export function VisynApp({ extensions: { Header = <VisynHeader /> } = {}, children = null }: IVisynAppProps) {
  const user = useAppSelector((state) => state.user);
  const { status } = useInitVisynApp();
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {
        status === 'success' ? (
          <>
            {Header}
            {user.loggedIn ? children : null}
          </>
        ) : null // TODO:show loading overlay while initializing?
      }
    </>
  );
}
