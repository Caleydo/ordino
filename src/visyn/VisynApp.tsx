import * as React from 'react';
import {useAppSelector} from '..';
import {VisynHeader} from './VisynHeader';

interface IVisynAppProps {
  extensions?: {
    header?: React.ReactElement;
  };
  children?: React.ReactNode;
}

export function VisynApp({extensions: {header = <VisynHeader />} = {}, children = null}: IVisynAppProps) {
  const user = useAppSelector((state) => state.user);

  const [initialized, setInitialized] = React.useState<boolean>(false);
  return (
    <>
      {header}
      {user.loggedIn ?
        <>
          {children}
        </>
        : null}
    </>

  );
}
