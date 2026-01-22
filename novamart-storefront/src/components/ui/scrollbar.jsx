import cn from 'classnames';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';

const Scrollbar = ({
    options,
    children,
    style,
    className,
    ...props
}) => {
    return (
        <OverlayScrollbarsComponent
            options={{
                className: cn('os-theme-thin', className),
                scrollbars: {
                    autoHide: 'scroll',
                },
                ...options,
            }}
            style={style}
            {...props}
        >
            {children}
        </OverlayScrollbarsComponent>
    );
};

export default Scrollbar;
