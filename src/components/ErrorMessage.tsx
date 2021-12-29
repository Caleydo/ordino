import * as React from 'react';

export function ErrorMessage({ error, onRetry }: { error: Error | null; onRetry?: () => void }) {
  return error ? (
    <div className="alert alert-danger flex-fill d-flex align-items-center" role="alert">
      <i className="fas fa-fw fa-exclamation" />
      <div className="flex-fill">{error.toString()}</div>
      {onRetry ? (
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  ) : null;
}
