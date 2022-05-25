import React, { FC, MouseEventHandler } from 'react';

type Props = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  active?: boolean;
  disabled?: boolean;
};

const FloatingActionButton: FC<Props> = ({ onClick, children, disabled = false, active = false }) => {
  const classes = ['btn', 'btn-primary'];

  if (active) classes.push('btn-info');
  if (disabled) classes.push('disabled');

  return (
    <button className={classes.join(' ')} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default FloatingActionButton;
