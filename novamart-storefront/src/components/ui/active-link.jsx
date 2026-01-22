'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const ActiveLink = ({
    children,
    activeClassName,
    href,
    className: baseClassName = '',
    ...props
}) => {
    const pathname = usePathname();
    
    // Logic to determine if the link is active
    // This checks if the current URL matches the href
    const isActive = pathname === href || pathname.startsWith(`${href}/`);

    // Combine classes: base class + active class (if active)
    const combinedClassName = `${baseClassName} ${isActive ? activeClassName : ''}`.trim();

    return (
        <Link href={href} className={combinedClassName} {...props}>
            {children}
        </Link>
    );
};

export default ActiveLink;