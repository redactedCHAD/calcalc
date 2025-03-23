import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children, title = 'ACalc - Food Tracker' }) {
  const router = useRouter();
  
  const navLinks = [
    { href: '/', label: 'Home', icon: 'home' },
    { href: '/journal', label: 'Journal', icon: 'journal' },
    { href: '/scan', label: 'Scan', icon: 'scan' },
    { href: '/profile', label: 'Profile', icon: 'profile' },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Track your calories and nutrition with ACalc" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            ACalc
          </Link>
          
          <nav className="flex space-x-6">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} active={router.pathname === link.href}>
                <span className="mr-2">
                  <Icon name={link.icon} />
                </span>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      
      <footer className="bg-gray-50 border-t">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-neutral">
          <p>© {new Date().getFullYear()} ACalc - Track your nutrition with ease</p>
        </div>
      </footer>
    </div>
  );
}

// NavLink component for consistent styling
const NavLink = ({ children, href, active }) => {
  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 rounded-md transition-colors ${
        active
          ? 'bg-primary text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  );
};

// Icon component to render the appropriate icon based on the name
const Icon = ({ name }) => {
  switch (name) {
    case 'home':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case 'journal':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    case 'scan':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1v-2a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      );
    case 'profile':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    default:
      return null;
  }
}; 