import { useMemo, useState } from 'react'
import type { GithubRepo, SortKey } from '../types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function sortRepos(repos: GithubRepo[], key: SortKey) {
  const copy = [...repos]
  copy.sort((a, b) => {
    if (key === 'name') return a.name.localeCompare(b.name)
    if (key === 'stars') return b.stargazers_count - a.stargazers_count
    if (key === 'forks') return b.forks_count - a.forks_count
    return (
      new Date(b.pushed_at ?? b.updated_at).getTime() -
      new Date(a.pushed_at ?? a.updated_at).getTime()
    )
  })
  return copy
}

type Props = { repos: GithubRepo[] }

export function RepoList({ repos }: Props) {
  const [sort, setSort] = useState<SortKey>('stars')
  const [hideForks, setHideForks] = useState(true)
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const filtered = repos.filter((repo) => {
      if (hideForks && repo.fork) return false
      if (!query.trim()) return true
      const hay = `${repo.name} ${repo.description ?? ''} ${repo.language ?? ''}`.toLowerCase()
      return hay.includes(query.trim().toLowerCase())
    })
    return sortRepos(filtered, sort)
  }, [repos, sort, hideForks, query])

  return (
    <section className="repos">
      <header className="repos-head">
        <div>
          <h3>Repositories</h3>
          <p>
            Showing {visible.length} of {repos.length} public repos
          </p>
        </div>
        <div className="repos-controls">
          <input
            value={query}
            placeholder="Filter repos"
            onChange={(event) => setQuery(event.target.value)}
          />
          <label>
            Sort
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
            >
              <option value="stars">Stars</option>
              <option value="updated">Updated</option>
              <option value="forks">Forks</option>
              <option value="name">Name</option>
            </select>
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={hideForks}
              onChange={(event) => setHideForks(event.target.checked)}
            />
            Hide forks
          </label>
        </div>
      </header>

      {visible.length === 0 ? (
        <p className="empty">No repositories match those filters.</p>
      ) : (
        <ul className="repo-grid">
          {visible.map((repo) => (
            <li key={repo.id} className={repo.archived ? 'archived' : undefined}>
              <a href={repo.html_url} target="_blank" rel="noreferrer">
                <strong>{repo.name}</strong>
              </a>
              {repo.fork ? <span className="pill">fork</span> : null}
              {repo.archived ? <span className="pill">archived</span> : null}
              <p>{repo.description ?? 'No description.'}</p>
              <div className="repo-meta">
                {repo.language ? <span>{repo.language}</span> : null}
                <span>★ {repo.stargazers_count.toLocaleString()}</span>
                <span>⑂ {repo.forks_count.toLocaleString()}</span>
                <span>Updated {formatDate(repo.pushed_at ?? repo.updated_at)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
