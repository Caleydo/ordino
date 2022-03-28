import React from 'react';

interface IModalDialogProps {
  title?: string;
  enableCloseButton?: boolean;
  children: React.ReactNode;
}

export const ModalDialog = React.forwardRef<HTMLDivElement, IModalDialogProps>(function ModalDialogRef(
  { children, title = '', enableCloseButton = true },
  ref,
) {
  return (
    <div
      ref={ref}
      className="modal fade"
      id="loginDialog"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="loginDialog"
      data-keyboard="false"
      data-bs-backdrop="static"
    >
      <div className="modal-dialog modal-sm">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            {enableCloseButton ? <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" /> : null}
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
});
