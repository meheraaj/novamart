import NextLink from 'next/link';

const Link = ({ children, className, title, ...props }) => {
    return (
        <NextLink {...props} title={title} className={className}>
            {children}
        </NextLink>
    );
};

export default Link;
