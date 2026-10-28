import type {
  GithubRepo,
  GithubUser,
  LanguageShare,
  ProfileBundle,
  RateLimit,
} from '../types'

const API = 'https://api.github.com'
const TOKEN_KEY = 'gstat.github.token'

export function getStoredToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? ''
}

export function setStoredToken(token: string) {
  if (token.trim()) localStorage.setItem(TOKEN_KEY, token.trim())
  else localStorage.removeItem(TOKEN_KEY)
}

function headers(): HeadersInit {
  const token = getStoredToken()
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function parseRateLimit(res: Response): RateLimit | null {
  const remaining = res.headers.get('X-RateLimit-Remaining')
  const limit = res.headers.get('X-RateLimit-Limit')
  const reset = res.headers.get('X-RateLimit-Reset')
  if (!remaining || !limit || !reset) return null
  return {
    remaining: Number(remaining),
    limit: Number(limit),
    reset: Number(reset),
  }
}

async function githubGet<T>(path: string): Promise<{ data: T; rateLimit: RateLimit | null }> {
  const res = await fetch(`${API}${path}`, { headers: headers() })
  const rateLimit = parseRateLimit(res)

  if (res.status === 404) {
    throw new Error('No GitHub user found with that username.')
  }
  if (res.status === 403 || res.status === 429) {
    const reset = rateLimit?.reset
    const when = reset ? new Date(reset * 1000).toLocaleTimeString() : 'later'
    throw new Error(
      `GitHub rate limit hit. Try again after ${when}, or add a personal access token.`,
    )
  }
  if (!res.ok) {
    throw new Error(`GitHub API error (${res.status}).`)
  }

  return { data: (await res.json()) as T, rateLimit }
}

async function fetchAllRepos(username: string): Promise<{
  repos: GithubRepo[]
  rateLimit: RateLimit | null
}> {
  const perPage = 100
  const maxPages = 5
  const repos: GithubRepo[] = []
  let rateLimit: RateLimit | null = null

  for (let page = 1; page <= maxPages; page += 1) {
    const { data, rateLimit: pageLimit } = await githubGet<GithubRepo[]>(
      `/users/${encodeURIComponent(username)}/repos?per_page=${perPage}&page=${page}&sort=updated`,
    )
    rateLimit = pageLimit
    repos.push(...data)
    if (data.length < perPage) break
  }

  return { repos, rateLimit }
}

function languageShares(repos: GithubRepo[]): LanguageShare[] {
  const counts = new Map<string, number>()
  for (const repo of repos) {
    if (!repo.language) continue
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1)
  }
  const total = [...counts.values()].reduce((sum, n) => sum + n, 0)
  if (total === 0) return []
  return [...counts.entries()]
    .map(([name, count]) => ({
      name,
      count,
      percent: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count)
}

export async function fetchProfile(username: string): Promise<ProfileBundle> {
  const handle = username.trim().replace(/^@/, '')
  if (!handle) throw new Error('Enter a GitHub username.')

  const { data: user, rateLimit: userLimit } = await githubGet<GithubUser>(
    `/users/${encodeURIComponent(handle)}`,
  )
  const { repos, rateLimit: repoLimit } = await fetchAllRepos(handle)

  return {
    user,
    repos,
    languages: languageShares(repos),
    totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
    totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
    rateLimit: repoLimit ?? userLimit,
  }
}
