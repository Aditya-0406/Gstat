import { useEffect, useState } from 'react'
import { fetchProfile, getStoredToken, setStoredToken } from './api/github'
import { LanguageChart } from './components/LanguageChart'
import { ProfileCard } from './components/ProfileCard'
import { RepoList } from './components/RepoList'
import { SearchBar } from './components/SearchBar'
import { StatsGrid } from './components/StatsGrid'
import { TokenBar } from './components/TokenBar'
import type { ProfileBundle } from './types'

function usernameFromLocation() {
  const params = new URLSearchParams(window.location.search)
  return params.get('u') ?? ''
}

export default function App() {
  const [query, setQuery] = useState(usernameFromLocation)
  const [token, setToken] = useState(getStoredToken)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bundle, setBundle] = useState<ProfileBundle | null>(null)

  async function load(username: string) {
    setLoading(true)
    setError(null)
    try {
      const next = await fetchProfile(username)
      setBundle(next)
      const url = new URL(window.location.href)
      url.searchParams.set('u', next.user.login)
      window.history.replaceState({}, '', url)
    } catch (err) {
      setBundle(null)
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initial = usernameFromLocation()
    if (initial) void load(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="shell">
      <header className="top">
        <div>
          <p className="brand">Gstat</p>
          <h1>GitHub profile finder</h1>
          <p className="lede">
            Look up any public GitHub user. Stats, languages, and repositories
            come straight from the GitHub REST API.
          </p>
        </div>
        <SearchBar
          value={query}
          loading={loading}
          onChange={setQuery}
          onSubmit={() => void load(query)}
        />
        <TokenBar
          token={token}
          remaining={bundle?.rateLimit?.remaining ?? null}
          limit={bundle?.rateLimit?.limit ?? null}
          onChange={setToken}
          onSave={() => setStoredToken(token)}
        />
      </header>

      {error ? <p className="error" role="alert">{error}</p> : null}

      {!bundle && !loading && !error ? (
        <p className="hint">Try a username like octocat, torvalds, or gaearon.</p>
      ) : null}

      {loading ? <p className="hint">Fetching profile and repositories…</p> : null}

      {bundle ? (
        <main>
          <ProfileCard user={bundle.user} />
          <StatsGrid
            repos={bundle.user.public_repos}
            gists={bundle.user.public_gists}
            followers={bundle.user.followers}
            following={bundle.user.following}
            stars={bundle.totalStars}
            forks={bundle.totalForks}
          />
          <LanguageChart languages={bundle.languages} />
          <RepoList repos={bundle.repos} />
        </main>
      ) : null}
    </div>
  )
}
