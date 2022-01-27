import * as React from 'react';
import {useAppSelector} from '..';
import {useInitVisynApp} from './hooks/useInitVisynApp';
import {VisynHeader} from './VisynHeader';

interface IVisynAppProps {
  extensions?: {
    header?: React.ReactElement;
  };
  children?: React.ReactNode;
}

export function VisynApp({extensions: {header = <VisynHeader />} = {}, children = null}: IVisynAppProps) {
  const user = useAppSelector((state) => state.user);
  const {status} = useInitVisynApp();
  return (
    <>{status === 'success' ?
      <>
        {header}
        {user.loggedIn ?
          <>
            {children}
          </>
          : null}
      </> : null // TODO:show loading overlay while initializing?
    }
    </>
  );
}
