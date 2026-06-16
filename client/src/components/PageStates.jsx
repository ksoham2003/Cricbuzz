export function LoadingState({ label = 'Loading latest cricket data...' }) {
  return (
    <div className="state-panel">
      <span className="loader" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ message = 'Unable to load data right now.', onRetry }) {
  return (
    <div className="state-panel error">
      <h2>Could not load this section</h2>
      <p>{message}</p>
      {onRetry && (
        <button className="btn primary" type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', message = 'Check back when data is available.' }) {
  return (
    <div className="state-panel empty">
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}
