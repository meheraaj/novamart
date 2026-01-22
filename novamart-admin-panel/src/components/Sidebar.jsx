'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'Orders', path: '/orders' },
    { name: 'Users', path: '/users' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-border-base h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-border-base">
        <h1 className="text-2xl font-bold text-brand">NovaMart Admin</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`block px-4 py-2 rounded-md transition-colors ${pathname === item.path
                  ? 'bg-brand text-white'
                  : 'text-brand-muted hover:bg-fill-base hover:text-brand-dark'
                  }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-full p-4 border-t border-border-base">
        <button
          onClick={() => {
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            window.location.href = '/login';
          }}
          className="w-full text-left px-4 py-2 text-brand-danger hover:bg-red-50 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
