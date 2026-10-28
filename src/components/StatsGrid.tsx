type Props = {
  repos: number
  gists: number
  followers: number
  following: number
  stars: number
  forks: number
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat">
      <strong>{value.toLocaleString()}</strong>
      <span>{label}</span>
    </div>
  )
}

export function StatsGrid({
  repos,
  gists,
  followers,
  following,
  stars,
  forks,
}: Props) {
  return (
    <section className="stats" aria-label="Profile stats">
      <Stat label="Public repos" value={repos} />
      <Stat label="Stars" value={stars} />
      <Stat label="Forks" value={forks} />
      <Stat label="Followers" value={followers} />
      <Stat label="Following" value={following} />
      <Stat label="Gists" value={gists} />
    </section>
  )
}
