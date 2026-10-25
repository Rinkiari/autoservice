export default function ErrorAlert({ message, onRetry }) {
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between gap-3" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="btn btn-sm btn-outline-danger flex-shrink-0" onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  )
}
