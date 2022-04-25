import * as React from 'react';
import { useOrdinoLogo } from '../hooks/useOrdinoLogo';

export function OrdinoLogo() {
  const { status, value } = useOrdinoLogo();
  return (
    status === 'success' && (
      <div className="ordino-logo" data-testid="ordino-logo">
        <img alt="" src={value.icon} width={value.width} height={value.height} /> {value.text}
      </div>
    )
  );
}
