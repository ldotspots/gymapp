import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export default function Layout({ children, hideNav = false }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {!hideNav && (
        <nav className="bg-surface border-t border-border">
          <div className="flex justify-around items-center h-20">
            <Link
              to="/workout"
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive('/workout')
                  ? 'text-accent'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              <span className="text-2xl mb-1">📸</span>
              <span className="text-xs font-medium">Workout</span>
            </Link>

            <Link
              to="/history"
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive('/history')
                  ? 'text-accent'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              <span className="text-2xl mb-1">🕐</span>
              <span className="text-xs font-medium">History</span>
            </Link>

            <Link
              to="/profile"
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive('/profile')
                  ? 'text-accent'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              <span className="text-2xl mb-1">👤</span>
              <span className="text-xs font-medium">Profile</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
