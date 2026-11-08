import { Logo } from './Logo';

export type Page = 'discover' | 'create' | 'profile';

const LINKS: { page: Page; label: string }[] = [
  { page: 'discover', label: 'Discover' },
  { page: 'create', label: 'Create activity' },
  { page: 'profile', label: 'Profile' },
];

export function NavBar({ current, onNavigate }: { current: Page; onNavigate: (page: Page) => void }) {
  return (
    <header className="nav">
      <button className="nav-brand" onClick={() => onNavigate('discover')}>
        <Logo /> on campus
      </button>
      <nav aria-label="Main">
        {LINKS.map(({ page, label }) => (
          <button
            key={page}
            className={`pill ${current === page ? 'pill-active' : ''}`}
            aria-current={current === page ? 'page' : undefined}
            onClick={() => onNavigate(page)}
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}
