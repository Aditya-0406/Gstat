type Props = {
  token: string
  remaining: number | null
  limit: number | null
  onChange: (value: string) => void
  onSave: () => void
}

export function TokenBar({ token, remaining, limit, onChange, onSave }: Props) {
  return (
    <details className="token">
      <summary>API token & rate limit</summary>
      <p>
        Unauthenticated requests are capped at 60/hour. A classic PAT with no
        extra scopes raises that to 5,000/hour. The token stays in this
        browser only.
      </p>
      <div className="token-row">
        <input
          type="password"
          value={token}
          placeholder="ghp_…"
          autoComplete="off"
          onChange={(event) => onChange(event.target.value)}
        />
        <button type="button" onClick={onSave}>
          Save
        </button>
        {remaining !== null && limit !== null ? (
          <span className="rate">
            {remaining}/{limit} remaining
          </span>
        ) : null}
      </div>
    </details>
  )
}
