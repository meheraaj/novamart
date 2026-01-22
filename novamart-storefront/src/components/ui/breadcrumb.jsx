'use client';

import React from 'react';
import ActiveLink from '@components/ui/active-link';
import useBreadcrumb, { convertBreadcrumbTitle } from '@utils/use-breadcrumb';
import { IoChevronForward, IoHomeOutline } from 'react-icons/io5';
import { ROUTES } from '@utils/routes';
import { useTranslation } from 'src/app/i18n/client';

const BreadcrumbItem = ({ children, ...props }) => {
    return (
        <li
            className="text-sm text-brand-muted px-2.5 transition duration-200 ease-in ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 hover:text-brand-dark"
            {...props}
        >
            {children}
        </li>
    );
};

const BreadcrumbSeparator = ({ children, ...props }) => {
    return (
        <li className="text-base text-brand-dark mt-[1px]" {...props}>
            {children}
        </li>
    );
};

export const BreadcrumbItems = (props) => {
    let children = React.Children.toArray(props.children);

    children = children.map((child, index) => (
        <BreadcrumbItem key={`breadcrumb_item${index}`}>{child}</BreadcrumbItem>
    ));

    const lastIndex = children.length - 1;

    children = children.reduce((acc, child, index) => {
        const notLast = index < lastIndex;
        if (notLast) {
            acc.push(
                child,
                <BreadcrumbSeparator key={`breadcrumb_sep${index}`}>
                    {props.separator}
                </BreadcrumbSeparator>,
            );
        } else {
            acc.push(child);
        }
        return acc;
    }, []);

    return (
        <div className="flex items-center borobazarBreadcrumb">
            <ol className="flex items-center w-full overflow-hidden">{children}</ol>
        </div>
    );
};

const Breadcrumb = ({
    separator = (
        <IoChevronForward className="text-brand-dark text-opacity-40 text-15px" />
    ),
    lang,
}) => {
    const breadcrumbs = useBreadcrumb();
    const { t } = useTranslation(lang, 'common');
    return (
        <BreadcrumbItems separator={separator}>
            {/* 1. FIXED HOME LINK: Removed legacyBehavior and <a> */}
            <ActiveLink
                href={`${ROUTES.HOME}`}
                activeClassName="font-semibold text-heading"
                className="inline-flex items-center"
            >
                <IoHomeOutline className="ltr:mr-1.5 rtl:ml-1.5 text-brand-dark text-15px" />
                {t('breadcrumb-home')}
            </ActiveLink>

            {/* 2. FIXED DYNAMIC LINKS: Removed legacyBehavior and <a> */}
            {breadcrumbs?.map((breadcrumb) => (
                <ActiveLink
                    href={breadcrumb.href}
                    activeClassName="font-semibold text-heading"
                    className="capitalize"
                    key={breadcrumb.href}
                    lang={lang}
                >
                    {convertBreadcrumbTitle(breadcrumb.breadcrumb)}
                </ActiveLink>
            ))}
        </BreadcrumbItems>
    );
};

export default Breadcrumb;
