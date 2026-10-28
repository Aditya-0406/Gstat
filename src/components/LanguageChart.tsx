import type { LanguageShare } from '../types'

const PALETTE = [
  '#3dd68c',
  '#7ad4ff',
  '#f2c14e',
  '#ff8a70',
  '#c9a0ff',
  '#9ae6b4',
  '#63b3ed',
  '#f6ad55',
]

type Props = { languages: LanguageShare[] }

export function LanguageChart({ languages }: Props) {
  const top = languages.slice(0, 8)
  if (top.length === 0) {
    return <p className="empty">No language data on public repos.</p>
  }

  return (
    <section className="languages" aria-label="Languages">
      <h3>Languages</h3>
      <div className="lang-bar" aria-hidden="true">
        {top.map((lang, index) => (
          <span
            key={lang.name}
            style={{
              width: `${lang.percent}%`,
              background: PALETTE[index % PALETTE.length],
            }}
          />
        ))}
      </div>
      <ul>
        {top.map((lang, index) => (
          <li key={lang.name}>
            <i style={{ background: PALETTE[index % PALETTE.length] }} />
            <span>{lang.name}</span>
            <em>
              {lang.count} · {lang.percent.toFixed(0)}%
            </em>
          </li>
        ))}
      </ul>
    </section>
  )
}
