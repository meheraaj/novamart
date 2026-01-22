import { useState } from 'react';
import Link from '@components/ui/link';
import { siteSettings } from '@settings/site-settings';
import Scrollbar from '@components/ui/scrollbar';
import { IoIosArrowDown } from 'react-icons/io';
import Logo from '@components/ui/logo';
import { useUI } from '@contexts/ui.context';
import cn from 'classnames';

import {
    IoLogoInstagram,
    IoLogoTwitter,
    IoLogoFacebook,
    IoLogoYoutube,
    IoClose,
} from 'react-icons/io5';
import { useTranslation } from 'src/app/i18n/client';
import dynamic from 'next/dynamic';
import { ROUTES } from '@utils/routes';
import { useModalAction } from '@components/common/modal/modal.context';
import Search from '@components/common/search';
import UserIcon from '@components/icons/user-icon';

const AuthMenu = dynamic(() => import('./auth-menu'), {
    ssr: false,
});
const CartButton = dynamic(() => import('@components/cart/cart-button'), {
    ssr: false,
});

const social = [
    {
        id: 0,
        link: 'https://www.facebook.com/redqinc/',
        icon: <IoLogoFacebook />,
        className: 'facebook',
        title: 'text-facebook',
    },
    {
        id: 1,
        link: 'https://twitter.com/redqinc',
        icon: <IoLogoTwitter />,
        className: 'twitter',
        title: 'text-twitter',
    },
    {
        id: 2,
        link: 'https://www.youtube.com/channel/UCjld1tyVHRNy_pe3ROLiLhw',
        icon: <IoLogoYoutube />,
        className: 'youtube',
        title: 'text-youtube',
    },
    {
        id: 3,
        link: 'https://www.instagram.com/redqinc/',
        icon: <IoLogoInstagram />,
        className: 'instagram',
        title: 'text-instagram',
    },
];

export default function MobileMenu({ lang }) {
    const [activeMenus, setActiveMenus] = useState([]);
    const { site_header } = siteSettings;
    const { closeSidebar, isAuthorized } = useUI();
    const { openModal } = useModalAction();
    const { t } = useTranslation(lang, 'menu');

    function handleLogin() {
        openModal('LOGIN_VIEW');
    }
    const handleArrowClick = (menuName) => {
        let newActiveMenus = [...activeMenus];
        if (newActiveMenus.includes(menuName)) {
            var index = newActiveMenus.indexOf(menuName);
            if (index > -1) {
                newActiveMenus.splice(index, 1);
            }
        } else {
            newActiveMenus.push(menuName);
        }
        setActiveMenus(newActiveMenus);
    };

    const ListMenu = ({
        dept,
        data,
        hasSubMenu,
        menuName,
        menuIndex,
        className = '',
    }) =>
        data.label && (
            <li className={`transition-colors duration-200 ${className}`}>
                <div className="relative flex items-center justify-between">
                    <Link
                        href={`${data.path}`}
                        className="relative w-full py-4 transition duration-300 ease-in-out menu-item ltr:pl-5 rtl:pr-5 md:ltr:pl-7 md:rtl:pr-7 ltr:pr-4 rtl:pl-4 text-brand-dark"
                    >
                        <span className="block w-full" onClick={closeSidebar}>
                            {t(`${data.label}`)}
                        </span>
                    </Link>
                    {hasSubMenu && (
                        <div
                            className="cursor-pointer w-full h-8 text-[17px] px-5 shrink-0 flex items-center justify-end text-brand-dark text-opacity-80 absolute ltr:right-0 rtl:left-0 top-1/2 transform -translate-y-1/2"
                            onClick={() => handleArrowClick(menuName)}
                        >
                            <IoIosArrowDown
                                className={`transition duration-200 ease-in-out transform ${activeMenus.includes(menuName) ? '-rotate-180' : 'rotate-0'
                                    }`}
                            />
                        </div>
                    )}
                </div>
                {hasSubMenu && (
                    <SubMenu
                        dept={dept}
                        data={data.subMenu}
                        toggle={activeMenus.includes(menuName)}
                        menuIndex={menuIndex}
                    />
                )}
            </li>
        );

    const SubMenu = ({ dept, data, toggle, menuIndex }) => {
        if (!toggle) {
            return null;
        }

        dept = dept + 1;

        return (
            <ul className={cn('mobile-sub-menu', dept > 2 && 'ltr:-ml-4 rtl:-mr-4')}>
                {data?.map((menu, index) => {
                    const menuName = `sidebar-submenu-${dept}-${menuIndex}-${index}`;

                    return (
                        <ListMenu
                            dept={dept}
                            data={menu}
                            hasSubMenu={menu.subMenu}
                            menuName={menuName}
                            key={menuName}
                            menuIndex={index}
                            className={cn(
                                dept > 1 && 'ltr:pl-4 rtl:pr-4',
                                dept > 2 && 'ltr:pl-8 rtl:pr-8',
                            )}
                        />
                    );
                })}
            </ul>
        );
    };

    return (
        <>
            <div className="flex flex-col justify-between w-full h-full">
                <div className="w-full border-b border-border-base flex justify-between items-center relative ltr:pl-5 rtl:pr-5 md:ltr:pl-7 md:rtl:pr-7 shrink-0 py-0.5">
                    <div role="button" onClick={closeSidebar} className="inline-flex">
                        <Logo />
                    </div>

                    <button
                        className="flex items-center justify-center px-4 py-5 text-2xl transition-opacity md:px-5 lg:py-8 focus:outline-none hover:opacity-60"
                        onClick={closeSidebar}
                        aria-label="close"
                    >
                        <IoClose className="text-brand-dark mt-0.5" />
                    </button>
                </div>

                <Scrollbar className="flex-grow mb-auto menu-scrollbar">
                    <div className="flex flex-col px-0 py-6 text-brand-dark h-[calc(100vh_-_150px)]">
                        <div className="px-5 pb-5">
                            <Search searchId="mobile-search" className="" lang={lang} />
                        </div>
                        <ul className="mobile-menu">
                            <li className="transition-colors duration-200">
                                <div className="relative flex items-center justify-between">
                                    <div className="relative w-full py-4 transition duration-300 ease-in-out menu-item ltr:pl-5 rtl:pr-5 md:ltr:pl-7 md:rtl:pr-7 ltr:pr-4 rtl:pl-4 text-brand-dark">
                                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                            <div className="flex-shrink-0">
                                                <UserIcon />
                                            </div>
                                            <AuthMenu
                                                isAuthorized={isAuthorized}
                                                href={ROUTES.ACCOUNT}
                                                btnProps={{
                                                    children: t('text-sign-in'),
                                                    onClick: handleLogin,
                                                }}
                                            >
                                                {t('text-account')}
                                            </AuthMenu>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="transition-colors duration-200">
                                <div className="relative flex items-center justify-between">
                                    <div className="relative w-full py-4 transition duration-300 ease-in-out menu-item ltr:pl-5 rtl:pr-5 md:ltr:pl-7 md:rtl:pr-7 ltr:pr-4 rtl:pl-4 text-brand-dark">
                                        <CartButton
                                            hideLabel={false}
                                            iconClassName="text-brand-dark"
                                            lang={lang}
                                        />
                                    </div>
                                </div>
                            </li>
                            {site_header.pagesMenu.map((menu, index) => {
                                const dept = 1;
                                const menuName = `sidebar-menu-${dept}-${index}`;

                                return (
                                    <ListMenu
                                        dept={dept}
                                        data={menu}
                                        hasSubMenu={menu.subMenu}
                                        menuName={menuName}
                                        key={menuName}
                                        menuIndex={index}
                                    />
                                );
                            })}
                        </ul>
                    </div>
                </Scrollbar>

                <div className="flex items-center justify-center py-5 -mx-3 border-t text-brand-light border-border-base px-7 shrink-0">
                    {social?.map((item, index) => (
                        <Link
                            href={item.link}
                            className={`text-heading mx-3 transition duration-300 ease-in text-brand-dark text-opacity-60 hover:text-brand ${item.className}`}
                            key={index}
                        >
                            <span className="sr-only">{t(`${item.title}`)}</span>
                            {item.icon}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
