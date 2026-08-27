import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const ConfirmDialog = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel
}) => {
  const confirmRef = useRef(null);

  useEffect(() => {
    confirmRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm animate-fade-in p-4"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="card-elevated p-6 max-w-md w-full animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
      >
        <div className="flex items-start gap-4 mb-5">
          <span className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl ${
            variant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-c2 text-c5'
          }`}>
            {variant === 'danger' ? '🗑️' : '❓'}
          </span>
          <div>
            <h2 id="confirm-dialog-title" className="text-lg font-bold text-ink">{title}</h2>
            <p id="confirm-dialog-message" className="text-ink-muted text-sm mt-1 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="btn-secondary !py-2 !px-4 text-sm">
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={`${variant === 'danger' ? 'btn-danger' : 'btn-primary'} !py-2 !px-4 text-sm`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmDialog.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  variant: PropTypes.oneOf(['danger', 'primary']),
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ConfirmDialog;
