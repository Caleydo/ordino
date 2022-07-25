import React from 'react';

interface IViewChooserBodyProps {
  children?: React.ReactNode;
}

export function ViewChooserBody({ children }: IViewChooserBodyProps) {
  return <header className="d-flex my-2 px-1 justify-content-center align-items-center flex-nowrap">{children}</header>;
}
