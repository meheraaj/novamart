'use client';

import { usePathname } from 'next/navigation';
import { useLogoutMutation } from '@framework/auth/use-logout';
import { useTranslation } from 'src/app/i18n/client';
import LogoutIcon from '@components/icons/account-logout';
import Link from '@components/ui/link';

export default function AccountNav({ options, lang }) {
  const { t } = useTranslation(lang, 'common');
  const { mutate: logout } = useLogoutMutation(lang);
  const pathname = usePathname();

  // Logic to determine active state based on URL segments
  const isActive = (slug) => {
    return pathname === slug || pathname.endsWith(slug);
  };

  console.log('Path Debug v2:', { pathname });

  return (
    <nav className="flex flex-col pb-2 overflow-hidden border rounded-md md:pb-6 border-border-base">
      {options.map((item) => {
        const active = isActive(item.slug);

        return (
          <Link
            key={item.slug}
            href={`${item.slug}`}
            className={`flex items-center cursor-pointer text-sm lg:text-15px text-brand-dark py-3.5 px-3.5 xl:px-4 2xl:px-5 mb-1 ${active ? 'bg-gray-100 ' : 'font-normal'
              }`}
          >
            <span className="flex justify-center w-9 xl:w-10 shrink-0">
              {item.icon}
            </span>
            <span className="ltr:pl-1 lg:rtl:pr-1.5">{t(item.name)}</span>
          </Link>
        );
      })}

      <button
        className="flex items-center text-sm lg:text-15px text-brand-dark py-3.5 px-3.5 xl:px-4 2xl:px-5 mb-1 cursor-pointer focus:outline-none"
        onClick={() => logout()}
      >
        <span className="flex justify-center w-9 xl:w-10 shrink-0">
          <LogoutIcon className="w-5 md:w-5.5 h-5 md:h-5.5" />
        </span>
        <span className="ltr:pl-1 lg:rtl:pr-1.5">{t('text-logout')}</span>
      </button>
    </nav>
  );
}
