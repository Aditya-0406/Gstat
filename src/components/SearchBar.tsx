type Props = {
  value: string
  loading: boolean
  onChange: (value: string) => void
  onSubmit: () => void
}

export function SearchBar({ value, loading, onChange, onSubmit }: Props) {
  return (
    <form
      className="search"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <label className="search-label" htmlFor="username">
        GitHub username
      </label>
      <div className="search-row">
        <span className="search-prefix" aria-hidden="true">
          @
        </span>
        <input
          id="username"
          name="username"
          value={value}
          autoComplete="username"
          spellCheck={false}
          placeholder="octocat"
          onChange={(event) => onChange(event.target.value)}
        />
        <button type="submit" disabled={loading || !value.trim()}>
          {loading ? 'Looking…' : 'Find profile'}
        </button>
      </div>
    </form>
  )
}
