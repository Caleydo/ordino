import * as React from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useInitVisynApp } from './hooks/useInitVisynApp';
import { VisynHeader } from './VisynHeader';

interface IVisynAppProps {
  extensions?: {
    header?: React.ReactElement; // TODO In some other places you started using the capital names for components (e.g., )
  };
  children?: React.ReactNode;
}

export function VisynApp({ extensions: { header = <VisynHeader /> } = {}, children = null }: IVisynAppProps) {
  const user = useAppSelector((state) => state.user);
  const { status } = useInitVisynApp();
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {
        status === 'success' ? (
          <>
            {header}
            {user.loggedIn ? children : null}
          </>
        ) : null // TODO:show loading overlay while initializing?
      }
    </>
  );
}
