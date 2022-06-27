import * as React from 'react';
import { I18nextManager } from 'tdp_core';

export function ErrorMessage({ error, onRetry }: { error: Error | Response | string | null; onRetry?: () => void }) {
  return error ? (
    <div className="alert alert-danger flex-fill d-flex align-items-center" role="alert">
      <i className="fas fa-fw fa-exclamation" />
      <div className="flex-fill">{error instanceof Response ? error.statusText : error.toString()}</div>
      {onRetry ? (
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={onRetry}>
          {I18nextManager.getInstance().i18n.t('tdp:ordino.message.retry')}
        </button>
      ) : null}
    </div>
  ) : null;
}
