import * as React from 'react';

export function WarningMessage({ warning }: { warning: string | null }) {
  return warning ? (
    <div className="alert alert-warning flex-fill d-flex align-items-center" role="alert">
      <i className="fas fa-fw fa-exclamation" />
      <div className="flex-fill">{warning.toString()}</div>
    </div>
  ) : null;
}
