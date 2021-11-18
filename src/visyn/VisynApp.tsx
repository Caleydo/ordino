import * as React from 'react';
import { VisynHeader } from './VisynHeader';

interface IVisynAppProps {
  extensions?: {
    header?: React.ReactElement;
  };
  children?: React.ReactNode;
}

export function VisynApp({ extensions: { header = <VisynHeader /> } = {}, children = null }: IVisynAppProps) {
  return (
    <>
      {header}
      {children}
    </>
  );
}
