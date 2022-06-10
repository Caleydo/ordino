import React, { useCallback, useEffect, useRef } from 'react';
import { useBSModal } from 'tdp_core';

interface ILoginDialogProps {
  /**
   * Open dialog by default
   */
  show?: boolean;
  /**
   * Title of the dialog
   */
  title?: string;
  /**
   * Adds has-warning css class
   */
  hasWarning?: boolean;

  /**
   * Adds the `has-error` css class
   */
  hasError?: boolean;
  /**
   * Pass login form as child
   */
  children: (onHide: () => void) => React.ReactNode;
}

/**
 * Basic login dialog
 */
export function LoginDialog({ show = false, title = 'Please Login', children, hasWarning, hasError }: ILoginDialogProps) {
  const [ref, instance] = useBSModal();
  const modalRef = useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (instance && show) {
      instance.show();
    }
  }, [instance, show]);

  useEffect(() => {
    modalRef.current.classList.toggle('has-warning', hasWarning);
    modalRef.current.classList.toggle('has-error', hasError);
  }, [hasWarning, hasError]);

  const setRef = useCallback(
    (element: HTMLElement) => {
      modalRef.current = element;
      ref(element);
    },
    [ref],
  );

  return (
    <div
      ref={setRef}
      className="modal fade"
      id="loginDialog"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="loginDialog"
      data-bs-keyboard="false"
      data-bs-backdrop="static"
    >
      <div className="modal-dialog modal-sm">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
          </div>
          <div className="modal-body">{children(() => instance.hide())}</div>
        </div>
      </div>
    </div>
  );
}
