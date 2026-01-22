'use client';

import { Fragment, useState, useEffect, useMemo } from 'react';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from '@headlessui/react';
import { FaChevronDown } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';
import { useLogoutMutation } from '@framework/auth/use-logout';
import LogoutIcon from '@components/icons/account-logout';
import { useTranslation } from 'src/app/i18n/client';

export default function AccountNavMobile({ options, lang }) {
  const { t } = useTranslation(lang, 'common');
  const router = useRouter();
  const pathname = usePathname();

  // Memoize the pathname logic to prevent re-calculation on every render
  const currentSelectedItem = useMemo(() => {
    const pathnameSplit = pathname.split('/');
    // Assumes the URL structure is /lang/slug...
    const slugWithoutLang = `/${pathnameSplit.slice(2).join('/')}`;
    return options.find((o) => o.slug === slugWithoutLang) || options[0];
  }, [pathname, options]);

  const [selectedItem, setSelectedItem] = useState(currentSelectedItem);

  // Sync internal state with URL changes
  useEffect(() => {
    setSelectedItem(currentSelectedItem);
  }, [currentSelectedItem]);

  function handleItemClick(option) {
    setSelectedItem(option);
    router.push(`${option.slug}`);
  }

  const { mutate: logout } = useLogoutMutation(lang);

  return (
    <Listbox value={selectedItem} onChange={handleItemClick}>
      {({ open }) => (
        <div className="relative w-full font-body">
          <ListboxButton className="relative flex items-center w-full p-4 border rounded cursor-pointer text-brand-dark md:p-5 ltr:text-left rtl:text-right focus:outline-none border-border-base bg-brand-light">
            <span className="flex items-center shrink-0">
              {selectedItem?.icon}
            </span>
            <span className="flex truncate items-center text-sm md:text-15px font-medium ltr:pl-2.5 rtl:pr-2.5 relative">
              {t(selectedItem?.name)}
            </span>
            <span className="absolute inset-y-0 flex items-center pointer-events-none ltr:right-4 rtl:left-4 md:ltr:right-5 md:rtl:left-5">
              <FaChevronDown
                className={`w-3 md:w-3.5 h-3 md:h-3.5 text-brand-dark text-opacity-70 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
                aria-hidden="true"
              />
            </span>
          </ListboxButton>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              className="absolute z-20 w-full py-2.5 mt-1.5 overflow-auto bg-brand-light rounded-md shadow-dropDown max-h-72 focus:outline-none text-sm md:text-15px border border-border-base"
            >
              {options?.map((option, index) => (
                <ListboxOption
                  key={`account-nav-key-${index}`}
                  className={({ active }) =>
                    `cursor-pointer relative py-3 px-4 md:px-5 transition-colors ${active ? 'text-brand-dark bg-fill-dropdown-hover' : 'text-brand-muted'
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <span className="flex items-center">
                      <span className="flex items-center shrink-0 w-5 h-5">
                        {option?.icon}
                      </span>
                      <span
                        className={`block truncate ltr:pl-2.5 rtl:pr-2.5 md:ltr:pl-3 md:rtl:pr-3 ${selected ? 'font-semibold text-brand-dark' : 'font-normal'
                          }`}
                      >
                        {t(option?.name)}
                      </span>
                    </span>
                  )}
                </ListboxOption>
              ))}

              {/* Divider for Logout */}
              <div className="w-full h-px bg-border-base my-1" />

              <button
                className="flex items-center w-full px-4 py-3 text-sm cursor-pointer lg:text-15px text-brand-dark md:px-5 focus:outline-none hover:bg-fill-dropdown-hover transition-colors"
                onClick={() => logout()}
              >
                <span className="flex justify-center shrink-0">
                  <LogoutIcon className="w-5 md:w-5.5 h-5 md:h-5.5" />
                </span>
                <span className="block truncate ltr:pl-2.5 rtl:pr-2.5 md:ltr:pl-3 md:rtl:pr-3 font-normal">
                  {t('text-logout')}
                </span>
              </button>
            </ListboxOptions>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}