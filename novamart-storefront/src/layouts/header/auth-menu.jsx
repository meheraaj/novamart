import Link from '@components/ui/link';

export default function AuthMenu({
    isAuthorized,
    href,
    btnProps,
    children,
}) {
    return isAuthorized ? (
        <Link
            href={href}
            className="text-sm font-normal lg:text-15px text-brand-dark focus:outline-none ltr:ml-2 rtl:mr-2"
        >
            {children}
        </Link>
    ) : (
        <button
            className="text-sm font-normal lg:text-15px text-brand-dark focus:outline-none ltr:ml-2 rtl:mr-2"
            aria-label="Authentication"
            {...btnProps}
        />
    );
}
