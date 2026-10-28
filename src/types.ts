export type GithubUser = {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
  bio: string | null
  company: string | null
  blog: string | null
  location: string | null
  twitter_username: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export type GithubRepo = {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  fork: boolean
  language: string | null
  stargazers_count: number
  forks_count: number
  watchers_count: number
  open_issues_count: number
  topics: string[]
  updated_at: string
  pushed_at: string | null
  homepage: string | null
  archived: boolean
}

export type RateLimit = {
  remaining: number
  limit: number
  reset: number
}

export type LanguageShare = {
  name: string
  count: number
  percent: number
}

export type ProfileBundle = {
  user: GithubUser
  repos: GithubRepo[]
  languages: LanguageShare[]
  totalStars: number
  totalForks: number
  rateLimit: RateLimit | null
}

export type SortKey = 'stars' | 'forks' | 'updated' | 'name'
