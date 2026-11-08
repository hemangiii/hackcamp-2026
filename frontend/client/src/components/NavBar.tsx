import { Logo } from './Logo';

export type Page = 'discover' | 'create' | 'mine' | 'profile';

const LINKS: { page: Page; label: string }[] = [
  { page: 'discover', label: 'Discover' },
  { page: 'create', label: 'Create activity' },
  { page: 'mine', label: 'My activities' },
  { page: 'profile', label: 'Profile' },
];

export function NavBar({
  current,
  onNavigate,
  onLogOut,
}: {
  current: Page;
  onNavigate: (page: Page) => void;
  onLogOut: () => void;
}) {
  return (
    <header className="nav">
      <button className="nav-brand" onClick={() => onNavigate('discover')}>
        <Logo size={30} /> on campus
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
        <button className="link nav-logout" onClick={onLogOut}>
          Log out
        </button>
      </nav>
    </header>
  );
}
