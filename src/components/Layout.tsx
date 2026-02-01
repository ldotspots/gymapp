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
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
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
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
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
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs font-medium">Profile</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
