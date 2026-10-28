import type { GithubUser } from '../types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function websiteHref(blog: string) {
  if (!blog) return ''
  return blog.startsWith('http') ? blog : `https://${blog}`
}

type Props = { user: GithubUser }

export function ProfileCard({ user }: Props) {
  const site = user.blog?.trim() ? websiteHref(user.blog.trim()) : ''

  return (
    <article className="profile">
      <img src={user.avatar_url} alt="" width={112} height={112} />
      <div>
        <p className="kicker">GitHub profile</p>
        <h2>{user.name ?? user.login}</h2>
        <p className="handle">
          <a href={user.html_url} target="_blank" rel="noreferrer">
            @{user.login}
          </a>
        </p>
        {user.bio ? <p className="bio">{user.bio}</p> : null}
        <ul className="meta">
          {user.company ? <li>{user.company}</li> : null}
          {user.location ? <li>{user.location}</li> : null}
          {site ? (
            <li>
              <a href={site} target="_blank" rel="noreferrer">
                {user.blog}
              </a>
            </li>
          ) : null}
          {user.twitter_username ? (
            <li>
              <a
                href={`https://x.com/${user.twitter_username}`}
                target="_blank"
                rel="noreferrer"
              >
                @{user.twitter_username}
              </a>
            </li>
          ) : null}
          <li>Joined {formatDate(user.created_at)}</li>
        </ul>
      </div>
    </article>
  )
}
